import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { sendSms, smsConfigured } from "@/lib/sms";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isBusinessOpen } from "@/lib/hours";
import { enqueuePsaEvent } from "@/lib/psa-outbound";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?1?\d{10}$/, "Invalid phone number (10 digits)"),
  email: z.string().email().optional(),
  description: z.string().min(10).max(2000),
});

function makeReference(): string {
  return `EMG-${Date.now().toString(36).toUpperCase().slice(-6)}${crypto
    .randomBytes(2)
    .toString("hex")
    .toUpperCase()}`;
}

/**
 * After-hours emergency pager. Creates a URGENT ticket (1.5x rate disclosed
 * up front), pages the on-call tech by SMS when Twilio is configured, and
 * always emails the business. Returns a reference + live status URL.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`emergency:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. For an active emergency, call directly." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, phone, email, description } = schema.parse(body);
    const reference = makeReference();
    const afterHours = !isBusinessOpen();

    const prospect = await prisma.client.upsert({
      where: { slug: "website-leads" },
      update: {},
      create: {
        name: "Website Leads",
        slug: "website-leads",
        primaryContact: "Website Chat",
        primaryEmail: siteConfig.email,
        city: "Tampa",
        state: "FL",
        status: "ONBOARDING",
        portalEnabled: false,
      },
    });

    const contact = email
      ? await prisma.user.upsert({
          where: { email },
          update: { name },
          create: { email, name, role: "CLIENT", clientId: prospect.id },
        })
      : await prisma.user.create({
          data: { email: `emergency-${reference.toLowerCase()}@no-email.local`, name, role: "CLIENT", clientId: prospect.id },
        });

    const ticket = await prisma.ticket.create({
      data: {
        externalId: reference,
        title: `[EMERGENCY 1.5x] ${description.slice(0, 70)}`,
        description: [
          afterHours ? "Filed AFTER HOURS via the emergency pager." : "Filed via the emergency pager during business hours.",
          "Rate: 1.5x standard ($112.50/hr remote, $187.50/hr on-site) — disclosed before submit.",
          "",
          `Contact: ${name} · ${phone}${email ? ` <${email}>` : ""}`,
          "",
          "Description:",
          description,
        ].join("\n"),
        status: "OPEN",
        priority: "URGENT",
        category: "OTHER",
        source: "PHONE",
        clientId: prospect.id,
        createdById: contact.id,
        slaDueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    await prisma.activity.create({
      data: {
        type: "TICKET_CREATED",
        title: `Emergency paged: ${ticket.title}`,
        userId: contact.id,
        clientId: prospect.id,
        ticketId: ticket.id,
        metadata: { source: "emergency-pager", reference },
      },
    });

    await enqueuePsaEvent("ticket.created", {
      reference,
      title: ticket.title,
      priority: "URGENT",
      contact: { name, phone, email: email ?? null },
    });

    // Page the on-call tech.
    const onCall = process.env.EMERGENCY_SMS_TO;
    const pageBody = `NESSCO EMERGENCY ${reference}: ${name} ${phone} — ${description.slice(0, 140)}`;
    const smsSent = onCall ? await sendSms(onCall, pageBody) : false;

    await sendEmail({
      subject: `[EMERGENCY${afterHours ? " AFTER-HOURS" : ""}] ${reference} — ${name} ${phone}`,
      replyTo: email,
      text: [
        `EMERGENCY page received${afterHours ? " after hours" : ""}.`,
        "",
        `Reference: ${reference}`,
        `Contact: ${name} · ${phone}${email ? ` <${email}>` : ""}`,
        `On-call SMS paged: ${smsSent ? "yes" : `NO${onCall ? " (send failed)" : " (EMERGENCY_SMS_TO/TWILIO_* not configured — call them now)"}`}`,
        "",
        "Description:",
        description,
      ].join("\n"),
    });

    if (email) {
      try {
        await sendEmail({
          to: email,
          replyTo: siteConfig.email,
          subject: `Emergency received ${reference} — ${siteConfig.name}`,
          text: [
            `Hi ${name},`,
            "",
            "Your emergency page is in. A technician has been paged and will call",
            `${phone} ASAP${afterHours ? " — after-hours emergencies carry a 1.5x rate, agreed at submit" : ""}.`,
            "",
            `Track it live: https://${siteConfig.domain}/emergency/${reference}`,
            `If this is ransomware/a breach in progress, call ${siteConfig.phone} right now — don't wait.`,
            "",
            `— ${siteConfig.name}`,
          ].join("\n"),
        });
      } catch (error) {
        console.error("Emergency confirmation email failed:", error);
      }
    }

    return NextResponse.json({
      success: true,
      reference,
      statusUrl: `/emergency/${reference}`,
      afterHours,
      smsPaged: smsSent,
      smsConfigured: smsConfigured(),
    });
  } catch (error) {
    console.error("Emergency pager error:", error);
    return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
  }
}

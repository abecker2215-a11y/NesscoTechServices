import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { enqueuePsaEvent } from "@/lib/psa-outbound";
import crypto from "crypto";

const transcriptMsg = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const chatTicketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?1?\d{10}$/, "Invalid phone number (10 digits)"),
  summary: z.string().min(10, "Please describe the problem (min 10 characters)").max(2000),
  transcript: z.array(transcriptMsg).max(20).optional().default([]),
});

function makeReference(): string {
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `CHT-${Date.now().toString(36).toUpperCase().slice(-6)}${rand}`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`chat-ticket:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const validated = chatTicketSchema.parse(body);
    const reference = makeReference();

    // All chat-filed tickets live under a dedicated prospect client so the
    // portal, SLA views, and PSA sync treat them uniformly.
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

    const contact = await prisma.user.upsert({
      where: { email: validated.email },
      update: { name: validated.name },
      create: {
        email: validated.email,
        name: validated.name,
        role: "CLIENT",
        clientId: prospect.id,
      },
    });

    const transcriptText = (validated.transcript ?? [])
      .slice(-10)
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n");

    const ticket = await prisma.ticket.create({
      data: {
        externalId: reference,
        title: validated.summary.slice(0, 80),
        description: [
          "Filed from the website AI chat.",
          "",
          `Contact: ${validated.name} <${validated.email}> · ${validated.phone}`,
          "",
          "Summary:",
          validated.summary,
          ...(transcriptText ? ["", "Chat transcript (last 10):", transcriptText] : []),
        ].join("\n"),
        status: "OPEN",
        priority: "MEDIUM",
        category: "OTHER",
        source: "CHAT",
        clientId: prospect.id,
        createdById: contact.id,
        slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await prisma.activity.create({
      data: {
        type: "TICKET_CREATED",
        title: `Chat ticket filed: ${ticket.title}`,
        description: `Reference ${reference} · ${validated.name} <${validated.email}>`,
        userId: contact.id,
        clientId: prospect.id,
        ticketId: ticket.id,
        metadata: { source: "chat", reference },
      },
    });

    await enqueuePsaEvent("ticket.created", {
      ticketId: ticket.id,
      reference,
      title: ticket.title,
      priority: "MEDIUM",
      category: "OTHER",
      clientId: prospect.id,
    });

    await sendEmail({
      subject: `New chat ticket ${reference} — ${validated.name}`,
      replyTo: validated.email,
      text: [
        `Reference: ${reference}`,
        `Name: ${validated.name}`,
        `Email: ${validated.email}`,
        `Phone: ${validated.phone}`,
        "",
        "Summary:",
        validated.summary,
        ...(transcriptText ? ["", "Transcript:", transcriptText] : []),
      ].join("\n"),
    });

    try {
      await sendEmail({
        to: validated.email,
        replyTo: siteConfig.email,
        subject: `Ticket ${reference} filed — ${siteConfig.name}`,
        text: [
          `Hi ${validated.name},`,
          "",
          "Your ticket is filed and in our queue.",
          `Reference: ${reference}`,
          "",
          "What happens next:",
          "- We review every ticket within 2 hours during business hours (Mon–Fri 8am–6pm).",
          `- We'll reach out by phone (${validated.phone}) to discuss and schedule.`,
          "- No charges until we agree on the scope of work.",
          "",
          `Need us sooner? Call ${siteConfig.phone}.`,
          "",
          `— ${siteConfig.name}`,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Chat ticket confirmation email failed:", error);
    }

    return NextResponse.json({ success: true, reference, ticketId: ticket.id });
  } catch (error) {
    console.error("Chat ticket error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }
}

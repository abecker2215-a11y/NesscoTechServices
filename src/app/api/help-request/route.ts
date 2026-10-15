import { NextRequest, NextResponse } from "next/server";
import { helpRequestSchema } from "@/lib/validation";
import { sendEmail, dataUrlToAttachment } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { isEmergencyRequest } from "@/lib/help-workflow";
import { attributeReferralBooking } from "@/lib/referrals";
import { prisma } from "@/lib/prisma";

// Bots fill forms in milliseconds — humans take at least a few seconds
// from step 1 to submit. Instant submits are silently "accepted" but dropped.
const MIN_FILL_MS = 4000;

function fakeSuccess() {
  return NextResponse.json({
    success: true,
    message: "Request received. We'll contact you during business hours.",
    reference: `REQ-${Date.now().toString(36).toUpperCase()}`,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`help-request:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const validated = helpRequestSchema.parse(body);

    // Spam traps: honeypot filled or inhumanly fast submit → fake success.
    const fillMs = validated.startedAt ? Date.now() - Date.parse(validated.startedAt) : Number.POSITIVE_INFINITY;
    if (validated.contact.honeypot || fillMs < MIN_FILL_MS) {
      console.warn(`[spam] dropped help request from ${ip}`);
      return fakeSuccess();
    }

    const reference = `REQ-${Date.now().toString(36).toUpperCase()}`;

    const answerLines = Object.entries(validated.answers).map(
      ([key, value]) => `${key}: ${value}`
    );

    const photoNames = validated.photoNames ?? [];
    const photos = validated.photos ?? [];
    const isEmergency = isEmergencyRequest(validated.category, validated.answers);
    const attachments = photos
      .map((dataUrl, i) => dataUrlToAttachment(dataUrl, photoNames[i] ?? `photo-${i + 1}`))
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .slice(0, 3);

    // 1) Notify the business (with customer photos attached when provided).
    await sendEmail({
      subject: `${isEmergency ? "[URGENT] " : ""}New help request ${reference} — ${validated.contact.name}`,
      replyTo: validated.contact.email,
      attachments: attachments.length > 0 ? attachments : undefined,
      text: [
        ...(isEmergency ? ["PRIORITY: ACTIVE SECURITY INCIDENT — respond first.", ""] : []),
        `Reference: ${reference}`,
        `Category: ${validated.category}`,
        "",
        "Answers:",
        answerLines.join("\n"),
        "",
        "Contact:",
        `Name: ${validated.contact.name}`,
        `Email: ${validated.contact.email}`,
        `Phone: ${validated.contact.phone}`,
        `Preferred contact: ${validated.contact.preferredContact}`,
        `Preferred time: ${validated.contact.preferredTime ?? "Not specified"}`,
        `Service preference: ${validated.contact.preference}`,
        "",
        "Description:",
        validated.contact.description,
        "",
        attachments.length > 0
          ? `Photos: ${attachments.length} attached (${attachments.map((a) => a.filename).join(", ")}).`
          : "Photos: none attached.",
      ].join("\n"),
    });

    // 2) Confirm to the customer (never fails the request if this bounces).
    try {
      await sendEmail({
        to: validated.contact.email,
        replyTo: siteConfig.email,
        subject: `We got your request ${reference} — ${siteConfig.name}`,
        text: [
          `Hi ${validated.contact.name},`,
          "",
          "Thanks for reaching out — your request is in our queue.",
          `Reference: ${reference}`,
          "",
          ...(isEmergency
            ? [
                "You flagged this as urgent, so we've marked it priority. For the fastest response, call us now — don't wait for email.",
                "",
              ]
            : []),
          "What happens next:",
          "- We review every request within 2 hours during business hours (Mon–Fri 8am–6pm).",
          `- We'll reach out via ${validated.contact.preferredContact === "call" ? "phone" : validated.contact.preferredContact} to discuss and schedule.`,
          "- No charges until we agree on the scope of work.",
          "",
          `Need us sooner? Call ${siteConfig.phone}.`,
          "",
          `— ${siteConfig.name}`,
          `${siteConfig.domain} · ${siteConfig.address}`,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Help request confirmation email failed:", error);
    }

    // 3) Referral attribution (never fails the request).
    await attributeReferralBooking(validated.contact.referralCode, validated.contact.email);

    // 4) Close out any funnel draft for this email (recovery cron skips it).
    try {
      await prisma.funnelDraft.updateMany({
        where: { email: validated.contact.email, submittedAt: null },
        data: { submittedAt: new Date() },
      });
    } catch (error) {
      console.error("Funnel draft close-out failed:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Request received. We'll contact you during business hours.",
      reference,
    });
  } catch (error) {
    console.error("Help request validation error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }
}

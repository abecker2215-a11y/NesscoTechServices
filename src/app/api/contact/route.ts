import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { attributeReferralBooking } from "@/lib/referrals";
import { prisma } from "@/lib/prisma";

const MIN_FILL_MS = 4000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`contact:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Spam traps → fake success (don't alert the bot).
    const fillMs = validated.startedAt ? Date.now() - Date.parse(validated.startedAt) : Number.POSITIVE_INFINITY;
    if (fillMs < MIN_FILL_MS) {
      console.warn(`[spam] dropped contact form from ${ip}`);
      return NextResponse.json({ success: true, message: "Message received. We'll respond within 2 business hours." });
    }

    await sendEmail({
      subject: `New website contact (${validated.subject}) — ${validated.name}`,
      replyTo: validated.email,
      text: [
        `Name: ${validated.name}`,
        `Email: ${validated.email}`,
        `Phone: ${validated.phone}`,
        `Subject: ${validated.subject}`,
        "",
        "Message:",
        validated.message,
      ].join("\n"),
    });

    // Confirm to the sender (never fails the submission if this bounces).
    try {
      await sendEmail({
        to: validated.email,
        replyTo: siteConfig.email,
        subject: `Thanks for contacting ${siteConfig.name}`,
        text: [
          `Hi ${validated.name},`,
          "",
          "Thanks for reaching out — we've received your message and will respond within 2 business hours (Mon–Fri 8am–6pm).",
          "",
          `Need us sooner? Call ${siteConfig.phone}.`,
          "",
          `— ${siteConfig.name}`,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Contact confirmation email failed:", error);
    }

    await attributeReferralBooking(validated.referralCode, validated.email);

    try {
      await prisma.funnelDraft.updateMany({
        where: { email: validated.email, submittedAt: null },
        data: { submittedAt: new Date() },
      });
    } catch (error) {
      console.error("Funnel draft close-out failed:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Message received. We'll respond within 2 business hours.",
    });
  } catch (error) {
    console.error("Contact form validation error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid form data" },
      { status: 400 }
    );
  }
}
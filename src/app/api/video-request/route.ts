import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  serviceSlug: z.string().min(1).max(100),
});

/** "Film this fix" backlog: visitor votes for the next proof video. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`video-request:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ success: false }, { status: 429 });
  }
  try {
    const body = await request.json();
    const { email, serviceSlug } = schema.parse(body);
    await sendEmail({
      subject: `Video request: ${serviceSlug} — ${email}`,
      replyTo: email,
      text: `A visitor wants a proof video.\n\nService: ${serviceSlug}\nEmail: ${email}\n\nMost-requested fixes get filmed first.`,
    });
    try {
      await sendEmail({
        to: email,
        subject: "You're on the video list — Nessco Tech Services",
        text: `Thanks — you're on the list for the next ${serviceSlug} fix video.\n\nWe film the most-requested problems first, and you'll get the link the day it drops.\n\n— Nessco Tech Services`,
      });
    } catch (error) {
      console.error("Video request confirmation failed:", error);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}

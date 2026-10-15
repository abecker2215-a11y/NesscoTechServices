import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

/**
 * Draft recovery: emails the user a link to resume their in-progress
 * get-help request. Drafts live in device localStorage, so the link
 * reopens the flow where the step-1 resume banner picks it up.
 * Graceful no-op when RESEND_API_KEY is unset.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`resume:${ip}`, rateLimits.api.limit, rateLimits.api.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  let body: { email?: string; step?: number } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = body?.email?.trim() ?? "";
  const step = Math.min(Math.max(Number(body?.step) || 1, 1), 4);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  }

  const link = `https://${siteConfig.domain}/get-help/step-${step}`;
  const emailed = await sendEmail({
    to: email,
    subject: "Pick up your Nessco help request",
    text: `Hi — here's your link to finish your IT help request (step ${step} of 5). Open it on the same device and browser where you started, and your answers will still be there.\n\n${link}\n\nWe reply within 2 business hours, Mon–Fri 8am–6pm. Need us sooner? Call ${siteConfig.phone}.`,
  });

  return NextResponse.json({ ok: true, emailed });
}

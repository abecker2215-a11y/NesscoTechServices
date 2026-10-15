import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

/**
 * New-guide alerts: one email per new guide, no spam ever. Notifies the
 * business (manual list until a provider is wired) and confirms to the
 * subscriber. Graceful when RESEND_API_KEY is unset.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`subscribe:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  let body: { email?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = body?.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  await sendEmail({
    subject: `New guide-alert subscriber: ${email}`,
    text: `Add to the new-guides mailing list.\n\nEmail: ${email}\nSource: website guides page\n\nTODO: migrate to Resend Audiences / Buttondown when volume justifies it.`,
  });

  await sendEmail({
    to: email,
    subject: "You're on the list — new Nessco guides, no spam",
    text: `Thanks! You'll get one short email when we publish a new Fix-It Guide — usually 1–2 a month, unsubscribe anytime.\n\nMeanwhile, the full library is here: https://nesscotech.com/guides\n\n— Nessco Tech Services`,
  });

  return NextResponse.json({ ok: true });
}

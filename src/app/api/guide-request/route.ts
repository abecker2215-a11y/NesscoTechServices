import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

/**
 * "What should we write next?" — captures content demand and an optional
 * email for follow-up. Notifies the business; graceful no-op without
 * RESEND_API_KEY.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`guide-request:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  let body: { topic?: string; email?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const topic = body?.topic?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  if (topic.length < 4) {
    return NextResponse.json({ ok: false, error: "Tell us a little more about the topic." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "That email looks off." }, { status: 400 });
  }

  await sendEmail({
    subject: `Guide request: ${topic.slice(0, 80)}`,
    text: `A visitor requested a new Fix-It Guide.\n\nTopic: ${topic}\nContact: ${email || "(no email given)"}\n\nWrite it in lib/guides.ts — the index, search, sitemap, and llms.txt pick it up automatically.`,
    replyTo: email || undefined,
  });

  return NextResponse.json({ ok: true });
}

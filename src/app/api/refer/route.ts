import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeCode(): string {
  return `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function siteUrl(): string {
  return process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `https://${siteConfig.domain}`;
}

/**
 * Referral engine: referrer sends a friend $25 off their first fix and earns
 * $25 credit when the friend books. Every referral is a DB row so portal
 * users can track status and issue their own credit on conversion.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`refer:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }

  let body: { yourName?: string; yourEmail?: string; friendName?: string; friendEmail?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const yourName = body?.yourName?.trim() ?? "";
  const yourEmail = body?.yourEmail?.trim() ?? "";
  const friendName = body?.friendName?.trim() ?? "";
  const friendEmail = body?.friendEmail?.trim() ?? "";

  if (!yourName) return NextResponse.json({ ok: false, error: "Your name is required" }, { status: 400 });
  if (!emailRe.test(yourEmail)) return NextResponse.json({ ok: false, error: "Your email looks off" }, { status: 400 });
  if (!emailRe.test(friendEmail)) return NextResponse.json({ ok: false, error: "Your friend's email looks off" }, { status: 400 });

  const code = makeCode();
  const link = `${siteUrl()}/refer?code=${code}`;

  await prisma.referral.create({
    data: {
      code,
      referrerName: yourName,
      referrerEmail: yourEmail,
      friendName: friendName || null,
      friendEmail,
      status: "SENT",
    },
  });

  const invited = await sendEmail({
    to: friendEmail,
    subject: `${yourName} sent you $25 off stress-free IT help`,
    text: `Hi${friendName ? ` ${friendName}` : ""} — ${yourName} thought we could help with your tech.\n\nWe're ${siteConfig.name}: local Tampa Bay IT support with no jargon and no upsells. Remote fixes from $75/hr, on-site from $125/hr.\n\nYour $25-off code: ${code}\nStart here: ${link}\n\nMention the code when you reach out. When you book, ${yourName} gets $25 credit too.\n\n— ${siteConfig.name} · ${siteConfig.phone}`,
  });

  await sendEmail({
    subject: `New referral: ${yourName} → ${friendEmail} (${code})`,
    text: `Referral submitted on the website.\n\nFrom: ${yourName} <${yourEmail}>\nTo: ${friendName || "(no name)"} <${friendEmail}>\nCode: ${code}\nLink: ${link}\nFriend invited by email: ${invited ? "yes" : "no (email not configured — follow up manually)"}`,
    replyTo: yourEmail,
  });

  return NextResponse.json({ ok: true, code, invited });
}

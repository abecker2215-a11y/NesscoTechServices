import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";

function requireCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = request.nextUrl.searchParams.get("secret") ?? "";
  return provided.length === secret.length && provided === secret;
}

function reviewLink(): string {
  return (
    process.env.GOOGLE_REVIEW_URL ||
    `https://www.google.com/maps/search/${encodeURIComponent(`${siteConfig.name} Tampa FL`)}`
  );
}

/**
 * Review engine: tickets resolved/closed in the last 24h get ONE review ask
 * (email to the ticket creator); one nudge 7 days later if still unasked.
 * Feeds the live reviews widget + LocalBusiness schema.
 */
export async function GET(request: NextRequest) {
  if (!requireCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  let asked = 0;
  let nudged = 0;
  let skipped = 0;

  const recent = await prisma.ticket.findMany({
    where: {
      OR: [
        { resolvedAt: { gte: new Date(now - DAY) } },
        { closedAt: { gte: new Date(now - DAY) } },
      ],
      status: { in: ["RESOLVED", "CLOSED"] },
    },
    include: { createdBy: { select: { email: true, name: true } }, client: { select: { id: true, name: true } } },
    take: 100,
  });

  for (const t of recent) {
    const existing = await prisma.reviewRequest.findUnique({ where: { ticketId: t.id } });
    if (existing) {
      skipped++;
      continue;
    }
    const email = t.createdBy.email;
    if (!email) {
      skipped++;
      continue;
    }
    const ok = await sendEmail({
      to: email,
      replyTo: siteConfig.email,
      subject: `How'd we do on "${t.title.slice(0, 50)}"?`,
      text: [
        `Hi ${t.createdBy.name?.split(" ")[0] ?? "there"},`,
        "",
        "Your ticket is resolved. If we earned it, a 60-second Google review is the single biggest help to a local shop like ours:",
        "",
        reviewLink(),
        "",
        "Something wasn't right? Reply to this email and we'll make it right — that's the deal.",
        "",
        `— ${siteConfig.name} · ${siteConfig.phone}`,
      ].join("\n"),
    });
    if (ok) {
      await prisma.reviewRequest.create({
        data: { ticketId: t.id, clientId: t.client.id, email, asksSent: 1, lastSentAt: new Date() },
      });
      asked++;
    } else {
      skipped++;
    }
  }

  // One nudge, 7+ days later, for asks that went out but never repeated.
  const stale = await prisma.reviewRequest.findMany({
    where: { asksSent: 1, lastSentAt: { lt: new Date(now - 7 * DAY) } },
    take: 100,
  });
  for (const r of stale) {
    if (!r.email) continue;
    const ok = await sendEmail({
      to: r.email,
      subject: "Quick nudge: 60-second review?",
      text: [
        "Hi there,",
        "",
        "One nudge and then I'll stop: if your recent fix held up, a quick Google review keeps our little Tampa Bay shop thriving:",
        "",
        reviewLink(),
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
    });
    if (ok) {
      await prisma.reviewRequest.update({
        where: { id: r.id },
        data: { asksSent: 2, lastSentAt: new Date() },
      });
      nudged++;
    }
  }

  return NextResponse.json({ ok: true, asked, nudged, skipped });
}

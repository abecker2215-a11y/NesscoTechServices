import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { stormDripSteps, dripFooter } from "@/lib/storm-drip";

/**
 * Storm-report drip worker. Hit daily (Vercel Cron, cron-job.org, container
 * cron) with ?secret=$CRON_SECRET. Sends each due step once per lead.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const provided = request.nextUrl.searchParams.get("secret") ?? "";
  if (provided.length !== secret.length || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `https://${siteConfig.domain}`;
  const now = new Date();
  const results: { step: number; sent: number; failed: number }[] = [];

  for (const s of stormDripSteps) {
    const dueBefore = new Date(now.getTime() - s.dayOffset * 24 * 60 * 60 * 1000);
    const leads = await prisma.stormLead.findMany({
      where: {
        createdAt: { lte: dueBefore },
        unsubscribedAt: null,
        dripSends: { none: { step: s.step } },
      },
      take: 100,
    });

    let sent = 0;
    let failed = 0;
    for (const lead of leads) {
      const reportUrl = `${base}/storm-ready/report/${lead.reportToken}`;
      const unsubscribeUrl = `${base}/storm-ready/unsubscribe?token=${lead.reportToken}`;
      const ok = await sendEmail({
        to: lead.email,
        replyTo: siteConfig.email,
        subject: s.subject({ name: lead.name ?? undefined, score: lead.score }),
        text:
          s.body({
            name: lead.name ?? undefined,
            score: lead.score,
            reportUrl,
            unsubscribeUrl,
          }) + dripFooter(unsubscribeUrl),
      });
      if (ok) {
        await prisma.dripSend.create({ data: { leadId: lead.id, step: s.step } });
        sent++;
      } else {
        failed++;
      }
    }
    results.push({ step: s.step, sent, failed });
  }

  return NextResponse.json({ ok: true, results });
}

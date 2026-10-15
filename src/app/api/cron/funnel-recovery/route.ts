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

/**
 * Abandoned-funnel recovery: drafts stalled 20–72h with an email attached
 * but never submitted get ONE "still need help?" email with a resume link.
 */
export async function GET(request: NextRequest) {
  if (!requireCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const staleAfter = new Date(now - 20 * 60 * 60 * 1000);
  const tooOld = new Date(now - 72 * 60 * 60 * 1000);

  const drafts = await prisma.funnelDraft.findMany({
    where: {
      email: { not: null },
      submittedAt: null,
      recoveredAt: null,
      updatedAt: { lt: staleAfter, gte: tooOld },
    },
    take: 100,
  });

  let sent = 0;
  let failed = 0;
  for (const d of drafts) {
    const email = d.email as string;
    const step = Math.min(Math.max(d.step, 1), 4);
    const link = `https://${siteConfig.domain}/get-help/step-${step}`;
    const ok = await sendEmail({
      to: email,
      subject: `Still need a hand with that, ${d.name?.split(" ")[0] ?? "there"}?`,
      text: [
        `Hi${d.name ? ` ${d.name.split(" ")[0]}` : ""},`,
        "",
        `You started a help request${d.category ? ` (${d.category})` : ""} but didn't finish it — no worries, your answers are saved on your device.`,
        "",
        `Pick up where you left off (step ${step} of 5):`,
        link,
        "",
        "Open it on the same device and browser and everything will still be there.",
        `We reply within 2 business hours, Mon–Fri 8am–6pm. Need us sooner? Call ${siteConfig.phone}.`,
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
    });
    await prisma.funnelDraft.update({
      where: { id: d.id },
      data: { recoveredAt: new Date() },
    });
    if (ok) sent++;
    else failed++;
  }

  return NextResponse.json({ ok: true, checked: drafts.length, sent, failed });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { detectChurnSignals } from "@/lib/health";

function requireCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = request.nextUrl.searchParams.get("secret") ?? "";
  return provided.length === secret.length && provided === secret;
}

/**
 * Churn watch: scans ACTIVE clients for silence/overdue signals. One open
 * alert per client+reason; auto-resolves when the signal clears. Business
 * gets ONE email per new signal — act before they shop around.
 */
export async function GET(request: NextRequest) {
  if (!requireCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true },
    take: 500,
  });

  let newAlerts = 0;
  let resolved = 0;
  for (const c of clients) {
    const signals = await detectChurnSignals(c.id);
    const reasons = new Set(signals.map((s) => s.reason));

    // Auto-resolve cleared signals.
    const cleared = await prisma.churnAlert.updateMany({
      where: { clientId: c.id, resolvedAt: null, reason: { notIn: [...reasons] } },
      data: { resolvedAt: new Date() },
    });
    resolved += cleared.count;

    for (const s of signals) {
      const open = await prisma.churnAlert.findFirst({
        where: { clientId: c.id, reason: s.reason, resolvedAt: null },
      });
      if (open) continue;
      await prisma.churnAlert.create({
        data: { clientId: c.id, reason: s.reason, detail: s.detail },
      });
      newAlerts++;
      await sendEmail({
        subject: `Churn risk: ${c.name} — ${s.reason}`,
        text: [
          `Churn signal for ${c.name}:`,
          "",
          `${s.reason}: ${s.detail}`,
          "",
          "Suggested play: check the client health card in the portal, then reach out this week — a proactive call beats a rescue call.",
        ].join("\n"),
      });
    }
  }

  return NextResponse.json({ ok: true, clients: clients.length, newAlerts, resolved });
}

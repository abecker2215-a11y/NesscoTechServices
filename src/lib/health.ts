import { prisma } from "./prisma";

export interface HealthFactor {
  label: string;
  impact: number;
  ok: boolean;
}

export interface ClientHealth {
  score: number;
  grade: "A" | "B" | "C" | "D";
  factors: HealthFactor[];
  openUrgent: number;
  openHigh: number;
  overdueCount: number;
  overdueTotal: number;
}

/**
 * Client health score (0–100). Transparent and explainable: every deduction
 * is listed as a factor so the portal can show *why*, and the insights page
 * can turn the worst factors into project proposals.
 */
export async function getClientHealth(clientId: string): Promise<ClientHealth> {
  const [urgent, high, overdue, pending, maintenance] = await Promise.all([
    prisma.ticket.count({ where: { clientId, status: "OPEN", priority: "URGENT" } }),
    prisma.ticket.count({ where: { clientId, status: { in: ["OPEN", "IN_PROGRESS"] }, priority: "HIGH" } }),
    prisma.billing.findMany({ where: { clientId, status: "OVERDUE" }, select: { amount: true } }),
    prisma.billing.count({ where: { clientId, status: "PENDING" } }),
    prisma.asset.count({ where: { clientId, status: "MAINTENANCE" } }),
  ]);

  const factors: HealthFactor[] = [];
  let score = 100;

  const hit = (label: string, impact: number, ok: boolean) => {
    factors.push({ label, impact: ok ? 0 : impact, ok });
    if (!ok) score -= impact;
  };

  hit(`${urgent} urgent ticket${urgent === 1 ? "" : "s"} open`, Math.min(urgent * 15, 45), urgent === 0);
  hit(`${high} high-priority ticket${high === 1 ? "" : "s"} open`, Math.min(high * 8, 24), high === 0);
  const overdueTotal = overdue.reduce((s, b) => s + Number(b.amount), 0);
  hit(
    overdue.length > 0 ? `${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"} ($${overdueTotal.toFixed(2)})` : "No overdue invoices",
    Math.min(10 + overdue.length * 5, 30),
    overdue.length === 0
  );
  hit(`${pending} pending invoice${pending === 1 ? "" : "s"}`, Math.min(pending * 3, 15), pending === 0);
  hit(`${maintenance} asset${maintenance === 1 ? "" : "s"} in maintenance`, Math.min(maintenance * 2, 10), maintenance === 0);

  score = Math.max(0, Math.min(100, score));
  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D";

  return {
    score,
    grade,
    factors,
    openUrgent: urgent,
    openHigh: high,
    overdueCount: overdue.length,
    overdueTotal,
  };
}

export interface ChurnSignal {
  reason: string;
  detail: string;
}

/** Pure signal detection — the cron persists + emails, the UI just reads. */
export async function detectChurnSignals(clientId: string): Promise<ChurnSignal[]> {
  const signals: ChurnSignal[] = [];
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      users: { select: { lastLoginAt: true } },
      tickets: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      billings: { where: { status: "OVERDUE" }, select: { id: true, amount: true } },
    },
  });
  if (!client || client.status !== "ACTIVE") return signals;

  const logins = client.users.map((u) => u.lastLoginAt?.getTime() ?? 0).filter(Boolean);
  const lastLogin = logins.length > 0 ? Math.max(...logins) : 0;
  const loginAgeDays = lastLogin > 0 ? Math.floor((now - lastLogin) / DAY) : 999;
  if (loginAgeDays > 45) {
    signals.push({
      reason: "PORTAL_SILENCE",
      detail: lastLogin > 0 ? `No portal login in ${loginAgeDays} days` : "Nobody has ever logged into the portal",
    });
  }

  const lastTicket = client.tickets[0]?.createdAt.getTime() ?? 0;
  const clientAgeDays = Math.floor((now - client.createdAt.getTime()) / DAY);
  const ticketAgeDays = lastTicket > 0 ? Math.floor((now - lastTicket) / DAY) : 999;
  if (clientAgeDays > 90 && ticketAgeDays > 60) {
    signals.push({ reason: "TICKET_SILENCE", detail: `No tickets in ${ticketAgeDays} days (client is ${clientAgeDays} days old)` });
  }

  if (client.billings.length > 0) {
    const total = client.billings.reduce((s, b) => s + Number(b.amount), 0);
    signals.push({
      reason: "OVERDUE_BALANCE",
      detail: `${client.billings.length} overdue invoice${client.billings.length === 1 ? "" : "s"} totaling $${total.toFixed(2)}`,
    });
  }

  return signals;
}

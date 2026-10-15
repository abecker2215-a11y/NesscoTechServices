import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InsightsClient } from "@/components/portal/InsightsClient";
import { serialize } from "@/lib/serialize";
import { getClientHealth } from "@/lib/health";

const WINDOW_DAYS = 90;

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }
  const clientId = session.user.clientId;
  // Server component: reading the clock during render is intentional and safe
  // (no client re-render / hydration to be pure for).
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [byCategory, byStatus, recent, resolutions, health, churnAlerts] = await Promise.all([
    prisma.ticket.groupBy({
      by: ["category"],
      where: { clientId, createdAt: { gte: since } },
      _count: true,
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      where: { clientId, createdAt: { gte: since } },
      _count: true,
    }),
    prisma.ticket.findMany({
      where: { clientId, createdAt: { gte: since } },
      select: { id: true, title: true, category: true, priority: true, status: true, createdAt: true, resolvedAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.ticket.findMany({
      where: { clientId, resolvedAt: { gte: since } },
      select: { createdAt: true, resolvedAt: true, category: true },
    }),
    getClientHealth(clientId),
    prisma.churnAlert.findMany({
      where: { clientId, resolvedAt: null },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const resolvedHours = resolutions
    .filter((t) => t.resolvedAt)
    .map((t) => (t.resolvedAt!.getTime() - t.createdAt.getTime()) / 3600000);
  const avgResolutionHours =
    resolvedHours.length > 0
      ? resolvedHours.reduce((a, b) => a + b, 0) / resolvedHours.length
      : null;

  // Repeat-pattern rules → project proposals (the support-cost-to-pipeline engine).
  const catCounts: Record<string, number> = {};
  for (const c of byCategory) catCounts[c.category] = c._count;
  const proposals: { title: string; why: string; cta: string }[] = [];
  if ((catCounts.NETWORK ?? 0) >= 3) {
    proposals.push({
      title: "Network overhaul",
      why: `${catCounts.NETWORK} network tickets in ${WINDOW_DAYS} days — the pattern says infrastructure, not incidents. A one-visit survey + overhaul usually ends the drip.`,
      cta: "/get-help?category=wifi",
    });
  }
  if ((catCounts.BACKUP ?? 0) >= 2) {
    proposals.push({
      title: "Backup audit",
      why: `${catCounts.BACKUP} backup tickets in ${WINDOW_DAYS} days. Untested backups are guesses — a verified backup setup pays for itself the first time it matters.`,
      cta: "/get-help?category=other",
    });
  }
  if ((catCounts.EMAIL ?? 0) >= 3) {
    proposals.push({
      title: "Microsoft 365 tune-up",
      why: `${catCounts.EMAIL} email tickets in ${WINDOW_DAYS} days. MFA, retention, and shared-mailbox hygiene in one pass.`,
      cta: "/services/microsoft-365",
    });
  }
  if ((catCounts.SECURITY ?? 0) >= 2) {
    proposals.push({
      title: "Security review",
      why: `${catCounts.SECURITY} security tickets in ${WINDOW_DAYS} days. Hardening + staff briefing before something lands.`,
      cta: "/services/cybersecurity",
    });
  }
  if ((catCounts.ONBOARDING ?? 0) + (catCounts.OFFBOARDING ?? 0) >= 3) {
    proposals.push({
      title: "Managed onboarding",
      why: "Frequent joiner/leaver tickets. A checklist-driven onboarding package removes the per-hire scramble.",
      cta: "/services/business-it",
    });
  }

  return (
    <InsightsClient
      initialData={{
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
        windowDays: WINDOW_DAYS,
        byCategory: serialize(byCategory),
        byStatus: serialize(byStatus),
        recent: serialize(
          recent.map((t) => ({
            ...t,
            createdAt: t.createdAt.toISOString(),
            resolvedAt: t.resolvedAt?.toISOString() ?? null,
          }))
        ),
        avgResolutionHours,
        resolvedCount: resolutions.length,
        proposals,
        health: serialize(health),
        churnAlerts: serialize(
          churnAlerts.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))
        ),
      }}
    />
  );
}

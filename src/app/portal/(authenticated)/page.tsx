import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/portal/DashboardClient";
import { serializeTickets, serializeAssets, serializeBillings, serializeUsage, serializeMaintenanceWindows, serializeServiceRequests } from "@/lib/serialize";
import { serialize } from "@/lib/serialize";
import { daysAgo } from "@/lib/dates";
import { getClientHealth } from "@/lib/health";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.clientId) {
    return null;
  }

  const [tickets, assets, billings, usage, maintenanceWindows, serviceRequests, health] = await Promise.all([
    prisma.ticket.findMany({
      where: { clientId: session.user.clientId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { assignee: { select: { name: true, email: true } } },
    }),
    prisma.asset.findMany({
      where: { clientId: session.user.clientId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.billing.findMany({
      where: { clientId: session.user.clientId },
      orderBy: { periodEnd: "desc" },
      take: 3,
    }),
    prisma.usage.findMany({
      where: { 
        clientId: session.user.clientId,
        periodStart: { gte: daysAgo(30) },
      },
      orderBy: { periodStart: "desc" },
    }),
    prisma.maintenanceWindow.findMany({
      where: { 
        clientId: session.user.clientId,
        status: { in: ["SCHEDULED", "IN_PROGRESS"] },
      },
      orderBy: { scheduledStart: "asc" },
      take: 3,
    }),
    prisma.serviceRequest.findMany({
      where: { clientId: session.user.clientId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getClientHealth(session.user.clientId),
  ]);

  const ticketStats = tickets.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <DashboardClient
      initialData={{
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
        tickets: serializeTickets(tickets),
        ticketStats,
        assets: serializeAssets(assets),
        billings: serializeBillings(billings),
        usage: serializeUsage(usage),
        maintenanceWindows: serializeMaintenanceWindows(maintenanceWindows),
        serviceRequests: serializeServiceRequests(serviceRequests),
        health: serialize(health),
      }}
    />
  );
}
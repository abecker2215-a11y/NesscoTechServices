import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TicketsClient } from "@/components/portal/TicketsClient";
import { serializeTickets } from "@/lib/serialize";
import { TicketStatus } from "@prisma/client";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }

  const params = await searchParams;
  const statusParam = params.status as string | undefined;
  const page = parseInt(params.page as string) || 1;
  const limit = 20;

  // Validate status against enum
  const validStatuses = Object.values(TicketStatus);
  const status = statusParam && validStatuses.includes(statusParam as TicketStatus) ? statusParam as TicketStatus : undefined;

  const whereClause = {
    clientId: session.user.clientId,
    ...(status ? { status } : {}),
  };

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { assignee: { select: { name: true, email: true } } },
    }),
    prisma.ticket.count({ where: whereClause }),
  ]);

  const stats = await prisma.ticket.groupBy({
    by: ["status"],
    where: { clientId: session.user.clientId },
    _count: true,
  });

  const statusCounts = stats.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <TicketsClient
      initialData={{
        tickets: serializeTickets(tickets),
        total,
        page,
        limit,
        status: statusParam,
        statusCounts,
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
      }}
    />
  );
}
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { TicketDetailClient } from "@/components/portal/TicketDetailClient";
import { serializeTickets } from "@/lib/serialize";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }

  const ticket = await prisma.ticket.findFirst({
    where: { id, clientId: session.user.clientId },
    include: {
      assignee: { select: { name: true, email: true } },
      createdBy: { select: { name: true, email: true } },
      comments: {
        include: { author: { select: { name: true, email: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      client: { select: { name: true, slug: true } },
    },
  });

  if (!ticket) {
    notFound();
  }

  const serializedTicket = serializeTickets([ticket])[0];
  const serializedComments = ticket.comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  // Ensure all date fields are serialized and include related data
  const fullySerializedTicket = {
    ...serializedTicket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    resolvedAt: ticket.resolvedAt?.toISOString() ?? null,
    closedAt: ticket.closedAt?.toISOString() ?? null,
    createdBy: ticket.createdBy,
    client: ticket.client,
    assignee: ticket.assignee,
    comments: serializedComments,
  };

  return (
    <TicketDetailClient
      initialData={{
        ticket: fullySerializedTicket,
        currentUserId: session.user.id,
        currentUserRole: session.user.role,
      }}
    />
  );
}
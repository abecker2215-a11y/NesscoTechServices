import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { TicketStatus } from "@prisma/client";
import { enqueuePsaEvent } from "@/lib/psa-outbound";
import { notifyTicketParty } from "@/lib/push";

const createTicketSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  category: z.enum([
    "HARDWARE",
    "SOFTWARE",
    "NETWORK",
    "SECURITY",
    "EMAIL",
    "BACKUP",
    "ACCESS",
    "ONBOARDING",
    "OFFBOARDING",
    "OTHER",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  clientId: z.string().cuid(),
  createdById: z.string().cuid(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createTicketSchema.parse(body);

    // Verify the clientId matches the user's client
    if (validated.clientId !== session.user.clientId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Verify the user exists and belongs to the client
    const user = await prisma.user.findFirst({
      where: { id: validated.createdById, clientId: session.user.clientId },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }

    // Generate ticket number
    const ticketCount = await prisma.ticket.count({
      where: { clientId: session.user.clientId },
    });
    const ticketNumber = `TCK-${String(ticketCount + 1).padStart(6, "0")}`;

    // Determine SLA due date based on priority
    const slaHours = {
      LOW: 72,
      MEDIUM: 24,
      HIGH: 8,
      URGENT: 2,
    };
    const slaDueAt = new Date(Date.now() + slaHours[validated.priority] * 60 * 60 * 1000);

    const ticket = await prisma.ticket.create({
      data: {
        title: validated.title,
        description: validated.description,
        category: validated.category,
        priority: validated.priority,
        status: "OPEN",
        source: "PORTAL",
        clientId: validated.clientId,
        createdById: validated.createdById,
        slaDueAt,
      },
      include: {
        assignee: { select: { name: true, email: true } },
        createdBy: { select: { name: true, email: true } },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: "TICKET_CREATED",
        title: `Ticket created: ${ticket.title}`,
        description: `Priority: ${ticket.priority}, Category: ${ticket.category}`,
        userId: validated.createdById,
        clientId: validated.clientId,
        ticketId: ticket.id,
        metadata: { ticketNumber },
      },
    });

    // Two-way PSA sync (queued) + push to client admins on this client.
    await enqueuePsaEvent("ticket.created", {
      ticketId: ticket.id,
      ticketNumber,
      title: ticket.title,
      priority: ticket.priority,
      category: ticket.category,
      clientId: validated.clientId,
    });
    notifyTicketParty(ticket.id, validated.createdById, {
      title: `New ticket: "${ticket.title.slice(0, 40)}"`,
      body: `Priority ${ticket.priority} · ${ticketNumber}`,
      url: `/portal/tickets/${ticket.id}`,
      tag: `ticket-${ticket.id}`,
    }).catch(() => {});

    return NextResponse.json({ id: ticket.id, ticketNumber }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.flatten() }, { status: 400 });
    }
    console.error("Create ticket error:", error);
    return NextResponse.json({ message: "Failed to create ticket" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const where: Prisma.TicketWhereInput = { clientId: session.user.clientId };
    if (status && status !== "all") {
      const validStatuses = Object.values(TicketStatus);
      if (validStatuses.includes(status as TicketStatus)) {
        where.status = status as TicketStatus;
      }
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { assignee: { select: { name: true, email: true } } },
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List tickets error:", error);
    return NextResponse.json({ message: "Failed to fetch tickets" }, { status: 500 });
  }
}
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueuePsaEvent } from "@/lib/psa-outbound";
import { notifyTicketParty } from "@/lib/push";

const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  internal: z.boolean().default(false),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // Verify ticket exists and belongs to client
    const ticket = await prisma.ticket.findFirst({
      where: { id, clientId: session.user.clientId },
    });

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    // Clients cannot create internal comments
    if (validated.internal && session.user.role === "CLIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const comment = await prisma.ticketComment.create({
      data: {
        content: validated.content,
        internal: validated.internal,
        ticketId: id,
        authorId: session.user.id,
      },
      include: {
        author: { select: { name: true, email: true, image: true } },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: "TICKET_COMMENT",
        title: `Comment added to ticket`,
        description: validated.internal ? "Internal note added" : "Client comment added",
        userId: session.user.id,
        clientId: session.user.clientId,
        ticketId: id,
      },
    });

    // Two-way PSA sync (queued, never fails the request) + push to the
    // other party on the ticket.
    await enqueuePsaEvent("ticket.comment", {
      ticketId: id,
      ticketExternalId: ticket.externalId,
      commentId: comment.id,
      internal: validated.internal,
      author: session.user.email,
      content: validated.content.slice(0, 2000),
    });
    notifyTicketParty(id, session.user.id, {
      title: `New ${validated.internal ? "note" : "comment"} on "${ticket.title.slice(0, 40)}"`,
      body: validated.content.slice(0, 120),
      url: `/portal/tickets/${id}`,
      tag: `ticket-${id}`,
    }).catch(() => {});

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", errors: error.flatten() }, { status: 400 });
    }
    console.error("Create comment error:", error);
    return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.clientId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ticket = await prisma.ticket.findFirst({
      where: { id, clientId: session.user.clientId },
    });

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    const comments = await prisma.ticketComment.findMany({
      where: {
        ticketId: id,
        ...(session.user.role === "CLIENT" ? { internal: false } : {}),
      },
      include: { author: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}
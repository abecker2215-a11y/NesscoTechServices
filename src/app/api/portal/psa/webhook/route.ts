import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import {
  TicketStatus,
  Priority,
  TicketCategory,
  AssetType,
  AssetStatus,
  BillingType,
  BillingStatus,
  UsageMetric,
} from "@prisma/client";

interface PSAWebhookPayload {
  source: "CONNECTWISE" | "AUTOTASK" | "HALOPSA";
  event: string;
  ticket?: {
    id: string;
    externalId: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category?: string;
    assigneeEmail?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    closedAt?: string;
    clientIdentifier: string;
  };
  asset?: {
    id: string;
    externalId: string;
    name: string;
    type: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    os?: string;
    osVersion?: string;
    ipAddress?: string;
    macAddress?: string;
    location?: string;
    purchaseDate?: string;
    warrantyExpires?: string;
    status: string;
    clientIdentifier: string;
  };
  billing?: {
    id: string;
    externalId: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    invoiceUrl?: string;
    dueDate?: string;
    paidAt?: string;
    periodStart: string;
    periodEnd: string;
    clientIdentifier: string;
  };
  usage?: {
    metric: string;
    value: number;
    unit: string;
    periodStart: string;
    periodEnd: string;
    clientIdentifier: string;
  };
}

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

function coerceEnum<T extends Record<string, string>>(
  enumMap: T,
  raw: string | undefined,
  fallback: T[keyof T]
): T[keyof T] {
  if (!raw) return fallback;
  const normalized = raw.toUpperCase().replace(/[\s-]+/g, "_");
  return (Object.values(enumMap) as string[]).includes(normalized)
    ? (normalized as T[keyof T])
    : fallback;
}

function mapStatus(source: string, status: string): TicketStatus {
  const statusMaps: Record<string, Record<string, TicketStatus>> = {
    CONNECTWISE: {
      New: "OPEN",
      InProgress: "IN_PROGRESS",
      WaitingCustomer: "WAITING_CLIENT",
      WaitingVendor: "WAITING_VENDOR",
      Resolved: "RESOLVED",
      Closed: "CLOSED",
    },
    AUTOTASK: {
      New: "OPEN",
      InProgress: "IN_PROGRESS",
      "Waiting on Client": "WAITING_CLIENT",
      "Waiting on Vendor": "WAITING_VENDOR",
      Complete: "RESOLVED",
      Closed: "CLOSED",
    },
    HALOPSA: {
      Open: "OPEN",
      "In Progress": "IN_PROGRESS",
      "Awaiting User": "WAITING_CLIENT",
      "Awaiting Third Party": "WAITING_VENDOR",
      Resolved: "RESOLVED",
      Closed: "CLOSED",
    },
  };
  return statusMaps[source]?.[status] || (status.toUpperCase().replace(/\s+/g, "_") as TicketStatus);
}

function mapPriority(source: string, priority: string): Priority {
  const priorityMaps: Record<string, Record<string, Priority>> = {
    CONNECTWISE: {
      Low: "LOW",
      Medium: "MEDIUM",
      High: "HIGH",
      Critical: "URGENT",
    },
    AUTOTASK: {
      "1 - Critical": "URGENT",
      "2 - High": "HIGH",
      "3 - Medium": "MEDIUM",
      "4 - Low": "LOW",
    },
    HALOPSA: {
      Critical: "URGENT",
      High: "HIGH",
      Medium: "MEDIUM",
      Low: "LOW",
    },
  };
  return priorityMaps[source]?.[priority] || "MEDIUM";
}

async function handleTicketEvent(payload: PSAWebhookPayload) {
  if (!payload.ticket) return { success: false, message: "No ticket data" };

  const { ticket } = payload;
  const client = await prisma.client.findFirst({
    where: { OR: [{ slug: ticket.clientIdentifier }, { domain: ticket.clientIdentifier }] },
  });

  if (!client) {
    return { success: false, message: `Client not found: ${ticket.clientIdentifier}` };
  }

  const existingTicket = await prisma.ticket.findUnique({
    where: { externalId: ticket.externalId },
  });

  const status = mapStatus(payload.source, ticket.status);
  const priority = mapPriority(payload.source, ticket.priority);

  let assigneeId: string | undefined;
  if (ticket.assigneeEmail) {
    const assignee = await prisma.user.findFirst({
      where: { email: ticket.assigneeEmail, clientId: client.id },
    });
    if (assignee) assigneeId = assignee.id;
  }

  const ticketData = {
    externalId: ticket.externalId,
    title: ticket.title,
    description: ticket.description,
    status,
    priority,
    category: coerceEnum(TicketCategory, ticket.category, "OTHER"),
    source: "PSA_SYNC" as const,
    clientId: client.id,
    createdById: assigneeId || (await prisma.user.findFirst({ where: { clientId: client.id, role: "CLIENT_ADMIN" } }))?.id || "",
    assigneeId,
    slaDueAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    closedAt: ticket.closedAt ? new Date(ticket.closedAt) : null,
    updatedAt: new Date(ticket.updatedAt),
  };

  if (existingTicket) {
    const wasOpen =
      existingTicket.status !== "RESOLVED" && existingTicket.status !== "CLOSED";
    const nowClosed = status === "RESOLVED" || status === "CLOSED";
    await prisma.ticket.update({
      where: { id: existingTicket.id },
      data: ticketData,
    });

    await prisma.activity.create({
      data: {
        type: nowClosed && wasOpen ? "TICKET_RESOLVED" : "TICKET_UPDATED",
        title: `Ticket ${nowClosed && wasOpen ? "resolved" : "updated"} from ${payload.source}`,
        description: `Status: ${status}, Priority: ${priority}`,
        clientId: client.id,
        ticketId: existingTicket.id,
        metadata: { source: payload.source, externalId: ticket.externalId },
      },
    });

    // Push to the client on resolve (no outbound enqueue: this change came
    // FROM the PSA, echoing it back would loop).
    if (nowClosed && wasOpen) {
      const { notifyTicketParty } = await import("@/lib/push");
      notifyTicketParty(existingTicket.id, "", {
        title: `Resolved: "${ticket.title.slice(0, 40)}"`,
        body: "Your ticket is resolved — review request incoming.",
        url: `/portal/tickets/${existingTicket.id}`,
        tag: `ticket-${existingTicket.id}`,
      }).catch(() => {});
    }

    return { success: true, action: "updated", ticketId: existingTicket.id };
  } else {
    const newTicket = await prisma.ticket.create({
      data: {
        ...ticketData,
        createdAt: new Date(ticket.createdAt),
      },
    });

    await prisma.activity.create({
      data: {
        type: "TICKET_CREATED",
        title: `Ticket synced from ${payload.source}`,
        description: `External ID: ${ticket.externalId}`,
        clientId: client.id,
        ticketId: newTicket.id,
        metadata: { source: payload.source, externalId: ticket.externalId },
      },
    });

    return { success: true, action: "created", ticketId: newTicket.id };
  }
}

async function handleAssetEvent(payload: PSAWebhookPayload) {
  if (!payload.asset) return { success: false, message: "No asset data" };

  const { asset } = payload;
  const client = await prisma.client.findFirst({
    where: { OR: [{ slug: asset.clientIdentifier }, { domain: asset.clientIdentifier }] },
  });

  if (!client) {
    return { success: false, message: `Client not found: ${asset.clientIdentifier}` };
  }

  const existingAsset = await prisma.asset.findUnique({
    where: { externalId: asset.externalId },
  });

  const assetData = {
    externalId: asset.externalId,
    name: asset.name,
    type: coerceEnum(AssetType, asset.type, "OTHER"),
    manufacturer: asset.manufacturer,
    model: asset.model,
    serialNumber: asset.serialNumber,
    os: asset.os,
    osVersion: asset.osVersion,
    ipAddress: asset.ipAddress,
    macAddress: asset.macAddress,
    location: asset.location,
    purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate) : null,
    warrantyExpires: asset.warrantyExpires ? new Date(asset.warrantyExpires) : null,
    status: coerceEnum(AssetStatus, asset.status, "ACTIVE"),
    clientId: client.id,
  };

  if (existingAsset) {
    await prisma.asset.update({
      where: { id: existingAsset.id },
      data: assetData,
    });
    return { success: true, action: "updated", assetId: existingAsset.id };
  } else {
    const newAsset = await prisma.asset.create({ data: assetData });
    return { success: true, action: "created", assetId: newAsset.id };
  }
}

async function handleBillingEvent(payload: PSAWebhookPayload) {
  if (!payload.billing) return { success: false, message: "No billing data" };

  const { billing } = payload;
  const client = await prisma.client.findFirst({
    where: { OR: [{ slug: billing.clientIdentifier }, { domain: billing.clientIdentifier }] },
  });

  if (!client) {
    return { success: false, message: `Client not found: ${billing.clientIdentifier}` };
  }

  const existingBilling = await prisma.billing.findUnique({
    where: { externalId: billing.externalId },
  });

  const billingData = {
    externalId: billing.externalId,
    type: coerceEnum(BillingType, billing.type, "USAGE"),
    amount: billing.amount,
    currency: billing.currency,
    status: coerceEnum(BillingStatus, billing.status, "PENDING"),
    description: billing.description,
    invoiceUrl: billing.invoiceUrl,
    dueDate: billing.dueDate ? new Date(billing.dueDate) : null,
    paidAt: billing.paidAt ? new Date(billing.paidAt) : null,
    periodStart: new Date(billing.periodStart),
    periodEnd: new Date(billing.periodEnd),
    clientId: client.id,
  };

  if (existingBilling) {
    await prisma.billing.update({
      where: { id: existingBilling.id },
      data: billingData,
    });
    return { success: true, action: "updated", billingId: existingBilling.id };
  } else {
    const newBilling = await prisma.billing.create({ data: billingData });
    return { success: true, action: "created", billingId: newBilling.id };
  }
}

async function handleUsageEvent(payload: PSAWebhookPayload) {
  if (!payload.usage) return { success: false, message: "No usage data" };

  const { usage } = payload;
  const client = await prisma.client.findFirst({
    where: { OR: [{ slug: usage.clientIdentifier }, { domain: usage.clientIdentifier }] },
  });

  if (!client) {
    return { success: false, message: `Client not found: ${usage.clientIdentifier}` };
  }

  await prisma.usage.create({
    data: {
      metric: coerceEnum(UsageMetric, usage.metric, "REMOTE_HOURS"),
      value: usage.value,
      unit: usage.unit,
      periodStart: new Date(usage.periodStart),
      periodEnd: new Date(usage.periodEnd),
      clientId: client.id,
    },
  });

  return { success: true, action: "recorded" };
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-psa-signature") || request.headers.get("x-signature") || "";
    const source = request.headers.get("x-psa-source") as "CONNECTWISE" | "AUTOTASK" | "HALOPSA" | null;
    const event = request.headers.get("x-psa-event") || "";

    const secretMap: Record<string, string> = {
      CONNECTWISE: process.env.CONNECTWISE_WEBHOOK_SECRET || "",
      AUTOTASK: process.env.AUTOTASK_WEBHOOK_SECRET || "",
      HALOPSA: process.env.HALOPSA_WEBHOOK_SECRET || "",
    };

    const rawBody = await request.text();
    
    // Verify signature if secret is configured
    const secret = source ? secretMap[source] : "";
    if (secret && signature) {
      if (!verifySignature(rawBody, signature, secret)) {
        console.warn(`[PSA Webhook] Invalid signature from ${source || "unknown"}`);
        return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
      }
    }

    const payload: PSAWebhookPayload = JSON.parse(rawBody);
    payload.source = source || payload.source;

    console.log(`[PSA Webhook] Received ${payload.source} event: ${event}`);

    let result;
    switch (payload.ticket ? "ticket" : payload.asset ? "asset" : payload.billing ? "billing" : payload.usage ? "usage" : "unknown") {
      case "ticket":
        result = await handleTicketEvent(payload);
        break;
      case "asset":
        result = await handleAssetEvent(payload);
        break;
      case "billing":
        result = await handleBillingEvent(payload);
        break;
      case "usage":
        result = await handleUsageEvent(payload);
        break;
      default:
        return NextResponse.json({ message: "Unknown payload type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PSA Webhook] Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PSA Webhook endpoint",
    supportedSources: ["CONNECTWISE", "AUTOTASK", "HALOPSA"],
    events: ["ticket.created", "ticket.updated", "asset.created", "asset.updated", "billing.created", "billing.updated", "usage.recorded"],
    headers: {
      "x-psa-source": "Required: CONNECTWISE | AUTOTASK | HALOPSA",
      "x-psa-event": "Event type",
      "x-psa-signature": "HMAC-SHA256 signature (optional but recommended)",
    },
  });
}
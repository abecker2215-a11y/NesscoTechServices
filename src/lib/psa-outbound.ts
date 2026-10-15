import { prisma } from "./prisma";
import crypto from "crypto";

/**
 * Outbound PSA sync (portal → PSA). Portal-originated events are queued in
 * PsaOutbox and delivered by /api/cron/psa-outbox with retry, so a PSA
 * outage never fails a portal request.
 *
 * Configure ONE generic webhook receiver (your PSA middleware / Zapier /
 * Power Automate flow that writes into ConnectWise/Autotask/HaloPSA):
 *   PSA_OUTBOUND_URL     — https endpoint receiving the event envelope
 *   PSA_OUTBOUND_SECRET  — HMAC-SHA256 signing secret (X-PSA-Signature)
 *   PSA_OUTBOUND_SOURCE  — label, e.g. "NESSCO-PORTAL" (default)
 *
 * Envelope posted:
 *   { source, event, sentAt, data: {...} }
 */

export type PsaEvent =
  | "ticket.created"
  | "ticket.comment"
  | "ticket.resolved"
  | "billing.credit";

export async function enqueuePsaEvent(
  event: PsaEvent,
  payload: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.psaOutbox.create({
      data: {
        source: process.env.PSA_OUTBOUND_SOURCE || "NESSCO-PORTAL",
        event,
        payload: JSON.parse(JSON.stringify(payload)) as Record<string, string>,
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("[psa-out] enqueue failed:", error);
  }
}

function sign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export async function dispatchOutboxItem(id: string): Promise<boolean> {
  const item = await prisma.psaOutbox.findUnique({ where: { id } });
  if (!item || item.status === "SENT") return true;

  const url = process.env.PSA_OUTBOUND_URL;
  const secret = process.env.PSA_OUTBOUND_SECRET || "";

  if (!url) {
    await prisma.psaOutbox.update({
      where: { id },
      data: { status: "FAILED", attempts: item.attempts + 1, lastError: "PSA_OUTBOUND_URL not configured" },
    });
    return false;
  }

  const body = JSON.stringify({
    source: item.source,
    event: item.event,
    sentAt: new Date().toISOString(),
    data: item.payload,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-PSA-Signature": sign(body, secret) } : {}),
      },
      body,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    await prisma.psaOutbox.update({
      where: { id },
      data: { status: "SENT", attempts: item.attempts + 1, lastError: null },
    });
    return true;
  } catch (error) {
    await prisma.psaOutbox.update({
      where: { id },
      data: {
        status: "FAILED",
        attempts: item.attempts + 1,
        lastError: error instanceof Error ? error.message.slice(0, 500) : "dispatch failed",
      },
    });
    return false;
  }
}

export function psaOutboundConfigured(): boolean {
  return !!process.env.PSA_OUTBOUND_URL;
}

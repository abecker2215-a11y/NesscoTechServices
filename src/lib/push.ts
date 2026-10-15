import webpush from "web-push";
import { prisma } from "./prisma";

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const subject = process.env.VAPID_SUBJECT;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !pub || !priv) {
    console.warn("[push] VAPID keys not set — push disabled");
    return false;
  }
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/** Send a push to every subscription of a user. Dead endpoints pruned. */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<number> {
  if (!ensureConfigured()) return 0;
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ ...payload, url: payload.url ?? "/portal" })
      );
      sent++;
    } catch (error: unknown) {
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } }).catch(() => {});
      } else {
        console.error("[push] send failed:", error);
      }
    }
  }
  return sent;
}

/** Notify everyone on a ticket except the actor (creator + assignee). */
export async function notifyTicketParty(
  ticketId: string,
  actorUserId: string,
  payload: PushPayload
): Promise<void> {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { createdById: true, assigneeId: true, clientId: true },
    });
    if (!ticket) return;
    const targets = [ticket.createdById, ticket.assigneeId].filter(
      (id): id is string => !!id && id !== actorUserId
    );
    // Also notify other portal users on the same client (client admins).
    const admins = await prisma.user.findMany({
      where: { clientId: ticket.clientId, role: { in: ["CLIENT_ADMIN", "ADMIN"] }, id: { not: actorUserId } },
      select: { id: true },
    });
    const userIds = [...new Set([...targets, ...admins.map((a) => a.id)])];
    await Promise.all(userIds.map((id) => sendPushToUser(id, payload)));
  } catch (error) {
    console.error("[push] party notify failed:", error);
  }
}

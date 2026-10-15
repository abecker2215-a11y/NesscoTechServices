import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispatchOutboxItem } from "@/lib/psa-outbound";

function requireCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = request.nextUrl.searchParams.get("secret") ?? "";
  return provided.length === secret.length && provided === secret;
}

/** PSA outbox worker: delivers PENDING items (and retries FAILED < 5x). */
export async function GET(request: NextRequest) {
  if (!requireCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.psaOutbox.findMany({
    where: {
      OR: [{ status: "PENDING" }, { status: "FAILED", attempts: { lt: 5 } }],
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  let sent = 0;
  let failed = 0;
  for (const item of items) {
    if (await dispatchOutboxItem(item.id)) sent++;
    else failed++;
  }

  return NextResponse.json({ ok: true, processed: items.length, sent, failed });
}

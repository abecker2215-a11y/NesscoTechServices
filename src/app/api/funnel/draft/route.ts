import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

const draftSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().max(100).optional(),
  step: z.number().min(1).max(5).default(1),
  category: z.string().max(50).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

function fingerprint(request: NextRequest, email?: string): string {
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") ?? "";
  return `${ip}|${ua.slice(0, 80)}|${email ?? ""}`;
}

/**
 * Server-side funnel draft capture. The wizard beacons here on every step
 * transition; the recovery cron emails drafts that stalled with an email
 * attached but never submitted.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`funnel:${ip}`, rateLimits.api.limit, rateLimits.api.windowMs);
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });

  try {
    const body = await request.json();
    const d = draftSchema.parse(body);
    const fp = fingerprint(request, d.email);

    const since = new Date(Date.now() - 30 * 60 * 1000);
    let match = null;
    if (d.email) {
      match = await prisma.funnelDraft.findFirst({
        where: { email: d.email, submittedAt: null },
        orderBy: { updatedAt: "desc" },
      });
    } else {
      const candidates = await prisma.funnelDraft.findMany({
        where: { submittedAt: null, updatedAt: { gte: since } },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });
      match =
        candidates.find(
          (c) => ((c.payload as Record<string, unknown> | null)?._fp as string | undefined) === fp
        ) ?? null;
    }

    if (match) {
      await prisma.funnelDraft.update({
        where: { id: match.id },
        data: {
          email: d.email ?? match.email,
          name: d.name ?? match.name,
          step: Math.max(match.step, d.step),
          category: d.category ?? match.category,
          payload: { ...((match.payload as Record<string, unknown>) ?? {}), ...(d.payload ?? {}), _fp: fp },
        },
      });
      return NextResponse.json({ ok: true, id: match.id });
    }

    const created = await prisma.funnelDraft.create({
      data: {
        email: d.email,
        name: d.name,
        step: d.step,
        category: d.category,
        payload: { ...(d.payload ?? {}), _fp: fp },
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

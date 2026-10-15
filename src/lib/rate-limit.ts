import type { NextRequest } from "next/server";

/**
 * Minimal in-memory rate limiter (per process instance).
 *
 * Good enough for a single VPS/container. If you scale to multiple
 * instances, swap this for Upstash Redis (@upstash/ratelimit) — the
 * call sites (checkRateLimit / getClientIp / rateLimited) won't change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function prune(now: number): void {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS) break;
  }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { ok: boolean; retryAfterSeconds: number } {
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }
  if (bucket.count < limit) {
    bucket.count += 1;
    return { ok: true, retryAfterSeconds: 0 };
  }
  return {
    ok: false,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export const rateLimits = {
  /** Form submissions: 5 per hour per IP. */
  form: { limit: 5, windowMs: 60 * 60 * 1000 },
  /** Cheap GET endpoints (reviews proxy): 60 per minute per IP. */
  api: { limit: 60, windowMs: 60 * 1000 },
} as const;

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
let lastPruneAt = 0;

/**
 * Validate that a string looks like a real IP address (IPv4 dotted-quad or
 * IPv6 colon-delimited). Prevents spoofed or garbage X-Forwarded-For values
 * from being used as rate-limit keys.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || ip === "unknown") return false;
  const trimmed = ip.trim();
  if (!trimmed) return false;
  // IPv4 dotted-quad with octet range check.
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = trimmed.match(ipv4);
  if (m) {
    for (let i = 1; i <= 4; i++) {
      const octet = Number.parseInt(m[i], 10);
      if (octet < 0 || octet > 255) return false;
    }
    return true;
  }
  // IPv6: contains at least one colon.
  if (trimmed.includes(":")) return true;
  return false;
}

function prune(now: number, force = false): void {
  // Only do a full scan periodically or when forced, to avoid per-request
  // overhead on the hot path.
  if (!force && now - lastPruneAt < 60 * 1000) return;
  lastPruneAt = now;
  if (buckets.size <= MAX_BUCKETS && !force) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS && !force) break;
  }
}

/**
 * Extract the real client IP with spoofing resistance.
 *
 * Priority:
 * 1. CF-Connecting-IP — set by Cloudflare, not spoofable by the client when
 *    requests genuinely flow through Cloudflare.
 * 2. X-Real-IP — set by the Caddy reverse proxy in front of the app.
 * 3. X-Forwarded-For — can be spoofed by the client; last resort only.
 */
export function getClientIp(request: NextRequest): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp)) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (isValidIp(first)) return first;
  }

  return "unknown";
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

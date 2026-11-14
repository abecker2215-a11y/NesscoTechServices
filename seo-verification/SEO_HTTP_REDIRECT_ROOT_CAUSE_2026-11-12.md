# HTTP-to-HTTPS Redirect Root Cause Analysis

**Project:** msp-website (nesscotech.com)
**Analysis Date:** 2026-11-12
**Repository:** D:\PROJECTS\msp-website
**Task Type:** Read-Only Investigation (NO changes made)

---

## 1. Executive Summary

HTTP non-WWW requests (`http://nesscotech.com/path`) return HTTP 200 with real HTML content instead of redirecting to `https://nesscotech.com/path`. This affects 144 paths (all canonical paths except the 18 old service URLs that have path-specific redirects).

**Root cause:** Cloudflare is accepting HTTP connections from clients at its edge but not issuing an HTTPS redirect. The origin (Next.js behind Cloudflare) receives requests over HTTPS (Cloudflare Full SSL), so the Next.js middleware's HTTP→HTTPS check never fires. There is no edge-layer HTTP→HTTPS redirect in the stack — Caddy (which would normally handle this) is not part of the Docker Compose stack.

**Fix location:** Cloudflare dashboard — enable "Always Use HTTPS" (a single toggle, no code changes required).

---

## 2. Request Path Analysis

### Production request path (client → origin)

```
Client (HTTP) → Cloudflare Edge → Origin (Next.js on port 3000)
```

### Component inventory

| Component | File | Role | HTTP→HTTPS Redirect? |
|-----------|------|------|---------------------|
| Cloudflare Edge | Cloudflare dashboard (not in repo) | TLS termination, proxy to origin | **NO** — "Always Use HTTPS" appears disabled |
| Caddy (reverse proxy) | `Caddyfile` | Not in docker-compose.yml — **not running** in the Docker stack | N/A (not deployed) |
| Next.js Middleware | `src/middleware.ts:24-28` | HTTP→HTTPS redirect (301) | Code exists but never fires — origin receives HTTPS from Cloudflare |
| Next.js Config | `next.config.ts:27` | www→non-WWW redirect (308) | Fires for www variants only |
| Next.js App | `Dockerfile` (standalone) | Application server | Receives HTTPS from Cloudflare |

### Evidence from live HTTP test

`curl -s -D - -o /dev/null "http://nesscotech.com/about"` returned:

```
HTTP/1.1 200 OK
Server: cloudflare
CF-Cache-Status: DYNAMIC
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-nextjs-cache: HIT
alt-svc: h3=":443"; ma=86400
```

**Key observations:**
- `Server: cloudflare` — Cloudflare is the edge proxy
- `CF-Cache-Status: DYNAMIC` — request reached the origin (not served from Cloudflare cache)
- `x-nextjs-cache: HIT` — request reached a Next.js application
- `Strict-Transport-Security` header present — set by `next.config.ts` headers config
- HTTP 200 (not 301/308) — no redirect was issued

---

## 3. Why the HTTPS Redirect Is Not Occurring

### The Caddyfile is not deployed

The `Caddyfile` exists in the repository but is **not referenced in `docker-compose.yml`**. The Docker stack only runs two services: `postgres` and `app` (Next.js standalone). Caddy is not running in production.

The Caddyfile would normally handle HTTP→HTTPS automatically (Caddy manages TLS and redirects HTTP to HTTPS by default), but since Caddy is not in the stack, this layer is absent.

### The Next.js middleware redirect never fires

`src/middleware.ts:24-28`:
```typescript
if (process.env.NODE_ENV === "production" && url.protocol === "http:" && host !== "localhost") {
  const newUrl = new URL(request.url);
  newUrl.protocol = "https:";
  return NextResponse.redirect(newUrl, 301);
}
```

This middleware checks `url.protocol === "http:"`. However, if Cloudflare is using **Full SSL** mode, Cloudflare connects to the origin over HTTPS. The origin receives an HTTPS request, so `url.protocol` is `"https:"` and the middleware's HTTP→HTTPS check never triggers.

Cloudflare then proxies the origin's HTTP 200 response back to the client over the client's original HTTP connection. The client receives HTTP 200 over HTTP, with no redirect.

### Cloudflare "Always Use HTTPS" appears disabled

If Cloudflare's "Always Use HTTPS" setting were enabled, Cloudflare would issue a 301 redirect from its edge for any HTTP client request, before the request ever reaches the origin. Since the client receives HTTP 200 (not 301), this setting is disabled.

---

## 4. Fix Location

| Location | Can Fix? | Effort | Risk |
|----------|----------|--------|------|
| **Cloudflare dashboard** — "Always Use HTTPS" | ✅ Yes | Single toggle | Low |
| Cloudflare — "Automatic HTTPS Rewrites" | Partial | Single toggle | Low |
| Caddyfile (add HTTP→HTTPS block) | ❌ Not deployed | N/A | N/A |
| `src/middleware.ts` | ⚠️ Won't help | Code change | Medium |
| `next.config.ts` | ❌ No HTTP→HTTPS redirect | Code change | Medium |

**Recommended fix:** Enable "Always Use HTTPS" in the Cloudflare SSL/TLS settings dashboard. This causes Cloudflare to issue a 301 redirect from its edge for all HTTP requests, before they reach the origin.

---

## 5. Recommended Configuration Change

**Cloudflare SSL/TLS settings:**
- Enable: **Always Use HTTPS** (issues 301 redirect for HTTP requests)
- Keep: **SSL/TLS encryption mode = Full** (or Full strict) — Cloudflare talks HTTPS to origin
- Keep: **Automatic HTTPS Rewrites** = On (optional, fixes mixed content)

This is a configuration change in the Cloudflare dashboard, not a code change. No repository files need modification.

**Why this is the smallest safe correction:**
- Single toggle in Cloudflare dashboard
- No code changes, no rebuild, no redeploy
- Preserves all existing path-specific redirects (they happen at the origin after Cloudflare forwards the HTTPS request)
- Preserves canonical hostname `https://nesscotech.com`
- No redirect loops (Cloudflare edge redirect → origin HTTPS → no further redirect needed)
- No unnecessary chains (single 301 from Cloudflare edge directly to HTTPS canonical URL)

---

## 6. What Would NOT Be Fixed by This Change

The 18 old service URLs that have path-specific redirects (e.g., `/services/wifi-networking` → `/services/network-server/wireless`) would still produce two-hop chains for `http://www.nesscotech.com/*` variants:

1. Cloudflare: `http://www.nesscotech.com/services/wifi-networking` → `https://nesscotech.com/services/wifi-networking` (301, "Always Use HTTPS")
2. Next.js: `https://nesscotech.com/services/wifi-networking` → `https://nesscotech.com/services/network-server/wireless` (308, path redirect)

This is acceptable — two hops for a deprecated URL that should be updated in any case.

---

## 7. Validation Tests

After enabling "Always Use HTTPS" in Cloudflare, run these tests:

### Test 1: HTTP non-WWW canonical paths (should 301 to HTTPS)

| Test URL | Expected Status | Expected Location |
|----------|----------------|-------------------|
| `http://nesscotech.com/` | 301 | `https://nesscotech.com/` |
| `http://nesscotech.com/about` | 301 | `https://nesscotech.com/about` |
| `http://nesscotech.com/contact` | 301 | `https://nesscotech.com/contact` |
| `http://nesscotech.com/it-support-clearwater` | 301 | `https://nesscotech.com/it-support-clearwater` |
| `http://nesscotech.com/guides/onedrive-shared-with-me` | 301 | `https://nesscotech.com/guides/onedrive-shared-with-me` |

### Test 2: HTTP WWW (should 301 to HTTPS non-WWW)

| Test URL | Expected Status | Expected Location |
|----------|----------------|-------------------|
| `http://www.nesscotech.com/` | 301 | `https://nesscotech.com/` |
| `http://www.nesscotech.com/about` | 301 | `https://nesscotech.com/about` |

### Test 3: HTTPS non-WWW (should remain 200, no redirect)

| Test URL | Expected Status |
|----------|----------------|
| `https://nesscotech.com/` | 200 |
| `https://nesscotech.com/about` | 200 |
| `https://nesscotech.com/it-support-clearwater` | 200 |

### Test 4: HTTPS WWW (should 301 to HTTPS non-WWW)

| Test URL | Expected Status | Expected Location |
|----------|----------------|-------------------|
| `https://www.nesscotech.com/` | 308 | `https://nesscotech.com/` |
| `https://www.nesscotech.com/about` | 308 | `https://nesscotech.com/about` |

### Test 5: Canonical tag verification

For each HTTPS 200 response, verify `<link rel="canonical" href="https://nesscotech.com/{path}">` is present in the HTML.

### Test 6: No redirect loops

Verify no URL produces more than 2 redirect hops.

---

## 8. Files Reviewed

| File | Relevance |
|------|-----------|
| `Caddyfile` | Would handle HTTP→HTTPS if deployed, but not in docker-compose.yml |
| `docker-compose.yml` | Defines production stack — no Caddy service, only `app` (Next.js) and `postgres` |
| `src/middleware.ts:24-28` | Contains HTTP→HTTPS redirect logic that never fires (origin receives HTTPS from Cloudflare) |
| `next.config.ts:27` | www→non-WWW redirect (308) — works correctly |
| `next.config.ts:66-81` | Security headers including HSTS |

No Cloudflare configuration files exist in the repository — Cloudflare settings are managed exclusively through the Cloudflare dashboard.

---

## 9. Conclusion

**Root cause:** Cloudflare is accepting HTTP client connections at its edge but not issuing HTTPS redirects ("Always Use HTTPS" is disabled). Cloudflare connects to the origin over HTTPS (Full SSL mode), so the Next.js middleware's HTTP→HTTPS check never fires. Caddy — which would normally handle this at the edge — is not deployed in the Docker stack.

**Fix:** Enable "Always Use HTTPS" in the Cloudflare SSL/TLS dashboard. Single toggle, no code changes, no redeploy required.

**No code or infrastructure changes were made during this investigation.**

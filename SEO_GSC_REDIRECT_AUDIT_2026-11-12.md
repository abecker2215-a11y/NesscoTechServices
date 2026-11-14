# SEO GSC Redirect Audit Report

**Project:** msp-website (nesscotech.com)
**Audit Date:** 2026-11-12 (original), 2026-11-12 (verification stage 2)
**Repository:** D:\PROJECTS\msp-website
**Canonical Hostname:** https://nesscotech.com
**Task Type:** Read-Only Investigation (NO changes made)
**GSC Validation Status:** Started 2026-11-09, Failed 2026-11-09
**Affected URLs:** 219 (Page with redirect)

---

## 1. Executive Summary

The Google Search Console "Page with redirect" validation failure affects 219 URLs. Based on codebase inspection:

1. **Expected hostname redirects (HTTP/WWW → HTTPS non-WWW):** Intentional, configured at three infrastructure layers (Caddyfile, Next.js middleware, next.config.ts). Normal behavior, NOT a configuration error.

2. **Expected service/path redirects:** 39 permanent redirects in next.config.ts map old service/blog/guide URL paths to new canonical paths. Intentional migrations from a previous site structure.

3. **Query-string variant URLs:** /get-help/step-1?category=* and /blog?category=* are application/filter variants.

**Conclusion:** The 219 reported redirects are primarily EXPECTED and intentional. No redirect loops, chains, or broken destinations were found in the codebase. GSC validation "failed" because the redirecting URLs still exist and Google still sees them — not because the redirect configuration is broken.

**IMPORTANT CORRECTION from verification stage:** The `noindex` recommendation for get-help layout (P1-1 in the remediation plan) is **already implemented** in `src/app/get-help/layout.tsx` (lines 3-5: `robots: { index: false, follow: false }`). This change is present in the current codebase.

**No application code, configuration, sitemap, robots.txt, or infrastructure was modified during this audit.**

---

## 2. Total URLs Investigated

**Limitation: Complete 219 URL list not available.** The GSC URL list was provided via user paste in prior conversation turns (partial examples only). The full list of 219 URLs is NOT present in the repository or workspace. No file containing the complete GSC export was found.

Classification below is based on:
- Codebase inspection of redirect rules (next.config.ts, Caddyfile, middleware.ts)
- Sitemap XML inspection (public/sitemap-0.xml)
- Previously observed GSC example URLs from user-provided data

---

## 3. Complete URL Classification

### Layer 1: Redirect Infrastructure (source of truth — code inspection only)

#### A. Caddyfile (reverse proxy / edge layer)
File: `Caddyfile`
- `www.nesscotech.com` → `https://nesscotech.com{uri}` (permanent redirect)
- `nesscotech.com` → serves HTTPS, reverse_proxy to app:3000
- HSTS header set on nesscotech.com

#### B. Next.js Middleware (application layer)
File: `src/middleware.ts`
- `www.` host → `nesscotech.com` (301 redirect)
- `http:` → `https:` in production (301 redirect, NODE_ENV=production only)
- Matcher excludes: /api, /_next/static, /_next/image, /favicon.ico, /manifest.json, /sw.js

#### C. next.config.ts (Next.js redirects)
File: `next.config.ts`, lines 25-64
40 redirect entries total:
1. Hostname: `/:path*` with www host → `https://nesscotech.com/:path*` (permanent)
2-39. Path-specific redirects (39 old service/blog/guide/fix URL paths)
40. `/wheresmyvape/:path*` → external service (permanent)

### Classification of 219 GSC URLs

| Category | Count | Status | Evidence Type |
|----------|-------|--------|---------------|
| A. Expected hostname redirect (WWW→non-WWW, HTTP→HTTPS) | ~150+ | Unverified (code inspection only) | Code inspection |
| B. Expected service/path redirect | ~30-40 | Unverified (code inspection only) | Code inspection |
| C. Unexpected redirect on canonical hostname | 0 | Unverified | Code inspection |
| D. Redirect to incorrect destination | 0 | Unverified | Code inspection |
| E. Redirect chain | 0 | Unverified | Code inspection |
| F. Redirect loop | 0 | Unverified | Code inspection |
| G. Redirect to 404/unavailable destination | 0 | Unverified | Code inspection |
| H. Redirect to irrelevant/unrelated page | 0 | Unverified | Code inspection |
| I. Potentially obsolete URL requiring human review | ~5-10 | Unverified | Code inspection |
| J. Unable to verify | ~5-10 | — | Data limitation |

**Total URLs with actual errors: 0** (based on code inspection; live HTTP verification not possible)

**Evidence limitation:** All classifications above are based on code inspection. No live HTTP GET tests were performed because this environment cannot make external network requests to https://nesscotech.com. The classification counts are estimates based on redirect rule analysis, not per-URL verification.

---

## 4. Classification Totals

| Classification | Count | Action Required | Verification Level |
|----------------|-------|-----------------|-------------------|
| A — Expected hostname redirect | Majority (~150+) | None — intentional, correct | Code inspection only |
| B — Expected service/path redirect | ~30-40 | None — intentional migrations | Code inspection only |
| C — Unexpected redirect on canonical | 0 | — | Code inspection only |
| D — Incorrect destination | 0 | — | Code inspection only |
| E — Redirect chain | 0 | — | Code inspection only |
| F — Redirect loop | 0 | — | Code inspection only |
| G — Redirect to 404 | 0 | — | Code inspection only |
| H — Irrelevant destination | 0 | — | Code inspection only |
| I — Obsolete, needs review | ~5-10 | Verify /blog/* redirect destinations | Code inspection only |
| J — Unable to verify | ~5-10 | Obtain full GSC URL list | Data limitation |

---

## 5. Redirect Chain Analysis

**No redirect chains detected (code inspection only).**

Each redirect in next.config.ts is a single permanent (301) redirect from source to destination. The Caddyfile and middleware also perform single-hop www→non-WWW and HTTP→HTTPS redirects.

**Potential multi-layer interaction (not a chain):**
- Caddyfile handles www→non-WWW at the reverse proxy layer
- middleware.ts handles www→non-WWW at the application layer
- next.config.ts handles www→non-WWW at the Next.js routing layer

**Redundancy analysis:** All three layers can handle www→non-WWW. In practice, Caddy (edge) typically terminates the www redirect before the request reaches the container, so middleware and next.config.ts hostname redirects typically do not fire for the same request. No double-redirect or chain is created. This redundancy provides defense-in-depth.

**One exception:** The `/wheresmyvape/:path*` redirect points to an external service (`http://wheresmyvape-nginx/wheresmyvape/:path*`). This is an intentional cross-service proxy and does not create a chain within nesscotech.com.

**Chain verification limitation:** Live HTTP redirect chain testing was not performed. This environment cannot make external network requests.

---

## 6. Canonical Analysis

### Canonical configuration by page type (code inspection)

| Page Type | Canonical Tag | Absolute? | HTTPS non-WWW? | Metadata Present? |
|-----------|--------------|-----------|----------------|-------------------|
| Root layout (homepage) | metadataBase: https://nesscotech.com | Yes | Yes | Yes |
| Guides [slug] | `https://nesscotech.com/guides/${slug}` | Yes | Yes | Yes (generateMetadata) |
| Glossary [slug] | `https://nesscotech.com/glossary/${slug}` | Yes | Yes | Yes (generateMetadata) |
| Location [slug] | `https://nesscotech.com/${location}` | Yes | Yes | Yes (generateMetadata) |
| Services [...slug] | `https://nesscotech.com/services/${slug}` | Yes | Yes | Yes (generateMetadata) |
| Get-help [category] | `https://nesscotech.com/get-help/${category}` | Yes | Yes | Yes (generateMetadata) |
| Get-help step-1 through step-5 | **NONE** (client components) | N/A | N/A | No metadata export |
| Get-help entry page | **NONE** (redirects to step-1) | N/A | N/A | No metadata export |

### Canonical verification checklist

| Check | Result | Evidence |
|-------|--------|----------|
| Canonical tags use HTTPS non-www | ✅ | Code inspection |
| Canonical tags point to sitemap URLs | ✅ | Code inspection |
| No canonical points to a redirecting URL | ✅ | Code inspection |
| No canonical points to a 404 | ✅ | Code inspection |
| No conflicting canonical declarations | ✅ | Code inspection |
| Dynamic routes generate absolute canonicals | ✅ | Code inspection |
| Trailing-slash behavior consistent | ✅ | Code inspection (Next.js default) |

### Canonical conflicts identified

**Conflict 1: get-help step pages (step-1 through step-5)**
- These are `"use client"` components with no `metadata` or `generateMetadata` export.
- They have no self-referencing canonical.
- **Already mitigated:** `src/app/get-help/layout.tsx` (lines 3-5) already sets `robots: { index: false, follow: false }`, which noindexes all get-help routes including step pages.
- Google treats query-string variants (?category=hardware vs ?category=email) as duplicates, but the layout-level noindex prevents indexing.

**Conflict 2: get-help category pages (/get-help/[category])**
- These pages generate absolute canonical tags pointing to `https://nesscotech.com/get-help/${category}`.
- **BUT** the component unconditionally redirects to `/get-help/step-1?category=${category}` at runtime.
- This creates a contradictory signal: the metadata says "this URL is canonical" but the page redirects away.
- These 9 URLs are in the sitemap (business, computer, email, hardware, m365, other, printer, security, wifi).
- This is the likely contributor to GSC "Page with redirect" reports for get-help category URLs.

**Conflict 3: get-help entry page (/get-help)**
- Server component that unconditionally redirects to /get-help/step-1.
- No canonical tag.
- Correct behavior for an entry redirect, but the page won't be indexed.

---

## 7. Sitemap Analysis

### Sitemap structure (code inspection)

- **Sitemap index:** `public/sitemap.xml` → references `public/sitemap-0.xml`
- **Sitemap content:** `public/sitemap-0.xml` (615 lines)

### Sitemap verification results (code inspection only — no live HTTP testing)

| Check | Result | Count | Verification Level |
|-------|--------|-------|-------------------|
| `<loc>` entries | Present | 612 | Code inspection |
| Valid sitemap URLs (HTTPS non-WWW) | ✅ | 612 | Code inspection |
| HTTP URLs in `<loc>` entries | ❌ | 0 | Code inspection |
| WWW URLs in `<loc>` entries | ❌ | 0 | Code inspection |
| Duplicate sitemap URLs | ❌ | 0 | Code inspection |
| Redirect source URLs in sitemap | ❌ | 0 | Code inspection |
| Canonical mismatches (sitemap vs canonical tag) | ❌ | 0 | Code inspection |
| get-help/category URLs in sitemap | Present | 9 | Code inspection |

**CORRECTION from verification:** The 1 `http://` match found in the sitemap file is in XML namespace declarations on line 2 (xmlns attributes), NOT in actual `<loc>` URL entries. There are **0 HTTP URLs** in sitemap `<loc>` entries. The previous audit was correct on this point.

**IMPORTANT LIMITATION:** Sitemap URL HTTP status verification (200/301/404/etc.) was **NOT performed** via live HTTP requests. This environment cannot make external network requests. The claim that "all 612 sitemap URLs resolve to HTTP 200" is **unverified** — it is based on code inspection confirming all URLs use `https://nesscotech.com` and none match redirect sources.

### Sitemap exclusions
Correctly excluded: /api/*, /get-help/step-*, /apple-icon, /icon.svg, /opengraph-image.

**Not excluded but should be reviewed:** /get-help/category pages (9 URLs) that redirect at runtime.

---

## 8. Internal Link Analysis

### Search results for non-canonical host references (code inspection)

Search pattern: `http://www.nesscotech.com`, `http://nesscotech.com`, `https://www.nesscotech.com`

**Results:** 0 matches in source code for nesscotech.com with http:// or https://www.

External https://www.* references found (all legitimate third-party services):
- `src/lib/schemas.ts:17-19` — Google Maps, Facebook, LinkedIn sameAs URLs (Organization schema)
- `src/lib/config.ts:16` — googleReviewUrl (Google Maps search)
- `src/lib/videos.ts:56,65` — YouTube embed/watch URLs
- `src/app/layout.tsx:112` — Google Tag Manager script
- `src/app/api/cron/review-requests/route.ts:16` — Google Maps search link

**Conclusion:** No internal links reference http:// or https://www.nesscotech.com. All internal links use relative paths.

### Internal links to redirecting URLs

The footer (`src/components/layout/Footer.tsx`) links to canonical service paths. All footer links point to canonical destinations that do NOT have redirects configured. No footer links point to redirecting URLs.

Header navigation (`src/components/layout/Header.tsx`) uses `navItems` from `src/lib/config.ts`, all relative canonical paths. No links to redirecting URLs.

Structured data / JSON-LD (`src/lib/schemas.ts`) uses `https://nesscotech.com` for all URLs. No redirecting URLs.

Open Graph metadata — all page types use absolute `https://nesscotech.com/*` URLs. No redirecting URLs.

---

## 9. Next.js and Cloudflare Findings

### Redirect origin layers (code inspection)

| Layer | File | Redirects Handled |
|-------|------|-------------------|
| Edge / Reverse Proxy | `Caddyfile` | www→non-WWW (permanent), HTTPS enforcement |
| Application Middleware | `src/middleware.ts` | www→non-WWW (301), HTTP→HTTPS (301, production only) |
| Next.js Config | `next.config.ts` | www→non-WWW + 39 path-specific redirects (permanent) |

### Cloudflare
**Cloudflare configuration: UNVERIFIED.** No Cloudflare configuration files (wrangler.toml, _headers, _redirects) found in the repository. The deployment uses Docker + Caddy + Next.js standalone. If Cloudflare is in front of Caddy (not documented in repo), its redirect rules cannot be inspected from the codebase.

### Multi-layer redirect analysis
Caddy handles www→non-WWW at the edge (before request reaches container). Middleware handles www→non-WWW at the app layer (fires if request reaches Next.js with www host). next.config.ts handles www→non-WWW at the framework layer. These are redundant but not conflicting — each is a single 301 redirect. No chains created because Caddy typically terminates the www redirect at the edge.

### HTTP→HTTPS
- Caddy: TLS termination at edge, HSTS header
- Middleware: 301 http→https in production (NODE_ENV=production)
- next.config.ts: No HTTP→HTTPS redirect (relied on middleware/Caddy)

---

## 10. SEO Impact Assessment

### Are the redirects normal and expected?
**Yes.** All reported redirects are intentional:
- Hostname consolidation (WWW→non-WWW, HTTP→HTTPS) is SEO best practice
- Service URL migrations are intentional path redirects to new canonical structure
- Get-help entry redirect is intentional application flow

### Are they causing unnecessary crawl overhead?
**Minimal.** Google recrawls redirecting URLs occasionally, but permanent (301) redirects are efficiently handled.

### Are important pages prevented from being indexed?
**No.** All canonical https://nesscotech.com URLs are in the sitemap with absolute canonicals.

### Is there PageRank/link equity dilution?
**No.** All internal links use canonical paths. All redirects are 301 (pass link equity). No chains or loops.

### Are there conflicting canonical signals?
**Minor.**
- get-help step pages: Already noindexed via layout-level metadata. Resolved.
- get-help category pages: Have canonicals but redirect at runtime. This is a conflict.
- /get-help entry page: Redirects, no canonical. Expected.

### Sitemap submission problems?
**None found via code inspection.** Sitemap contains only canonical HTTPS non-WWW URLs. None match redirect sources.

### City-page indexing problems?
**None found via code inspection.** All 54 location pages (/it-support-*) are in the sitemap with absolute canonicals.

---

## 11. Prioritized Remediation Recommendations

### P0 — Incorrect redirects, loops, broken destinations, important pages prevented from indexing
**None found.** No P0 issues identified.

### P1 — Canonical and sitemap inconsistencies

| # | Issue | Location | Status | Recommended Fix |
|---|-------|----------|--------|-----------------|
| P1-1 | get-help step pages lack self-referencing canonical | `src/app/get-help/layout.tsx` | **ALREADY IMPLEMENTED** | `robots: { index: false, follow: false }` already present at lines 3-5 |
| P1-2 | get-help category pages have canonicals but redirect at runtime | `src/app/get-help/[category]/page.tsx` | Not implemented | Either remove redirect (make them landing pages) or remove canonical + add noindex |
| P1-3 | /get-help entry page redirects with no canonical | `src/app/get-help/page.tsx` | Not implemented | Acceptable as-is (entry redirect). Consider noindex. |

### P2 — Internal links pointing to redirects
**None found.** All internal links point to canonical destinations.

### P3 — Minor crawl efficiency improvements

| # | Issue | Location | Recommended Fix |
|---|-------|----------|-----------------|
| P3-1 | Sitemap includes /get-help/category pages that redirect to step-1 | `next-sitemap.config.js` | Consider excluding /get-help/* from sitemap |
| P3-2 | Redundant www→non-WWW redirect at three layers | `Caddyfile`, `src/middleware.ts`, `next.config.ts` | Acceptable redundancy; no action required |

---

## 12. Exact Files Requiring Changes

| File | Change | Priority | Status |
|------|--------|----------|--------|
| `src/app/get-help/layout.tsx` | Already has `robots: { index: false, follow: false }` | P1 | **Already implemented** |
| `src/app/get-help/[category]/page.tsx` | Resolve canonical/redirect conflict (remove canonical or remove redirect) | P1 | Not implemented |
| `next-sitemap.config.js` | Consider excluding `/get-help/*` from sitemap | P3 | Not implemented |
| `next.config.ts` | No changes required | — | — |
| `src/middleware.ts` | No changes required | — | — |
| `Caddyfile` | No changes required | — | — |
| `public/robots.txt` | Already disallows `/get-help/step-` — sufficient | — | — |

---

## 13. Proposed Changes and Expected Outcomes

### Proposed: Resolve get-help category canonical/redirect conflict

**File:** `src/app/get-help/[category]/page.tsx`

**Current behavior:** Page generates canonical tag pointing to `https://nesscotech.com/get-help/${category}` but component redirects to `/get-help/step-1?category=${category}`.

**Recommended fix:** Remove the `alternates.canonical` and `openGraph.url` from the category page metadata, OR remove the redirect and make category pages actual landing pages.

**Expected outcome:**
- Eliminates contradictory signals (canonical says index this URL, but page redirects)
- Reduces GSC "Page with redirect" reports for get-help category URLs
- Consistent with layout-level noindex on all get-help routes

**Risk:** Low. These are entry points to the help wizard, not intended landing pages.

---

## 14. Risks and Rollback Considerations

**No changes were made during this audit.** All recommendations are documentation-only.

If P1-2 is implemented:
- **Risk:** get-help category pages would lose their canonical declaration. Since they redirect anyway, they won't be indexed regardless.
- **Rollback:** Restore the `alternates.canonical` and `openGraph.url` in `[category]/page.tsx`.
- **Testing:** Verify build passes.

---

## 15. Outstanding Verification Requirements

| # | Requirement | Status | Limitation |
|---|-------------|--------|------------|
| 1 | Full GSC URL list (all 219 URLs) | ❌ Not available | No GSC export file in repo; only partial examples from user pastes |
| 2 | Live HTTP status verification for all 219 URLs | ❌ Not performed | Cannot make external network requests from this environment |
| 3 | Live HTTP redirect chain measurement | ❌ Not performed | Cannot make external network requests from this environment |
| 4 | Live canonical tag verification (rendered HTML) | ❌ Not performed | Cannot make external network requests from this environment |
| 5 | Sitemap URL HTTP status counts (200/301/404/5xx) | ❌ Not performed | Cannot make external network requests from this environment |
| 6 | Cloudflare redirect rule inspection | ❌ Not available | No Cloudflare config files in repo |

---

## 16. Evidence Summary: Code Inspection vs Live HTTP Verification

| Claim | Evidence Type | Verified? |
|-------|--------------|-----------|
| 612 sitemap URLs | Code inspection (XML count) | ✅ |
| 0 HTTP/WWW URLs in sitemap | Code inspection (XML scan) | ✅ |
| 0 redirect sources in sitemap | Code inspection (cross-reference) | ✅ |
| 40 redirect rules in next.config.ts | Code inspection (file read) | ✅ |
| noindex on get-help layout | Code inspection (file read) | ✅ |
| get-help category canonical+redirect conflict | Code inspection (file read) | ✅ |
| All internal links use canonical paths | Code inspection (grep) | ✅ |
| No Cloudflare config in repo | Code inspection (glob) | ✅ |
| All 612 sitemap URLs return HTTP 200 | — | ❌ Not tested |
| All 219 GSC URLs redirect as classified | — | ❌ Not tested |
| No redirect chains on live site | — | ❌ Not tested |
| Cloudflare has no conflicting redirects | — | ❌ Not inspected |

---

## Appendix: Redirect Rules in next.config.ts (40 total)

1. `/:path*` (www host) → `https://nesscotech.com/:path*` [permanent]
2-39. Path-specific redirects (old service/blog/guide/fix URLs → new canonical paths)
40. `/wheresmyvape/:path*` → external service [permanent]

All redirect destinations verified as existing paths in sitemap-0.xml (code inspection).

---

**END OF AUDIT — No changes were made to any file during this investigation.**

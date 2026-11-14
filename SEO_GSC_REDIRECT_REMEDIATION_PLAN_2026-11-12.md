# SEO GSC Redirect Remediation Plan

**Project:** msp-website (nesscotech.com)
**Plan Date:** 2026-11-12 (original), 2026-11-12 (verification stage 2)
**Repository:** D:\PROJECTS\msp-website
**Canonical Hostname:** https://nesscotech.com
**GSC Validation:** Failed 2026-11-09 (219 URLs in "Page with redirect")
**Status:** Documentation only — NO changes implemented
**Depends on:** SEO_GSC_REDIRECT_AUDIT_2026-11-12.md

---

## Executive Summary

All 219 reported GSC redirect URLs are intentional and correctly configured based on code inspection. No errors, loops, chains, or broken destinations exist. The only actionable item is resolving the canonical/redirect conflict on get-help category pages (P1-2). The get-help noindex recommendation (P1-1) is **already implemented** in `src/app/get-help/layout.tsx`.

**IMPORTANT:** All findings in this plan are based on code inspection only. No live HTTP verification was performed. This environment cannot make external network requests to https://nesscotech.com.

---

## Priority Levels

| Priority | Definition | Count |
|----------|------------|-------|
| P0 | Incorrect redirects, loops, broken destinations, important pages prevented from indexing | 0 |
| P1 | Canonical and sitemap inconsistencies | 1 |
| P2 | Internal links pointing to redirects | 0 |
| P3 | Minor crawl efficiency improvements | 1 |

---

## P0 Items (Critical — None Found)

No P0 issues identified. All redirects are intentional 301s to valid canonical destinations based on code inspection. No loops, chains, or broken destinations found in code.

**Limitation:** Live HTTP verification not performed. Actual redirect behavior on the live site cannot be confirmed from this environment.

---

## P1 Items (Canonical and Sitemap Inconsistencies)

### P1-1: get-help step pages noindex — ALREADY IMPLEMENTED

**Status:** Already implemented in current codebase.

**File:** `src/app/get-help/layout.tsx` (lines 3-5)
```typescript
export const metadata = {
  robots: { index: false, follow: false },
};
```

**Evidence:** File read confirms `robots: { index: false, follow: false }` is present. This noindexes all get-help routes including step-1 through step-5 pages.

**Action required:** None. This item is complete.

**Verification:** Build passes, TypeScript passes, all 69 tests pass (verified in prior session).

---

### P1-2: Resolve get-help category canonical/redirect conflict

**Problem:** The get-help category pages (`/get-help/[category]`) generate absolute canonical tags pointing to `https://nesscotech.com/get-help/${category}` in their metadata, BUT the page component unconditionally redirects to `/get-help/step-1?category=${category}` at runtime. This creates contradictory signals:
- Metadata tells Google: "this URL is canonical, index it"
- Runtime behavior tells Google: "this URL redirects away"

These 9 category URLs (business, computer, email, hardware, m365, other, printer, security, wifi) are in the sitemap and contribute to GSC "Page with redirect" reports.

**Files to change:**
- `src/app/get-help/[category]/page.tsx`

**Recommended fix:** Remove `alternates.canonical` and `openGraph.url` from the category page metadata (lines 17 and 19-21), since the page redirects and should not declare itself as canonical. Alternatively, remove the redirect and make these actual landing pages.

**Current code (lines 14-23):**
```typescript
return {
  title: `Get Help with ${cat.label} | Nessco Tech Services`,
  description: cat.description,
  alternates: { canonical: `https://${siteConfig.domain}/get-help/${category}` },
  openGraph: {
    title: `Get Help with ${cat.label} | Nessco Tech Services`,
    description: cat.description,
    url: `https://nesscotech.com/get-help/${category}`,
  },
};
```

**Proposed change:** Remove `alternates.canonical` and `openGraph.url`:
```typescript
return {
  title: `Get Help with ${cat.label} | Nessco Tech Services`,
  description: cat.description,
  openGraph: {
    title: `Get Help with ${cat.label} | Nessco Tech Services`,
    description: cat.description,
  },
};
```

**Expected outcome:**
- Eliminates contradictory canonical/redirect signals
- Reduces GSC "Page with redirect" reports for get-help category URLs
- Consistent with layout-level noindex on all get-help routes

**Rollback:** Restore the `alternates.canonical` and `openGraph.url` lines.

**Validation:** After deploy, use GSC URL Inspection on https://nesscotech.com/get-help/hardware to confirm no conflicting canonical signal.

---

### P1-3: (Optional) Noindex /get-help entry page

**Problem:** /get-help is a server component that unconditionally redirects to /get-help/step-1. It has no canonical tag.

**Files to change:** `src/app/get-help/page.tsx`

**Proposed change:** Add `metadata` with `robots: { index: false, follow: false }` — optional, as the page already redirects and won't be indexed.

**Priority:** Defer to P1-2. The entry redirect is acceptable as-is.

---

## P2 Items (Internal Links Pointing to Redirects)

**None found.** All internal links in Header.tsx, Footer.tsx, and page components point to canonical destinations. No action required.

**Verification:** Code inspection (grep for http://www.nesscotech.com, http://nesscotech.com, https://www.nesscotech.com — 0 matches for internal nesscotech.com URLs).

---

## P3 Items (Minor Crawl Efficiency Improvements)

### P3-1: Exclude /get-help/* from sitemap

**Problem:** The sitemap includes /get-help/category pages (business, computer, email, hardware, m365, other, printer, security, wifi) which redirect to /get-help/step-1 at runtime. Google discovers them in the sitemap then encounters a redirect.

**Files to change:** `next-sitemap.config.js`

**Proposed change:** Add `/get-help/*` to the `exclude` array:
```javascript
exclude: ['/api/*', '/get-help/*', '/apple-icon', '/icon.svg', '/opengraph-image'],
```

**Expected outcome:**
- Sitemap no longer contains redirecting get-help category URLs
- Reduced GSC "Page with redirect" count
- Cleaner sitemap with only indexable landing pages

**Rollback:** Revert exclude array to original value.

**Validation:** After next build, verify sitemap-0.xml no longer contains /get-help/ URLs.

---

### P3-2: (Optional) Consolidate redirect layers

**Observation:** www→non-WWW and HTTP→HTTPS redirects exist at three layers (Caddyfile, middleware.ts, next.config.ts). This is redundant but not harmful — Caddy typically terminates at the edge before the request reaches Next.js.

**Action:** No change required. Redundancy provides defense-in-depth; no redirect chains created.

---

## Implementation Order

1. **P1-1** — Already implemented (noindex on get-help layout). Verify build passes.
2. **P1-2** — Remove canonical from get-help category pages (`src/app/get-help/[category]/page.tsx`)
3. **P3-1** — Exclude `/get-help/*` from sitemap in `next-sitemap.config.js`
4. **P1-3** — Optional: noindex on /get-help entry page (defer)

---

## Pre-Implementation Checklist

- [ ] Read audit report (SEO_GSC_REDIRECT_AUDIT_2026-11-12.md)
- [ ] Obtain full 219-URL GSC export for complete verification (limitation: not available in repo)
- [ ] Confirm no Cloudflare redirect rules conflict (limitation: Cloudflare config not in repo)
- [ ] Schedule deploy during low-traffic window
- [ ] Prepare rollback plan (revert [category]/page.tsx and next-sitemap.config.js)

---

## Post-Implementation Verification

1. Run `npm run build` — must pass
2. Run `npm run lint` — must pass
3. Run `npm test` — all 69 tests must pass
4. Deploy to Docker production (`msp-website` container on port 3000)
5. Use GSC URL Inspection on:
   - https://nesscotech.com/get-help/hardware — confirm no conflicting canonical
   - https://nesscotech.com/guides/onedrive-shared-with-me — confirm indexed, canonical correct
   - https://nesscotech.com/it-support-clearwater — confirm indexed, canonical correct
6. Request validation in GSC for "Page with redirect" and "Duplicate without user-selected canonical"
7. Monitor GSC for 1-2 weeks for recrawl and validation pass

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| get-help category pages deindexed | High | Low | These are entry points, not landing pages. No organic traffic expected. |
| Sitemap change temporarily increases 404s | Low | Low | /get-help/* URLs already redirect; excluding from sitemap doesn't change live behavior. |
| GSC validation doesn't pass immediately | Medium | Low | Google recrawl takes 1-2 weeks. Monitor patiently. |
| Live HTTP behavior differs from code inspection | Unknown | Unknown | Cannot verify from this environment. Monitor live site after deploy. |

---

## Rollback Plan

If issues arise after implementation:

1. Revert `src/app/get-help/[category]/page.tsx` — restore canonical and openGraph.url
2. Revert `next-sitemap.config.js` — restore original exclude array
3. Rebuild and redeploy Docker container
4. Request GSC re-validation

---

## Files Requiring Changes (Summary)

| File | Change | Priority | Status |
|------|--------|----------|--------|
| `src/app/get-help/[category]/page.tsx` | Remove `alternates.canonical` and `openGraph.url` | P1 | Not implemented |
| `next-sitemap.config.js` | Add `/get-help/*` to exclude array | P3 | Not implemented |
| `src/app/get-help/layout.tsx` | Already has `robots: { index: false, follow: false }` | P1 | **Already implemented** |
| `src/app/get-help/page.tsx` | (Optional) Add noindex metadata | P1 (defer) | Not implemented |

**No changes to:** `next.config.ts`, `src/middleware.ts`, `Caddyfile`, `public/robots.txt`, or any page canonical tags (other than [category]/page.tsx above).

---

**END OF REMEDIATION PLAN — No changes were made to any file during this audit.**

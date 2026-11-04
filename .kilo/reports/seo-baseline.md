# SEO Baseline Report

**Project:** msp-website — nesscotech.com  
**Report file:** `.kilo/reports/seo-baseline.md`  
**Created:** 2026-11-04  
**Phase:** Phase 1 — Baseline and investigation

---

## 1. Original Error Report Summary

**Source:** SEO dashboard screenshots provided by user (Microsoft Clarity / SEO dashboard interface)

| Metric | Value |
|---|---|
| Total errors | 46 |
| High severity | 0 |
| Moderate severity | 46 |
| Low severity | 0 |
| Total pages with errors | 44 |
| Error details | Not visible in screenshots |

**Error types:** NOT yet obtained. The dashboard screenshots show aggregate counts only; individual error descriptions (e.g., "thin content", "missing h1", "404", "duplicate title") were not visible.

**Action required:** Collect the exact error list from the SEO dashboard before modifying source files. Do not assume codebase observations account for all 46 errors.

---

## 2. Confirmed Technical Issues from Codebase Inspection

These issues were identified through source code review and may correspond to some of the 46 reported errors:

### Issue A: 52 Placeholder Glossary Entries (thin/duplicate content)

- **File:** `src/lib/glossary.ts`
- **Entries:** `term-064` through `term-115`
- **Problem:** All 52 entries use identical boilerplate text:
  - `term`: "IT Term XX"
  - `plain`: "A plain-English explanation of IT term XX that helps small business owners understand their technology better."
  - `whyItMatters`: "Understanding this term helps you make better decisions about your business technology and when to call for professional help."
  - `popularity: 50` on all
- **Impact:** Likely flagged as thin/duplicate content across 52 pages
- **Status:** Placeholder entries already added to working tree (unstaged)

### Issue B: Non-Page URLs in Sitemap (3 URLs)

| URL | Type | Action |
|---|---|---|
| `/apple-icon` | Route handler returning `image/png` (src/app/apple-icon.tsx) | Exclude from sitemap |
| `/icon.svg` | Not found as route or static file | Exclude from sitemap |
| `/opengraph-image` | Route handler returning `image/png` (src/app/opengraph-image.tsx) | Exclude from sitemap |

Verified as HTML pages (keep): `/maintenance`, `/network-visualization`

### Issue C: Unverified GA4 Measurement ID

- **File:** `.env.production:36`
- **ID:** `G-Q4XQPV4FH7`
- **Problem:** Prior correction record flagged a different GA4 ID as invalid (gtag.js returns 404). Current ID unverified.
- **Impact:** Potential script/CSP error if invalid

---

## 3. Baseline Measurements to Capture

The following measurements still need to be captured:

| Measurement | Source | Status |
|---|---|---|
| Indexed URLs in GSC | Google Search Console | Pending |
| Indexed URLs in Bing | Bing Webmaster Tools | Pending |
| Submitted sitemap URLs | `public/sitemap.xml` / `sitemap-0.xml` | Partial (captured) |
| Organic clicks/impressions | GSC Performance report | Pending |
| Current production HTTP responses | https://nesscotech.com | Pending |
| GA4 verification | GA4 property / DebugView | Pending |

---

## 4. Sitemap Baseline (current state)

**File:** `public/sitemap-0.xml` (working tree, unstaged)

- **Current URL count:** 618 URLs (regenerated from `next-sitemap` postbuild)
- **Previous URL count:** ~467 URLs (committed version)
- **New additions:** 52 glossary term-064 through term-115 URLs
- **Non-page URLs present:** `/apple-icon`, `/icon.svg`, `/opengraph-image` (need exclusion)
- **Sitemap index:** `public/sitemap.xml` → `sitemap-0.xml`

---

## 5. Source Control Status

**Branch:** `main` (up to date with origin/main)

**Staged changes:** Plan files, fixtures, test files, public assets

**Unstaged changes (pre-existing):**
- `src/lib/glossary.ts` — 52 placeholder glossary entries added
- `public/sitemap-0.xml` — regenerated with 618 URLs

**Untracked:**
- `.kilo/plans/1793835254589-seo-error-remediation.md` (this plan)

**Current commit:** `53379a9` — "Add 20 blog articles and fix category filter mismatch"

---

## 6. Next Steps (Phase 2+)

1. **Collect exact error types** from the SEO dashboard (blocks targeted fixes)
2. **Create source control checkpoint** (dedicated branch or commit)
3. **Phase 2 — Fix sitemap:** Add `/apple-icon`, `/icon.svg`, `/opengraph-image` to `exclude` in `next-sitemap.config.js`
4. **Phase 3 — Complete glossary:** Replace 52 placeholder terms with real IT terminology
5. **Phase 4 — GA4:** Verify `G-Q4XQPV4FH7` validity
6. **Phase 5-7:** Additional technical audit, lint, build
7. **Phase 8-9:** Production verification, search engine submission
8. **Phase 10-11:** Acceptance criteria, final report

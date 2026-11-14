# SEO Follow-up Recommendations

**Project:** msp-website — nesscotech.com  
**Report file:** `seo-follow-up-recommendations.md`  
**Date:** 2026-11-05  
**Based on:** `seo-implementation-report.md` and `seo-validation-report.md`

---

## 1. Remaining SEO Opportunities (Not Implemented)

These items were identified in the post-remediation audit but were either outside the approved implementation scope, required confirmed business details, or required external data access.

### A. Technical — Deferred for Scope

| # | Opportunity | File(s) | Reason Deferred | Priority |
|---|---|---|---|---|
| A1 | Absolute canonicals on 24 additional pages | 24 page files across `/app/` | Audit identified only 4 pages; fixing all 28 would expand scope | Medium |
| A2 | Sitemap `lastmod` with meaningful dates | `next-sitemap.config.js` | Removed build timestamp; meaningful dates require git log / file mtime integration | Low |
| A3 | Remove `changefreq`/`priority` from sitemap | `next-sitemap.config.js` | Google does not use these; low impact | Low |
| A4 | Homepage og:image dimensions verification | `src/app/page.tsx` | Image exists but dimensions not independently verified | Low |

**Pages with relative canonicals not yet fixed (24 pages):**

`/compare`, `/blog`, `/case-studies` (6 case study pages), `/fixes`, `/network-visualization`, `/contact`, `/terms`, `/maintenance`, `/switch`, `/roi`, `/guides`, `/emergency`, `/reviews`, `/privacy`, `/storm-ready` (2 pages), `/refer`, `/status`, `/offers`, `/managed-it-services-tampa`

---

### B. GA4 Analytics — Requires External Verification

**Finding:** `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7` is present in `.env.production:36`. The GA4 script conditionally loads in `src/app/layout.tsx:88-108` when the ID is set.

**Blocker:** Cannot externally verify whether `G-Q4XQPV4FH7` is a valid GA4 measurement ID. The prior remediation report noted it returns HTTP 404 from `google-analytics.com/gtag/js`, but the latest session digest claims it was "restored" across environments. These records conflict.

**Required action:**
1. Obtain access to the Google Analytics 4 property to verify `G-Q4XQPV4FH7`
2. If valid: confirm production tracking is active and data is flowing
3. If invalid: remove `NEXT_PUBLIC_GA_ID` from `.env.production` (do not substitute another ID)
4. Verify no duplicate analytics installations exist (GA4 + Plausible both load)

**Priority:** High — analytics data is needed to validate SEO performance improvements.

---

### C. NAP Consistency — Requires Confirmed Business Details

**Finding:** Inconsistencies identified across pages:

| Field | config.ts | Homepage | About Page | City Pages | Schema |
|---|---|---|---|---|---|
| Address | "Tampa, FL" | "Tampa Bay Area" | "Tampa Bay Area, FL" | "Tampa Bay Area" | "Tampa, FL" |
| Phone | "(813) 702-3155" | Via config | Not shown | Not shown | "(813) 702-3155" |
| Employee range | 5-100 | 5-100 | — | 5-500 | — |

**Blocker:** Instruction prohibits changing business identity (name, address, phone) without confirmed details. Do not invent a business name, address, or phone number.

**Required action:**
1. Obtain confirmed business details (legal name, physical address, phone number)
2. Update `src/lib/config.ts` as single source of truth
3. Ensure identical NAP on homepage, footer, About, city pages, managed-tampa, and all schema markup
4. Match Google Business Profile exactly

**Priority:** High — NAP inconsistency affects local search visibility.

---

### D. Metadata Length Issues — Not Confirmed Errors

| Page | Current Length | Issue | Action |
|---|---|---|---|
| `/it-support-tampa` | ~195 chars | Exceeds 160 (will truncate in SERPs) | Deferred — not a confirmed error |
| `/managed-it-services-tampa` | ~175 chars | Exceeds 160 (will truncate in SERPs) | Deferred — not a confirmed error |
| `/services` | ~115 chars | Under 120 | Deferred — not a confirmed error |
| `/glossary` | ~118 chars (now fixed to accurate count) | Was under 120 | **Fixed** |

**Rationale:** Google may generate its own snippets regardless of meta description length. Length alone is not a confirmed technical error. Fix only if Search Console data shows these pages are underperforming.

**Priority:** Low-Medium — defer until GSC data available.

---

### E. Keyword Cannibalization — Requires Performance Data

**Finding:** 4 pages compete for "Tampa IT support / managed IT" queries:
1. Homepage (`/`)
2. `/it-support-tampa`
3. `/managed-it-services-tampa`
4. `/services/managed-it-services`

**Blocker:** Instruction prohibits consolidating Tampa service pages or rewriting the homepage. Cannot implement intent differentiation without violating these constraints.

**Required action:** Wait for GSC data to determine which page Google selects for Tampa queries, then adjust targeting based on actual performance.

**Priority:** High — but blocked by implementation constraints.

---

## 2. Items Requiring Google Search Console Data

The following analyses cannot be completed without GSC access:

| Item | Required Report | Decision Dependent On |
|---|---|---|
| Opportunity A — High impressions, low CTR | Performance report (queries + pages) | Which pages need CTR optimization |
| Opportunity B — Positions 5-20 | Performance report (average position) | Which pages are close to page one |
| Opportunity C — Positions 20-50 | Performance report (average position) | Which pages need content/authority |
| Opportunity D — Relevant keywords, poor rankings | Performance report (queries) | Commercial Tampa Bay search terms |
| Indexed URL count | Index Coverage report | Whether all 612 sitemap URLs are indexed |
| Keyword cannibalization resolution | Pages report by query | Which URL Google selects for Tampa queries |
| Location page value | Performance report filtered by `/` location URLs | Which city pages earn clicks/impressions |

**Required exports:**
1. GSC Performance report: 28-day, 90-day, and year-over-year comparisons
2. GSC Index Coverage report: indexed vs excluded URLs
3. GSC Sitemap report: submitted vs indexed URLs
4. GSC Pages report: impressions, clicks, CTR, position by landing page

---

## 3. Items Requiring Bing Webmaster Tools Data

| Item | Required Report | Decision Dependent On |
|---|---|---|
| Bing impressions/clicks/CTR | Performance report | Bing-specific optimization priorities |
| Bing indexed URLs | Index report | Whether Bing has indexed location/service pages |
| Bing sitemap status | Sitemap report | Whether Bing processed the sitemap |

**Required access:** Bing Webmaster Tools account for `nesscotech.com`.

---

## 4. Recommended 14-Day Monitoring

| Day | Action | Owner | Success Criteria |
|---|---|---|---|
| 1-3 | Deploy to production (with authorization) | DevOps | Build deploys without errors |
| 3-7 | Verify canonical URLs on live pages | SEO | Absolute canonicals rendered in HTML |
| 3-7 | Verify sitemap accessible at `https://nesscotech.com/sitemap.xml` | SEO | Sitemap returns HTTP 200, valid XML |
| 3-7 | Submit sitemap to GSC and Bing WMT | SEO | Submission accepted |
| 7-10 | Monitor GSC for crawl errors | Search Console | No new crawl errors |
| 7-10 | Verify homepage OG image renders on social shares | SEO | `og:image` present in page source |
| 10-14 | Compare pre/post deployment positions | SEO | No significant position drops |

---

## 5. Recommended 28-Day Monitoring

| Day | Action | Success Criteria |
|---|---|---|
| 14-28 | Monitor organic impressions and clicks | Stable or increasing trend |
| 14-28 | Monitor average position for Tampa queries | No significant drops |
| 14-28 | Check GSC Index Coverage | All important URLs indexed |
| 14-28 | Review sitemap processing | URLs from sitemap appearing in index |
| 28 | Full performance review | Compare against baseline; identify next optimizations |

---

## 6. Decisions to Postpone Until Performance Data Available

| Decision | Why Postpone | Data Needed |
|---|---|---|
| Consolidate or differentiate Tampa pages | Cannot determine which page Google prefers | GSC Pages report by query |
| Rewrite meta descriptions for length | Cannot determine if truncation hurts CTR | GSC CTR data by page |
| Remove or noindex thin glossary entries | Cannot determine which entries earn traffic | GSC performance by `/glossary/` URLs |
| Fix relative canonicals on 24 additional pages | Cannot determine impact without crawl data | GSC/Bing index coverage |
| GA4 ID retention or removal | Cannot determine if tracking works | GA4 property access / DebugView |
| NAP standardization | Cannot change without confirmed business details | Verified business identity |

---

## 7. Implementation Checklist for Next Session

- [ ] Obtain GSC and Bing Webmaster Tools access
- [ ] Obtain GA4 property access to verify `G-Q4XQPV4FH7`
- [ ] Obtain confirmed business NAP details
- [ ] Deploy implementation changes to production
- [ ] Submit regenerated sitemap to GSC and Bing
- [ ] Monitor 14-day and 28-day performance metrics
- [ ] Address canonical URLs on 24 additional pages (if data supports)
- [ ] Address metadata length issues (if CTR data supports)

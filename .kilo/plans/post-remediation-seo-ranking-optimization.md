# Post-Remediation SEO Ranking Optimization Plan

**Project:** msp-website — nesscotech.com  
**Plan file:** `.kilo/plans/post-remediation-seo-ranking-optimization.md`  
**Based on:** `.kilo/reports/post-remediation-seo-audit.md`  
**Execution mode:** Plan only — no source files modified  
**Priority framework:** SEO impact (1-10), Confidence (1-10), Effort (1-10), Risk (1-10)

---

## 1. Implementation Sequence (Prioritized)

### Phase 1 — Confirmed technical problems affecting indexability (Week 1)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 1.1 | Resolve GA4 discrepancy: confirm whether `NEXT_PUBLIC_GA_ID` should be present in `.env.production` or removed. If kept, verify ID is valid. If removed, delete line 36. | `.env.production` | Site-wide | High | 9 | 1 | Low |
| 1.2 | Fix canonical URLs: change relative to absolute on location, about, pricing, glossary pages | `src/app/[location]/page.tsx:78`, `src/app/about/page.tsx:25`, `src/app/pricing/page.tsx:16`, `src/app/glossary/page.tsx:15` | 56 location pages + 3 static pages | High | 10 | 2 | Low |
| 1.3 | Fix sitemap `lastmod`: replace build timestamp with meaningful per-URL dates (git log / file mtime) | `next-sitemap.config.js:13` | All 612 sitemap URLs | Medium | 7 | 3 | Low |
| 1.4 | Remove `changefreq` and `priority` from sitemap (Google does not use them) | `next-sitemap.config.js:7-8, 11-12` | All sitemap URLs | Low | 10 | 1 | Low |

### Phase 2 — High-impression pages with poor CTR (Week 1-2)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 2.1 | Fix Tampa location meta description: shorten from ~195 to ≤160 chars, lead with primary keyword | `src/app/[location]/page.tsx:71-73` | `/it-support-tampa` | High | 9 | 1 | Low |
| 2.2 | Fix managed-it-services-tampa meta description: shorten from ~175 to ≤160 chars | `src/app/managed-it-services-tampa/page.tsx:33-35` | `/managed-it-services-tampa` | High | 9 | 1 | Low |
| 2.3 | Expand services index meta description from ~115 to 120-155 chars | `src/app/services/page.tsx:14` | `/services` | Medium | 9 | 1 | Low |
| 2.4 | Expand glossary index meta description from ~118 to 120-155 chars; update "36+" to "115" | `src/app/glossary/page.tsx:13-14` | `/glossary` | Medium | 9 | 1 | Low |

### Phase 3 — Commercial pages with positions 5-20 (Week 2-3)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 3.1 | Differentiate page intents to resolve keyword cannibalization: homepage = Tampa Bay hub, /it-support-tampa = break/fix IT support, /managed-it-services-tampa = managed IT plans, /services/managed-it-services = general managed IT | `src/app/page.tsx`, `src/app/[location]/page.tsx` (Tampa section), `src/app/managed-it-services-tampa/page.tsx`, `src/app/services/page.tsx` | 4 pages | High | 8 | 5 | Medium |
| 3.2 | Add Tampa-specific H2/FAQ/internal links to remaining commercial service pages (cybersecurity, backup, Microsoft 365, network) | `src/app/services/[...slug]/page.tsx` | `/services/it-security`, `/services/backup-disaster-recovery`, `/services/cloud-solutions/microsoft-365`, `/services/network-server` | Medium | 8 | 4 | Low |
| 3.3 | Strengthen homepage as Tampa Bay hub: clear service list, service-area wording, quote CTA, internal links to /it-support-tampa and /managed-it-services-tampa | `src/app/page.tsx` | Homepage | Medium | 8 | 3 | Low |

### Phase 4 — Weak or duplicate metadata (Week 3)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 4.1 | Expand About page title from "About Us" to include location + services | `src/app/about/page.tsx:21` | `/about` | Medium | 9 | 1 | Low |
| 4.2 | Expand Pricing page title from "Pricing" to include location + rates | `src/app/pricing/page.tsx:14` | `/pricing` | Medium | 9 | 1 | Low |
| 4.3 | Align homepage twitter:title with page title | `src/app/page.tsx:31` | Homepage | Low | 10 | 1 | Low |
| 4.4 | Add og:image to homepage | `src/app/page.tsx`, `src/app/layout.tsx` | Homepage | Low | 9 | 2 | Low |

### Phase 5 — Important pages with insufficient internal links (Week 4)

| # | Change | File(s) | Source → Destination | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 5.1 | Add glossary-to-service links: render `relatedService` links on glossary term pages | `src/app/glossary/[term]/page.tsx` (if exists) or glossary term component | Glossary → Service pages | Medium | 8 | 3 | Low |
| 5.2 | Add service-to-glossary links: link relevant glossary terms from service pages | `src/app/services/[...slug]/page.tsx` | Service → Glossary | Medium | 8 | 3 | Low |
| 5.3 | Add /it-support-tampa and /managed-it-services-tampa links from all service pages (not just 4 Tampa targets) | `src/app/services/[...slug]/page.tsx` | All service pages → Tampa pages | Medium | 8 | 2 | Low |

### Phase 6 — Location and service content improvements (Week 4-6)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 6.1 | Remove unsubstantiated trust claims ("5.0★ Google", "Licensed & Insured", "500+ Clients", "Top Rated Tampa Bay") from all pages; replace with real, dated, photo-backed testimonials or remove | `src/app/page.tsx:171-189`, `src/app/[location]/page.tsx:176-194`, `src/app/managed-it-services-tampa/page.tsx:102-120`, `src/lib/testimonials.ts` | Homepage + 56 location pages + managed-tampa | High | 9 | 4 | Medium |
| 6.2 | Fix NAP consistency: single source of truth for address, phone, employee range across all pages | `src/lib/config.ts`, `src/app/page.tsx`, `src/app/[location]/page.tsx`, `src/app/about/page.tsx`, `src/app/managed-it-services-tampa/page.tsx` | All pages | High | 9 | 3 | Low |
| 6.3 | Fix `googleReviewUrl`: replace Maps search URL with direct review link | `src/lib/config.ts:16` | Site-wide (schema + testimonials) | Low | 9 | 1 | Low |

### Phase 7 — Topical authority opportunities (Week 6-8)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 7.1 | Classify 115 glossary entries into Group A (index), Group B (improve), Group C (consolidate); apply noindex to Group C if warranted | `src/lib/glossary.ts`, glossary route config | Glossary pages | Medium | 7 | 4 | Medium |
| 7.2 | Separate business vs consumer guides; surface business guides on service/city pages | `src/lib/guides.ts`, `src/app/[location]/page.tsx`, `src/app/services/[...slug]/page.tsx` | Guides, location, service pages | Medium | 7 | 4 | Low |

### Phase 8 — Lower-priority cosmetic SEO improvements (Week 8+)

| # | Change | File(s) | URLs affected | Impact | Confidence | Effort | Risk |
|---|---|---|---|---|---|---|---|
| 8.1 | Fix About page E-E-A-T: named owner, photo, LinkedIn, credential links | `src/app/about/page.tsx` | `/about` | Low | 8 | 3 | Low |
| 8.2 | Add location-specific hero images to remaining city pages | `src/lib/locations.ts` | Location pages | Low | 7 | 5 | Low |

---

## 2. Exact Files to Modify

| File | Changes |
|---|---|
| `.env.production` | Resolve GA4 ID (keep valid ID or remove line 36) |
| `next-sitemap.config.js` | Fix `lastmod` strategy, remove `changefreq`/`priority` |
| `src/app/page.tsx` | Fix twitter:title alignment, add og-image, homepage as Tampa Bay hub, remove trust claims, fix NAP |
| `src/app/layout.tsx` | Add og:image to root metadata (fallback for all pages) |
| `src/app/[location]/page.tsx` | Fix meta description length (Tampa), fix canonical (absolute), remove trust claims, fix NAP |
| `src/app/managed-it-services-tampa/page.tsx` | Fix meta description length, remove trust claims, fix NAP |
| `src/app/services/page.tsx` | Expand meta description |
| `src/app/glossary/page.tsx` | Expand meta description, update "36+" to "115" |
| `src/app/about/page.tsx` | Expand title, fix NAP, E-E-A-T improvements |
| `src/app/pricing/page.tsx` | Expand title, fix NAP |
| `src/app/services/[...slug]/page.tsx` | Add Tampa targeting to more services, internal links |
| `src/lib/config.ts` | Fix `googleReviewUrl`, NAP single source of truth |
| `src/lib/testimonials.ts` | Replace curated placeholders with real reviews or remove |
| `src/lib/locations.ts` | Add hero images to remaining cities (optional) |

---

## 3. Recommended Metadata

### Homepage (`/`)
- **Title:** "Nessco Tech Services \| Tampa Bay IT Support" (43 chars, no suffix needed)
- **Description:** "Managed IT, cybersecurity, cloud, network, and backup services for Tampa Bay businesses. Remote from $75/hr, on-site from $125/hr. 5-100 employees." (~150 chars)
- **og:image:** `/og-image.png`
- **twitter:title:** Match page title

### Tampa Location (`/it-support-tampa`)
- **Title:** "IT Support & Managed IT Services in Tampa, FL" (45 chars)
- **Description:** "Business IT support in Tampa, FL. Managed IT, helpdesk, cybersecurity, Microsoft 365, backups for 5-100 employee companies. Remote from $75/hr, on-site from $125/hr." (~155 chars)

### Managed IT Tampa (`/managed-it-services-tampa`)
- **Title:** "Managed IT Services in Tampa, FL \| Nessco Tech Services" (~58 chars with suffix)
- **Description:** "Managed IT services in Tampa, FL for businesses with 5-100 employees. 24/7 monitoring, cybersecurity, Microsoft 365, backups, helpdesk. Remote from $75/hr." (~150 chars)

### Services Index (`/services`)
- **Title:** "IT Services \| Nessco Tech Services"
- **Description:** "Managed IT, cybersecurity, cloud, network, IT support, backup & recovery for Tampa Bay businesses. Remote $75/hr, on-site $125/hr." (~140 chars)

### Glossary Index (`/glossary`)
- **Title:** "IT Glossary — Plain-English Tech Terms \| Nessco Tech Services"
- **Description:** "Confused by IT jargon? Our glossary explains 115 tech terms in plain English, from networking to Microsoft 365. Search, filter by category." (~150 chars)

### About (`/about`)
- **Title:** "About Nessco Tech Services \| Tampa Bay IT Support"
- **Description:** "Nessco Tech Services provides managed IT, cybersecurity, cloud, network, and backup services for Tampa Bay businesses with 5-100 employees." (~145 chars)

### Pricing (`/pricing`)
- **Title:** "IT Pricing \| Tampa Bay — Remote $75/hr, On-Site $125/hr"
- **Description:** "Simple, transparent IT pricing. Remote $75/hr, on-site $125/hr. Business IT plans, fixed monthly pricing. No hidden fees." (~140 chars)

---

## 4. Content Improvements

### Trust claims removal
Remove from all pages (homepage, 56 location pages, managed-tampa):
- "5.0★ Google" — no verifiable Google reviews
- "Licensed & Insured" — no license/insurance details provided
- "500+ Clients" — no supporting data
- "Top Rated Tampa Bay" — no award source

Replace with: real, dated, photo-backed testimonials (from `src/lib/testimonials.ts`) or remove the trust bar entirely until genuine reviews are available.

### NAP standardization
Single source of truth:
- Name: Nessco Tech Services
- Address: Tampa, FL 33602
- Phone: (813) 702-3155
- Employee range: 5-100 (consistent everywhere)
- Service area: Tampa Bay cities listed in config.ts

Render identical NAP on: homepage, footer, About, city pages, managed-tampa, schema (organization + localBusiness + cityBusiness).

### Keyword cannibalization resolution
Assign distinct intent per page:
- Homepage: Broad Tampa Bay hub, all services, CTA to get-help
- `/it-support-tampa`: Break/fix IT support, on-demand help, same-day remote
- `/managed-it-services-tampa`: Monthly managed IT plans, proactive monitoring, vCIO
- `/services/managed-it-services`: General managed IT services (non-location-specific)

Cross-link between pages with clear intent differentiation, not duplicate targeting.

---

## 5. Internal Linking Changes

| Source | Destination | Reason |
|---|---|---|
| All service pages | `/it-support-tampa`, `/managed-it-services-tampa` | Currently only 4 Tampa-targeted services link to these; expand to all |
| Glossary term pages | Related service pages via `relatedService` | Not currently rendered; add contextual links |
| Service pages | Relevant glossary entries | Topical authority, contextual relevance |
| Location pages | Relevant service pages (already exist) | Keep, ensure all 8 service groups linked |
| Homepage | `/it-support-tampa`, `/managed-it-services-tampa` | Already exist; keep |
| Blog/guides | Relevant service and location pages | Already partially exists; expand |

---

## 6. Technical Fixes

### Sitemap (`next-sitemap.config.js`)
Replace:
```js
changefreq: 'weekly',
priority: 0.7,
transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
}),
```
With per-URL `lastmod` based on file modification time or git log, and remove `changefreq`/`priority` from output.

### Canonical URLs
Change relative canonicals to absolute:
- `/${location}` → `https://nesscotech.com/${location}`
- `/about` → `https://nesscotech.com/about`
- `/pricing` → `https://nesscotech.com/pricing`
- `/glossary` → `https://nesscotech.com/glossary`

### GA4
Confirm `NEXT_PUBLIC_GA_ID` status. If valid, keep. If invalid, remove from `.env.production`. Do not guess a different ID.

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Removing trust claims reduces conversion rate | Medium | Medium | Replace with real testimonials or social proof; A/B test |
| Changing canonical URLs causes temporary indexing disruption | Low | Medium | Use absolute URLs consistent with sitemap; monitor GSC |
| Sitemap `lastmod` change causes recrawl | Low | Low | Beneficial; Google recrawls updated URLs |
| Keyword cannibalization fix causes ranking shuffle | Medium | Medium | Monitor GSC positions for 2-4 weeks; adjust if needed |
| GA4 removal loses tracking data | Medium | Low | Only if ID is genuinely invalid; verify before removing |

---

## 8. Validation Procedures

1. `npm run lint` — passes with no new errors
2. `npm run build` — succeeds, next-sitemap postbuild regenerates sitemap
3. All 69 existing tests pass
4. Sitemap XML validates; no excluded assets present
5. Canonical URLs are absolute and consistent with sitemap
6. Meta descriptions within 120-160 char range for all pages
7. No trust claims without substantiation
8. NAP identical across homepage, footer, About, city pages, schema
9. Compare localhost:3000 vs https://nesscotech.com (requires deployment authorization)

---

## 9. Expected Outcomes

| Metric | Baseline | Expected (30-60 days) |
|---|---|---|
| Indexed URLs | ~612 (unverified) | Stable or slightly reduced (noindex thin glossary) |
| Organic CTR | Unverified | +10-20% on Tampa pages (better meta descriptions) |
| Position for "IT support Tampa" | Unverified | Top 10 (from positions 5-20 range) |
| Position for "managed IT services Tampa" | Unverified | Top 10 (from positions 5-20 range) |
| Technical errors | 13 confirmed | 0 confirmed |

**Note:** All expected outcomes are estimates. Actual results require GSC/Bing data for validation.

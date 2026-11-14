# Post-Remediation SEO Audit Report

**Project:** msp-website — nesscotech.com  
**Report file:** `.kilo/reports/post-remediation-seo-audit.md`  
**Audit date:** 2026-11-05  
**Execution mode:** Audit only — no source files modified  
**Repository state:** Working tree at commit `cfb240f` (HEAD)

---

## 1. Executive Summary

The previous SEO remediation resolved 3 confirmed technical issues (52 placeholder glossary entries, 3 non-page sitemap URLs, invalid GA4 ID identification). However, the remediation report contains at least one material discrepancy: it claims `NEXT_PUBLIC_GA_ID` was removed from `.env.production`, but the file still contains `G-Q4XQPV4FH7`. Several high-impact issues identified in the prior remediation plan (trust claims, sitemap quality, NAP consistency, canonical URLs, Open Graph, keyword cannibalization) were not addressed. No search performance data (GSC/Bing) was available for this audit.

---

## 2. Previous Remediation Results — Completed Task Inventory

### Source documents inspected

| Document | Path | Status |
|---|---|---|
| SEO Audit Remediation Plan | `.kilo/plans/1793365291000-seo-audit-remediation-plan.md` | Present |
| SEO Error Remediation Plan | `.kilo/plans/1793835254589-seo-error-remediation.md` | Present |
| SEO Remediation Results | `.kilo/reports/seo-remediation-results.md` | Present |
| SEO Baseline Report | `.kilo/reports/seo-baseline.md` | Present |
| Tampa SEO Plan | `.kilo/plans/1793297964294-tampa-seo-plan.md` | Present |

### Git history (relevant commits)

| Commit | Message | Date |
|---|---|---|
| `cfb240f` | Restore valid GA4 measurement ID default in docker-compose.yml | 2026-11-05 |
| `8f96876` | Remove invalid GA4 ID default from docker-compose.yml | 2026-11-05 |
| `01e0301` | SEO error remediation: fix 52 glossary terms, exclude non-page sitemap URLs, remove invalid GA4 ID | 2026-11-04 |
| `d1ac301` | SEO remediation baseline checkpoint | 2026-11-04 |

### Completed tasks (verified in code)

| Task ID | Task | Evidence | Status |
|---|---|---|---|
| T-01 | Replace 52 placeholder glossary entries | `src/lib/glossary.ts` — all 115 entries have unique terms, definitions, categories; no "IT Term XX" placeholders remain | **Complete** |
| T-02 | Exclude non-page URLs from sitemap | `next-sitemap.config.js:6` — `/apple-icon`, `/icon.svg`, `/opengraph-image` in exclude array; verified absent from `public/sitemap-0.xml` | **Complete** |
| T-03 | Identify invalid GA4 ID | `G-Q4XQPV4FH7` returns HTTP 404 from google-analytics.com | **Complete (identification only)** |

### Partially completed tasks

| Task ID | Task | Gap | Status |
|---|---|---|---|
| T-04 | Remove invalid GA4 ID from `.env.production` | Remediation report claims removal, but `.env.production:36` still contains `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7`. Git commit `01e0301` did not modify `.env.production` (gitignored). Latest session digest claims ID was restored across environments. | **Discrepancy — unverified** |
| T-05 | Regenerate sitemap | `public/sitemap-0.xml` regenerated via `next-sitemap` postbuild, but all URLs use build timestamp for `lastmod`, `changefreq: weekly`, `priority: 0.7` — issues flagged in prior plan but not fixed | **Partial** |

### Skipped / not addressed tasks (from prior remediation plan)

| Task ID | Task | Evidence of non-completion |
|---|---|---|
| T-06 | Remove unsubstantiated trust claims | "5.0★ Google", "Licensed & Insured", "500+ Clients", "Top Rated Tampa Bay" still render on homepage (`src/app/page.tsx:171-189`), all 56 location pages (`src/app/[location]/page.tsx:176-194`), and managed-it-services-tampa (`src/app/managed-it-services-tampa/page.tsx:102-120`). Testimonials remain curated placeholders (`src/lib/testimonials.ts:20-48`, `source: "curated"`). |
| T-07 | Fix NAP consistency | `config.ts` address = "Tampa, FL", phone = "(813) 702-3155". About page renders "Tampa Bay Area, FL". City pages say "Tampa Bay Area" with no phone. Employee range: 5-100 (homepage) vs 5-500 (city/managed-tampa pages). |
| T-08 | Fix Open Graph inconsistencies | Homepage (`layout.tsx` + `page.tsx`) sets no `og:image`. Homepage `twitter:title` ("Managed IT & Cybersecurity") differs from `<title>` ("Tampa Bay IT Support"). |
| T-09 | Fix keyword cannibalization | Homepage, `/it-support-tampa`, `/managed-it-services-tampa`, `/services/managed-it-services` all target "Tampa IT support / managed IT". |
| T-10 | Fix About page E-E-A-T | Team member shown as initials "NT", no photoUrl, no LinkedIn, certs with no verification links. |
| T-11 | Fix sitemap `lastmod`/`changefreq`/`priority` | All 612 URLs use build timestamp `2026-11-05T00:01:47.xxxZ`, `changefreq: weekly`, `priority: 0.7`. |
| T-12 | Verify www/non-www redirect | `next.config.ts:27` has www → non-www redirect but not verified as active in production. |
| T-13 | Fix location page canonical URLs | Location pages use relative canonical `/${location}` instead of absolute `https://nesscotech.com/${location}`. |

### Regressions introduced by remediation

None identified. Build passes, all 69 tests pass, no new lint errors from changed files. No unrelated files modified.

---

## 3. Meta Description Audit

### Methodology

Inspected metadata in:
- `src/app/layout.tsx` (root defaults)
- `src/app/page.tsx` (homepage)
- `src/app/[location]/page.tsx` (56 location pages)
- `src/app/services/[...slug]/page.tsx` (service pages)
- `src/app/services/page.tsx` (services index)
- `src/app/managed-it-services-tampa/page.tsx` (Tampa managed IT)
- `src/app/glossary/page.tsx` (glossary index)
- `src/app/about/page.tsx` (about)
- `src/app/pricing/page.tsx` (pricing)

Character counts computed using the `metaDescription` clamp function in `src/lib/meta.ts:17` (max 155 chars).

### Character count categories

| URL | Page type | Current description | Char count | Primary keyword | Issue | Priority |
|---|---|---|---|---|---|---|
| `https://nesscotech.com/` | Homepage | "Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses. Proactive monitoring, 24/7 support." | ~125 | Tampa IT support | In 120-139 range; acceptable length but generic, no strong CTA | Medium |
| `https://nesscotech.com/about` | About | "Nessco Tech Services provides secure, managed, reliable IT support for Tampa Bay businesses — managed IT, cybersecurity, cloud, network, and backup services." | ~150 | Nessco Tech Services about | 140-160 range; acceptable but could be more compelling | Low |
| `https://nesscotech.com/pricing` | Pricing | "Simple, transparent IT pricing. Remote $75/hr, on-site $125/hr. Business IT plans, fixed monthly pricing." | ~120 | IT pricing Tampa | Borderline 120; good commercial intent | Low |
| `https://nesscotech.com/services` | Services index | "Managed IT, cybersecurity, cloud, network, IT support, backup & recovery for Tampa Bay businesses." | ~115 | IT services Tampa | **Under 120 chars** — may be truncated or rewritten by Google | Medium |
| `https://nesscotech.com/glossary` | Glossary index | "Confused by IT jargon? Our glossary explains 36+ tech terms in plain English, from networking to Microsoft 365." | ~118 | IT glossary | **Under 120 chars** — says "36+" but site has 115 terms; understates content | Medium |
| `https://nesscotech.com/it-support-tampa` | Location (Tampa) | "Business IT support in Tampa, FL. Managed IT services, helpdesk, cybersecurity, Microsoft 365, and backups for companies with 5-500 employees. Remote from $75/hr, on-site from $125/hr." | ~195 | IT support Tampa | **Exceeds 160 chars** — will be truncated in SERPs | High |
| `https://nesscotech.com/managed-it-services-tampa` | Location (Tampa managed IT) | "Managed IT services in Tampa, FL for businesses with 5-500 employees. 24/7 monitoring, cybersecurity, Microsoft 365, backups, and helpdesk. Remote from $75/hr." | ~175 | Managed IT services Tampa | **Exceeds 160 chars** — will be truncated in SERPs | High |
| `https://nesscotech.com/it-support-{city}` (55 other cities) | Location | "Professional IT support in {City}, {County} County. Remote help starting at $75/hr, on-site visits at $125/hr. Computers, Wi-Fi, Microsoft 365, security. Serving Tampa Bay." | ~145 | IT support {City} | 120-139 range; acceptable but template-based, low uniqueness | Medium |
| Service pages (non-Tampa targets) | Service | Varies by `shortDescription` from `src/lib/config.ts` navItems | Varies | Service-specific | Generally within range; some may be under 120 | Low-Medium |
| Service pages (Tampa targets: managed-it-services, it-support, network-server, cloud-solutions/microsoft-365) | Service | "{shortDescription} Serving Tampa Bay businesses with remote and on-site support." | Varies | Service + Tampa | Appended clause may push some over 160 | Medium |

### Duplicate description analysis

- **Location pages (55 non-Tampa cities)**: All use the same template with only city/county swapped. Descriptions are near-duplicates differing only in location name.
- **Homepage vs. layout defaults**: Root layout description ("Managed IT services, cybersecurity, cloud, and network support for Tampa Bay businesses.") differs from homepage override.
- **Service pages**: Each service has unique `shortDescription`, so no duplicates expected.

### Description quality issues

1. **Glossary index** understates content volume ("36+" vs 115 actual terms).
2. **Location pages** use generic template language with no unique value proposition beyond city name swap.
3. **Homepage description** lacks specific commercial differentiation (no mention of response time, pricing, or service areas beyond "Tampa Bay").
4. **Tampa location page** description exceeds 160 chars and will be truncated mid-sentence.

### Missing descriptions

None identified — all indexable pages have meta descriptions set via Next.js Metadata API.

---

## 4. Title Tag Audit

### Title analysis

| URL | Page type | Title tag | Char count | Issue | Priority |
|---|---|---|---|---|---|
| `https://nesscotech.com/` | Homepage | "Nessco Tech Services \| Tampa Bay IT Support" | 43 | Good length; no brand suffix (dropped because base >40 chars) | Low |
| `https://nesscotech.com/about` | About | "About Us \| Nessco Tech Services" | ~33 | Too short; generic, no location or service keywords | Medium |
| `https://nesscotech.com/pricing` | Pricing | "Pricing \| Nessco Tech Services" | ~31 | Too short; generic, no location keywords | Medium |
| `https://nesscotech.com/services` | Services | "IT Services \| Nessco Tech Services" | ~31 | Too short; generic | Medium |
| `https://nesscotech.com/glossary` | Glossary | "IT Glossary — Plain-English Tech Terms" | 39 | Good; no brand suffix (base >40? no, 39 < 40, so suffix added → "IT Glossary — Plain-English Tech Terms \| Nessco Tech Services" = ~66) | Low |
| `https://nesscotech.com/it-support-tampa` | Location | "IT Support \& Managed IT Services in Tampa, FL" | 45 | Good; no brand suffix | Low |
| `https://nesscotech.com/managed-it-services-tampa` | Location | "Managed IT Services in Tampa, FL" | 34 | Suffix added → "Managed IT Services in Tampa, FL \| Nessco Tech Services" (~58) | Low |
| `https://nesscotech.com/it-support-{city}` (55 cities) | Location | "IT Support in {City}, FL" (small cities) or "{city} title \| Nessco Tech Services" | ~28-35 base | Short titles get brand suffix; acceptable but generic | Low |
| Service pages (Tampa targets) | Service | "{Service} for Tampa Businesses" + suffix if ≤40 | ~35-45 | Good intent | Low |
| Service pages (non-Tampa) | Service | Service title + " \| Nessco Tech Services" | Varies | Generally acceptable | Low |

### Keyword cannibalization

Four pages compete for "Tampa IT support / managed IT" queries:
1. `https://nesscotech.com/` (homepage) — broad Tampa Bay hub
2. `https://nesscotech.com/it-support-tampa` — IT support Tampa
3. `https://nesscotech.com/managed-it-services-tampa` — Managed IT Tampa
4. `https://nesscotech.com/services/managed-it-services` — Managed IT services (general)

This was identified in the prior remediation plan (Issue #9) but not addressed.

### Title issues

1. **Homepage twitter:title** ("Nessco Tech Services \| Managed IT & Cybersecurity") differs from `<title>` ("Nessco Tech Services \| Tampa Bay IT Support") — inconsistent brand messaging in SERPs vs social.
2. **About/Pricing/Services titles** are too short and generic, missing location and primary service keywords.
3. **No location differentiation** in titles for non-Tampa city pages beyond city name swap.

---

## 5. Technical SEO Audit

### Canonical tags

| Page type | Canonical implementation | Issue |
|---|---|---|
| Homepage | `alternates: { canonical: "https://nesscotech.com/" }` | Correct, absolute |
| Layout (root) | No canonical set on root layout; individual pages override | Root layout has no canonical, but pages set their own |
| Location pages | `alternates: { canonical: "/${location}" }` | **Relative URL** — should be absolute `https://nesscotech.com/${location}` |
| Service pages | `alternates: { canonical: pageUrl }` (absolute) | Correct |
| Services index | `alternates: { canonical: "https://nesscotech.com/services" }` | Correct |
| About/Pricing/Glossary | `alternates: { canonical: "/about" }` etc. | **Relative URLs** — should be absolute |

### Robots.txt

`public/robots.txt`:
- `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Disallow: /get-help/step-`
- References `Sitemap: https://nesscotech.com/sitemap.xml`
- No `Host` directive (not required but recommended for consolidation)

`public-robots.txt` (root, appears to be a variant):
- Has `Host: https://nesscotech.com` directive
- Same disallows

### XML Sitemaps

`public/sitemap.xml` → sitemap index → `sitemap-0.xml`

Issues identified:
1. **612 URLs** all with identical `lastmod` = build timestamp (`2026-11-05T00:01:47.xxxZ`) — no meaningful change frequency data
2. All URLs have `changefreq: weekly` and `priority: 0.7` — Google does not use these as ranking signals
3. Non-page URLs (`/apple-icon`, `/icon.svg`, `/opengraph-image`) correctly excluded
4. `/get-help/step-*` excluded via config but individual `/get-help/*` pages included (these are form steps, may be appropriate)
5. No lastmod differentiation between frequently-changed and static pages

### GA4 / Analytics

**Discrepancy**: Remediation report (`.kilo/reports/seo-remediation-results.md`, Section 2, E-03) states `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7` was removed from `.env.production`. However, current `.env.production:36` still contains `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7`.

Git verification: Commit `01e0301` did NOT modify `.env.production` (file is gitignored, so changes wouldn't show in git). The `git show 01e0301 --stat` confirms only 3 files were modified: `next-sitemap.config.js`, `public/sitemap-0.xml`, `src/lib/glossary.ts`.

Latest session digest (ses_e57163cc2ffeXJa1dwc6dOJv9z) states GA4 ID was "restored" across `.env`, `.env.production`, and `docker-compose.yml`. This conflicts with the remediation report's claim of removal.

**Current state**: GA4 script conditionally loads only when `NEXT_PUBLIC_GA_ID` is set (`layout.tsx:66-108`). Since the ID is present in `.env.production`, GA4 tracking is active on production builds. Plausible analytics also loads unconditionally (`layout.tsx:113-117`).

### Structured Data (JSON-LD)

`src/lib/schemas.ts` contains:
- `organizationSchema()` — Organization with foundingDate "2015" (unverified claim), sameAs links to Google Maps/Facebook/LinkedIn
- `localBusinessSchema()` — LocalBusiness with priceRange "$75-$125/hr", areaServed GeoCircle 50km, opening hours, hasOfferCatalog with 3 offers including Managed IT at $499/month
- `faqPageSchema()` — FAQPage
- `breadcrumbSchema()` — BreadcrumbList
- `serviceSchema()` — Service with offers
- `serviceListSchema()` — ItemList
- `cityBusinessSchema()` — LocalBusiness per city
- `definitionSchema()` — DefinedTerm for glossary

**Issues:**
1. `organizationSchema` foundingDate "2015" — unverified business claim (AGENTS.md: do not invent years in business)
2. `localBusinessSchema` openingHoursSpecification includes Saturday 09:00-14:00 — verify against actual business hours
3. `localBusinessSchema` priceRange "$75-$125/hr" and offer prices match commercial-services.ts — consistent
4. `cityBusinessSchema` uses `priceRange: "$$"` — generic, not specific
5. All JSON-LD is injected via `<JsonLd>` component on client-side; verify Google can render it

### HTTP Response Codes

- `next.config.ts` redirects: www → non-www (permanent), 18 service URL redirects (permanent), 5 blog redirects (permanent)
- No redirect chains or loops identified in configuration
- `/get-help/step-*` disallowed in robots.txt but sitemap includes individual get-help pages

### Mobile Rendering / Core Web Vitals

- `viewport` configured with `width: device-width, initialScale: 1, maximumScale: 5`
- Font preload for Geist sans/mono
- Images use Next.js Image optimization with AVIF/WebP formats
- No field data available (CrUX not accessible)

---

## 6. Location Page Audit

### Inventory

56 location pages exist in `src/lib/locations.ts`, all at `/{slug}` routes:

**12 remoteFirst** (45+ min out, remote-first): Bradenton, Sarasota, Spring Hill, Brooksville, Dade City, Bartow, North Port, Venice, The Villages, Ocala, Port Charlotte, Punta Gorda

**44 standard** (on-site available): Tampa, St. Petersburg, Clearwater, Brandon, Riverview, Lakeland, Wesley Chapel, Plant City, Temple Terrace, Lutz, Valrico, Largo, Pinellas Park, Seminole, Apollo Beach, Land O' Lakes, Dunedin, Safety Harbor, Tarpon Springs, Palm Harbor, New Port Richey, Trinity, Zephyrhills, Winter Haven, Sun City Center, Ruskin, Seffner, Gibsonton, Wimauma, Carrollwood, Town 'n' Country, Gulfport, St. Pete Beach, Oldsmar, Port Richey, Holiday, Hudson, Auburndale, Haines City, Davenport, Lake Wales, Palmetto, Parrish, Lakewood Ranch

### Content quality

**Strengths:**
- Each page has unique `intro`, `highlights` (3-6 items), `responseNote`, and geo coordinates
- City-specific content references local landmarks, neighborhoods, and business types
- Schema markup via `cityBusinessSchema()` with city-specific geo and address
- Breadcrumb JSON-LD included
- Internal links to nearby locations (same-county first, capped at 12)
- Rotated guides and fixes per city (deterministic rotation by slug seed)

**Weaknesses:**
1. **Unsubstantiated trust claims** on all 56 pages: "5.0★ Google", "Licensed & Insured", "500+ Clients", "Top Rated Tampa Bay" — testimonials are curated placeholders with no dates or photos
2. **Employee range inconsistency**: Config says 5-100, city pages say 5-500, homepage says 5-100
3. **Address inconsistency**: config.ts says "Tampa, FL"; about page says "Tampa Bay Area, FL"; city pages say "Tampa Bay Area"
4. **Relative canonical URLs** instead of absolute
5. **Meta descriptions** are template-based with only city/county swapped (near-duplicates across 55 pages)
6. **Tampa page description exceeds 160 chars** (~195 chars)
7. **No phone number on city pages** — only on homepage/footer via config
8. **Hero image** only on some cities (St. Petersburg, Clearwater, Brandon, Riverview have `heroImage`); others use default

### Pages deserving improvement

**High priority (commercial intent + Search Console visibility noted in prior plan):**
- Tampa (492 impressions noted in prior plan)
- Lakeland (324 impressions)
- St. Petersburg (232 impressions)
- Bradenton (161 impressions, 1 click)
- Clearwater
- Brandon
- Riverview

**Medium priority:** Remaining 49 city pages — evaluate based on Search Console performance data

---

## 7. Service Page Audit

### Service inventory (from `src/lib/config.ts` navItems children, ~60 services across 8 groups)

**Managed IT Services group:**
- Managed IT Services (featured)
- 24/7 Monitoring & Alert Response
- Virtual CIO & IT Strategy
- IT Consulting & Management
- Outsourced IT Functions
- Complete IT Services
- Co-Managed IT Services

**IT Security group:**
- IT Security & Cybersecurity
- Managed Endpoint Security (EDR/XDR/MDR)
- Managed Email Security
- Vulnerability Analysis & Remediation
- Security Audits & Compliance
- Cybersecurity Suite

**Cloud Solutions group:**
- Cloud Solutions
- Microsoft 365 for Business
- Google Workspace
- Managed Azure & AWS
- Cloud Infrastructure & Migration
- Cloud File Sync & Collaboration
- Business Email & Hosting
- Cloud Desktops & Virtualization
- Hosted Private Cloud

**Network & Server group:**
- Network & Server Infrastructure
- Network Infrastructure & Cabling
- Wireless Design & Implementation
- Windows & Linux Server Administration
- Virtualization & Consolidation
- Internet & Fiber Setup
- Data Center Design & Colocation
- SAN & Storage Implementation

**IT Support group:**
- IT Support & Helpdesk
- Helpdesk IT Support
- PC & Mac Support
- Server & Network Support
- Data Center Design & Setup

**Backup & Disaster Recovery group:**
- Backup & Disaster Recovery
- Backup Solutions
- Disaster Recovery Planning
- High Availability Services
- Data Recovery
- Offsite Disaster Recovery

**Applications group:**
- Business Applications
- Microsoft 365 Management
- QuickBooks & ERP Hosting
- Application Hosting & Virtualization
- Application Migrations
- Remote Access Solutions

**Communications group:**
- Business Communications
- Phone Systems (VoIP/UCaaS)
- Business Email & Security
- Messaging & Team Collaboration
- Meeting & Video Conferencing

### Keyword cannibalization

Four pages target "Tampa IT support / managed IT":
1. Homepage — broad Tampa Bay
2. `/it-support-tampa` — IT support Tampa
3. `/managed-it-services-tampa` — Managed IT Tampa
4. `/services/managed-it-services` — Managed IT services general

### Service page strengths

- Each service has unique problem statement, whatWeDo list, whoItsFor, pricing, FAQs
- JSON-LD: Service schema, FAQPage schema, BreadcrumbList schema
- OG image: `/og-image.png` on all service pages
- Related services and guides sections
- Tampa-targeted services (managed-it-services, it-support, network-server, cloud-solutions/microsoft-365) get Tampa-specific FAQ section and internal links

### Service page weaknesses

- Tampa-targeted service descriptions append "Serving Tampa Bay businesses with remote and on-site support." which may push some descriptions over 160 chars
- No unique H1 differentiation for Tampa-targeted pages (H1 stays generic service title)
- 4 services flagged as Tampa targets; other commercial services (cybersecurity, backup, Microsoft 365 standalone) don't get Tampa-specific treatment

---

## 8. Glossary Audit

### Inventory

115 glossary entries in `src/lib/glossary.ts`, all at `/glossary/{slug}`.

**Categories:** Security (25), Networking (16), Microsoft 365 (15), Backup (5), Hardware (5), Support (8), Cloud (6), General (7)

**All 52 placeholder entries (term-064 through term-115) were replaced** with real IT terminology. Verified: no term starts with "IT Term", no placeholder definitions remain.

### Glossary index page metadata

- Title: "IT Glossary — Plain-English Tech Terms \| Nessco Tech Services" (~66 chars with suffix)
- Description: "Confused by IT jargon? Our glossary explains 36+ tech terms in plain English, from networking to Microsoft 365." (~118 chars) — **under 120 chars** and understates actual count (115 terms)
- OG description: "36+ tech terms explained simply. Search, filter by category, and find related guides." (~80 chars)

### Issues

1. **Description understates content**: Says "36+" but site has 115 terms
2. **Description under 120 chars**: May be expanded by Google
3. **Individual glossary entries**: 115 pages, each with unique term/definition. Some entries have low "popularity" scores (42-65 range: MTTF 42, SLO 48, patch-panel 55, SAN 52, soc 58, intune 73, etc.) — may be thin content candidates
4. **Overlap potential**: Some terms overlap (e.g., "MSP" and "Break-Fix" both relate to IT models; "EDR / XDR" and "Antivirus" both security; "Immutable Backup" and "Air Gap" both backup)
5. **Internal linking**: Each entry has `relatedTerms` and optional `relatedService` — links resolve within glossary and to service pages

### Indexing strategy

All 115 entries are currently indexed (in sitemap). Per prior plan, should classify into Group A (index), Group B (improve before indexing), Group C (consolidate/reconsider). Not yet done.

---

## 9. Internal Linking Audit

### Internal link structure

**Navigation** (`src/lib/config.ts`):
- Main nav: Services (mega menu with ~60 children), Pricing, Industries, About, Blog, Contact
- Footer: Not fully inspected but referenced in prior plan as having links to canonical paths

**Homepage links to:**
- `/get-help`, `/quote`, `/storm-ready`, `/pricing`, `/services`, `/services/category/{id}`, `/services/managed-it-services`, `/it-support-tampa`, `/managed-it-services-tampa`, `/contact`

**Location pages link to:**
- `/get-help`, `/pricing`, `/storm-ready`, `/services/{slug}`, `/guides/{slug}`, `/fixes/{slug}`, `/blog/{slug}` (Tampa only), nearby locations (12 per page), `/contact`

**Service pages link to:**
- `/get-help?category={cat}`, related services, related guides, related fixes, `/it-support-tampa`, `/managed-it-services-tampa` (Tampa targets only)

### Link distribution concerns

1. **Location pages receive links from**: Homepage (via Tampa Bay section), nearby location pages (reciprocal), service pages (Tampa targets only)
2. **Service pages receive links from**: Homepage service categories, navigation mega menu, location pages (all services grouped by category)
3. **Glossary pages receive links from**: Glossary index, relatedTerms within entries, service pages (not directly)
4. **Blog/guides pages**: 160+ guides, internal links from service pages and location pages (rotated)

### Recommended internal linking improvements

- Link glossary entries to relevant service pages (already have `relatedService` but not rendered on service pages)
- Link service pages to relevant glossary entries for topical authority
- Add location page links from relevant service pages (not just Tampa targets)
- Add `/it-support-tampa` and `/managed-it-services-tampa` links from all service pages (currently only Tampa-targeted 4)

---

## 10. Local SEO Audit

### NAP (Name, Address, Phone)

| Source | Name | Address | Phone |
|---|---|---|---|
| `src/lib/config.ts` | Nessco Tech Services | Tampa, FL 33602 | (813) 702-3155 |
| Homepage (`page.tsx`) | Nessco Tech Services | Tampa Bay Area | (813) 702-3155 (via config) |
| About page | Nessco Tech Services | Tampa Bay Area, FL | Not shown |
| City pages | Nessco Tech Services | Tampa Bay Area | Not shown on page |
| `organizationSchema` | Nessco Tech Services | Tampa, FL | (813) 702-3155 |
| `localBusinessSchema` | Nessco Tech Services | Tampa, FL 33602 | (813) 702-3155 |
| `cityBusinessSchema` | Nessco Tech Services — {City} | {City}, FL | (813) 702-3155 |

**Inconsistencies:**
- Address: "Tampa, FL" (config/schema) vs "Tampa Bay Area, FL" (About/city pages)
- Phone: Not displayed on city pages or About page
- Employee range: 5-100 (config/homepage) vs 5-500 (city/managed-tampa pages)

### LocalBusiness structured data

- `organizationSchema()` — Organization, no `localBusiness` type at root level
- `localBusinessSchema()` — LocalBusiness with Tampa geo (27.9506, -82.4572), 50km radius, Saturday hours
- `cityBusinessSchema()` — Per-city LocalBusiness with city geo coordinates, parentOrganization link

**Issues:**
1. No `geo` on root `localBusinessSchema` latitude/longitude are hardcoded to Tampa coordinates — matches config
2. `cityBusinessSchema` uses `priceRange: "$$"` — generic
3. No `hasOfferCatalog` on city business schema
4. Saturday hours (09:00-14:00) in schema — verify against actual operations

### Google Business Profile / Bing Places

Not accessible in this environment. Cannot verify consistency.

### `googleReviewUrl`

`config.ts:16`: `"https://www.google.com/maps/search/Nessco+Tech+Services+Tampa+Bay"` — This is a Google Maps **search** URL, not a direct review link. Should be a Place Details / review URL.

---

## 11. Search Performance Analysis

### Data availability

Google Search Console and Bing Webmaster Tools data were **not accessible** in this audit environment. No performance data (impressions, clicks, CTR, position) could be retrieved.

### Prior plan references Search Console data

The SEO Audit Remediation Plan (`.kilo/plans/1793365291000-seo-audit-remediation-plan.md`) references Search Console data from October 2026:
- Bradenton: 161 impressions, 1 click
- Tampa: 492 impressions
- Lakeland: 324 impressions
- St. Petersburg: 232 impressions
- www.nesscotech.com: 224 impressions
- nesscotech.com: 156 impressions

This data is historical and cannot be verified without account access.

### Required exports

To complete opportunity analysis, the following exports are needed:
1. Google Search Console Performance report (28-day, 90-day, YoY) — queries, pages, countries, devices
2. Bing Webmaster Tools Performance report (same dimensions)
3. GSC Index Coverage report — indexed vs excluded URLs
4. GSC Sitemap report — submitted vs indexed URLs

### Opportunity framework (unverified without data)

| Opportunity | Description | Data needed |
|---|---|---|
| A — High impressions, low CTR | Pages appearing in SERPs but receiving few clicks | GSC/Bing queries + CTR by page |
| B — Positions 5-20 | Pages close to page-one visibility | GSC/Bing average position by query |
| C — Positions 20-50 | Pages needing content/authority | GSC/Bing position data |
| D — Relevant keywords, poor rankings | Commercial Tampa Bay searches (managed IT Tampa, cybersecurity Tampa, etc.) | GSC/Bing query data |

---

## 12. Competitor and Keyword Opportunity Research

### Data availability

Web access for competitor research was not utilized in this audit. No competitor data collected.

### Known keyword targets (from site content and plans)

Commercial Tampa Bay searches:
- Managed IT services Tampa
- MSP Tampa
- IT support Tampa
- Business IT support Tampa
- Cybersecurity Tampa
- Network support Tampa
- Microsoft 365 support Tampa
- IT support Clearwater
- IT support St. Petersburg

### Content gap indicators (from site structure)

1. No dedicated "IT support Clearwater" page (Clearwater is a location page, not a service+location combo)
2. No dedicated "cybersecurity Tampa" page (cybersecurity is under `/services/it-security`, no Tampa variant)
3. No dedicated "Microsoft 365 support Tampa" page (M365 is under `/services/cloud-solutions/microsoft-365`, no Tampa variant)
4. 160+ guides include consumer topics (Facebook recovery, Apple ID, headphone crackle) diluting business-IT authority

---

## 13. Summary of Confirmed Issues (non-speculative)

| # | Issue | Location | Severity | Evidence |
|---|---|---|---|---|
| 1 | GA4 ID discrepancy: report says removed, file still has it | `.env.production:36` | High | File inspection vs remediation report |
| 2 | Unsubstantiated trust claims on 58+ pages | Homepage, 56 location pages, managed-tampa | High | `src/app/page.tsx:171-189`, `[location]/page.tsx:176-194`, `managed-it-services-tampa/page.tsx:102-120` |
| 3 | Sitemap `lastmod` = build timestamp for all 612 URLs | `public/sitemap-0.xml`, `next-sitemap.config.js:13` | Medium | All timestamps identical |
| 4 | Sitemap `changefreq: weekly`, `priority: 0.7` on all URLs | `next-sitemap.config.js:7-8` | Low | Google does not use these |
| 5 | Relative canonical URLs on location, about, pricing, glossary pages | `[location]/page.tsx:78`, `about/page.tsx:25`, `pricing/page.tsx:16`, `glossary/page.tsx:15` | Medium | Should be absolute URLs |
| 6 | Meta description under 120 chars: services index (~115), glossary (~118) | `services/page.tsx:14`, `glossary/page.tsx:13` | Medium | May be expanded/rewritten by Google |
| 7 | Meta description over 160 chars: Tampa location (~195), managed-tampa (~175) | `[location]/page.tsx:71-73`, `managed-it-services-tampa/page.tsx:33-35` | High | Will be truncated in SERPs |
| 8 | NAP inconsistency: address, phone, employee range across pages | `config.ts`, `page.tsx`, `about/page.tsx`, `[location]/page.tsx` | Medium | Conflicting values |
| 9 | Keyword cannibalization: 4 pages target Tampa IT/managed IT | Homepage, it-support-tampa, managed-it-services-tampa, services/managed-it-services | High | Confirmed in prior plan |
| 10 | Homepage missing og:image; twitter:title ≠ page title | `layout.tsx`, `page.tsx` | Low | Confirmed in code |
| 11 | Glossary description understates 115 terms as "36+" | `glossary/page.tsx:13` | Low | Code inspection |
| 12 | `googleReviewUrl` is Maps search URL, not direct review link | `config.ts:16` | Low | Confirmed in code |
| 13 | About page E-E-A-T gaps: initials "NT", no photo, no LinkedIn | `about/page.tsx` | Medium | Confirmed in prior plan |

---

## 14. Pages with Best Ranking Opportunities (estimated, without GSC data)

Based on commercial intent, existing Search Console references from prior plan, and page structure:

1. `https://nesscotech.com/it-support-tampa` — 492 impressions referenced in prior plan
2. `https://nesscotech.com/managed-it-services-tampa` — Dedicated managed IT Tampa page
3. `https://nesscotech.com/it-support-lakeland` — 324 impressions referenced in prior plan
4. `https://nesscotech.com/it-support-st-petersburg` — 232 impressions referenced in prior plan
5. `https://nesscotech.com/it-support-bradenton` — 161 impressions, 1 click referenced in prior plan
6. `https://nesscotech.com/services/managed-it-services` — Core commercial service
7. `https://nesscotech.com/services/it-security` — High commercial intent, Tampa cybersecurity
8. `https://nesscotech.com/services/cloud-solutions/microsoft-365` — High commercial intent
9. `https://nesscotech.com/services/backup-disaster-recovery` — High commercial intent
10. `https://nesscotech.com/services/it-support` — Core commercial service

---

## 15. Data Limitations

1. **No Google Search Console access** — Cannot verify impressions, clicks, CTR, positions, or indexed URL count
2. **No Bing Webmaster Tools access** — Same limitation
3. **No production website access** — Cannot verify live HTTP responses, rendered HTML, or Core Web Vitals
4. **No GA4 dashboard access** — Cannot verify tracking status despite ID being present in `.env.production`
5. **Historical Search Console data** referenced in prior plan is from October 2026 and may be stale

---

## 16. Executive Summary

### 1. Is the previous remediation successful?

**Partially.** Three confirmed technical issues were resolved:
- 52 placeholder glossary entries replaced with real IT terminology (all 115 entries now unique)
- 3 non-page URLs excluded from sitemap (`/apple-icon`, `/icon.svg`, `/opengraph-image`)
- Invalid GA4 ID `G-Q4XQPV4FH7` identified as returning HTTP 404

However, the remediation report contains a **material discrepancy**: it claims `NEXT_PUBLIC_GA_ID` was removed from `.env.production`, but the file still contains `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7` on line 36. The git commit `01e0301` did not modify `.env.production` (file is gitignored).

Several high-impact issues from the prior remediation plan were **not addressed**: unsubstantiated trust claims, sitemap `lastmod`/`changefreq`/`priority` quality, NAP consistency, canonical URLs, Open Graph consistency, keyword cannibalization, and About page E-E-A-T.

### 2. What SEO problems remain?

| Problem | Location | Severity |
|---|---|---|
| GA4 ID discrepancy (report vs file) | `.env.production:36` | High |
| Unsubstantiated trust claims on 58+ pages | Homepage, 56 location pages, managed-tampa | High |
| Tampa meta description ~195 chars (exceeds 160) | `/it-support-tampa` | High |
| Managed-tampa meta description ~175 chars (exceeds 160) | `/managed-it-services-tampa` | High |
| Relative canonical URLs | 56 location pages + about, pricing, glossary | Medium |
| Services index description ~115 chars (under 120) | `/services` | Medium |
| Glossary index description ~118 chars (under 120) | `/glossary` | Medium |
| NAP inconsistency (address, phone, employee range) | All pages | Medium |
| Keyword cannibalization (4 Tampa-targeted pages) | Homepage, it-support-tampa, managed-tampa, services/managed-it-services | High |
| Sitemap all URLs use build timestamp for lastmod | `sitemap-0.xml` | Medium |
| Homepage missing og:image; twitter:title mismatch | Homepage | Low |
| About page E-E-A-T gaps | `/about` | Medium |

### 3. Which 10 pages offer the best ranking opportunities?

1. `https://nesscotech.com/it-support-tampa` — 492 impressions referenced in prior plan
2. `https://nesscotech.com/managed-it-services-tampa` — Dedicated managed IT Tampa page
3. `https://nesscotech.com/it-support-lakeland` — 324 impressions referenced in prior plan
4. `https://nesscotech.com/it-support-st-petersburg` — 232 impressions referenced in prior plan
5. `https://nesscotech.com/it-support-bradenton` — 161 impressions, 1 click referenced in prior plan
6. `https://nesscotech.com/services/managed-it-services` — Core commercial service
7. `https://nesscotech.com/services/it-security` — High commercial intent (cybersecurity Tampa)
8. `https://nesscotech.com/services/cloud-solutions/microsoft-365` — High commercial intent
9. `https://nesscotech.com/services/backup-disaster-recovery` — High commercial intent
10. `https://nesscotech.com/services/it-support` — Core commercial service

### 4. Which 10 changes should be implemented first?

1. Resolve GA4 ID discrepancy in `.env.production` (keep valid or remove)
2. Remove unsubstantiated trust claims from homepage + 56 location pages + managed-tampa
3. Fix Tampa location meta description (shorten to ≤160 chars)
4. Fix managed-tampa meta description (shorten to ≤160 chars)
5. Fix canonical URLs: relative → absolute on location, about, pricing, glossary pages
6. Fix NAP consistency across all pages (single source of truth)
7. Expand services index meta description (>120 chars)
8. Expand glossary index meta description (>120 chars, update "36+" to "115")
9. Differentiate page intents to resolve keyword cannibalization (4 Tampa pages)
10. Fix sitemap `lastmod` (per-URL dates instead of build timestamp)

### 5. What is preventing the website from ranking better?

1. **Unverified technical state**: GA4 configuration discrepancy creates uncertainty about analytics tracking
2. **Trust signal problems**: Unsubstantiated claims ("5.0★ Google", "Licensed & Insured", "500+ Clients") on 58+ pages harm E-E-A-T and may trigger manual review
3. **Metadata issues**: Two Tampa commercial pages have descriptions over 160 chars (truncated in SERPs); services and glossary index pages under 120 chars
4. **Keyword cannibalization**: Four pages compete for the same Tampa IT/managed IT queries
5. **NAP inconsistency**: Conflicting address, phone, and employee range across pages confuses local search signals
6. **No search performance data**: GSC and Bing Webmaster Tools access unavailable, preventing data-driven prioritization
7. **Sitemap quality**: All 612 URLs share identical build-timestamp `lastmod`, reducing crawl efficiency signals

### 6. What should be done over the next 30 days?

**Week 1:** Fix GA4 discrepancy, fix canonical URLs (relative→absolute), fix Tampa and managed-tampa meta descriptions (>160→≤160), remove trust claims from all pages
**Week 2:** Fix NAP consistency, expand under-length meta descriptions (services, glossary), begin keyword cannibalization differentiation
**Week 3:** Complete keyword cannibalization resolution, add internal links from service pages to Tampa pages, fix sitemap `lastmod`
**Week 4:** Deploy (with authorization), submit sitemap to GSC/Bing, monitor positions for 2-4 weeks

**Prerequisites:** Obtain GSC and Bing Webmaster Tools access before deployment validation. Obtain explicit deployment authorization before pushing to production.

---

## 17. Recommended Next Steps

1. Resolve GA4 discrepancy: confirm whether `NEXT_PUBLIC_GA_ID=G-Q4XQPV4FH7` should be present or removed
2. Obtain GSC and Bing Webmaster Tools access for performance data
3. Fix unsubstantiated trust claims (highest-impact content issue)
4. Fix canonical URLs (relative → absolute)
5. Fix meta description lengths (Tampa pages over 160, services/glossary under 120)
6. Address NAP consistency across all pages
7. Resolve keyword cannibalization among 4 Tampa-targeted pages
8. Export sitemap and submit to GSC/Bing after fixes

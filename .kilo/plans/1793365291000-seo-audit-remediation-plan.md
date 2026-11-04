# SEO Audit Remediation Plan — nesscotech.com

## Status: verified against codebase (Oct 30, 2026)

I crawled the actual source and confirmed which prior-audit claims are still live vs. already fixed. The plan below is revised per October Search Console data: Bradenton (161 impressions, 1 click) and other city pages are already earning visibility, so **do not blanket-redirect 46 city pages** — audit all 56 first.

---

### Already fixed in current code (no action needed)

| Audit claim | Current state | File |
|---|---|---|
| Broken footer links to `/services/computer-repair`, etc. | Footer links to canonical new paths matching `next.config.ts` redirects | `src/components/layout/Footer.tsx:57-70` |
| `google-site-verification-placeholder` meta | Not present anywhere in `src/` | — |
| `meta name="keywords"` tag | Not present anywhere in `src/` | — |
| Missing JSON-LD / structured data | `organizationSchema`, `localBusinessSchema`, `cityBusinessSchema`, `breadcrumbSchema`, `serviceSchema`, `faqPageSchema` all present and wired | `src/lib/schemas.ts` |
| Canonical URLs missing | `alternates: { canonical }` on all pages | — |
| `robots.txt` missing | Present in `public/`, allows all, disallows `/api/` and `/get-help/step-` | `public/robots.txt` |
| Orphaned blog posts | Blog index links to `/blog/${slug}` for every article | `src/app/blog/page.tsx:153-185` |
| "Watch us fix it" hard placeholder | `VideoSection` renders empty-state + email capture only when no videos exist | `src/components/services/VideoSection.tsx:59-125` |
| Contradictory `$95/$145/$150` service-card pricing | All service groups use `remote: 75, onsite: 125` | `src/lib/commercial-services.ts:12-60` |

---

### Confirmed live issues (actionable)

**P0 — Search-quality risks**

1. **Low-quality sitemap** — every URL has `lastmod` = build timestamp, `changefreq: weekly`, `priority: 0.7`; lists non-pages `/apple-icon`, `/maintenance`, `/network-visualization`, `/opengraph-image`, `/icon.svg`. `public/sitemap-0.xml:3-5` confirms `/apple-icon` is included.
   - Fix: real `lastmod` per URL (git log / file mtime), drop non-pages. **Do not over-optimize `priority`/`changefreq` — Google does not use them as ranking signals.**
   - File: `next-sitemap.config.js`

2. **56 city pages — audit before redirecting** — `src/lib/locations.ts` has 56 locations; 12 are `remoteFirst: true`. Google is already showing some city pages (e.g., Bradenton 161 impressions, 1 click; Tampa 492 impressions; Lakeland 324; St. Petersburg 232). Do not blindly redirect 46 pages to nearest metro — a redirect to an unrelated page can be treated like a soft 404 and may not preserve earned visibility.
   - Fix: prioritize 10 core Tampa Bay metros (Tampa, St. Petersburg, Clearwater, Brandon, Riverview, Lakeland, Wesley Chapel, Plant City, Largo, Pinellas Park); export Search Console performance data for all 56 city pages; keep/rewrite pages with clicks, meaningful impressions, strong positions, or backlinks with genuinely unique local content; redirect only genuinely weak or redundant pages to a relevant destination; drop removed pages from sitemap, footer, and About pills.
   - Files: `src/lib/locations.ts`, `next.config.ts redirects`, `src/components/layout/Footer.tsx`, `src/app/about/page.tsx`

3. **www / non-www hostname consolidation** — Search Console shows both `https://www.nesscotech.com/` (224 impressions) and `https://nesscotech.com/` (156 impressions).
   - Fix: permanent 301 redirect to one canonical hostname; canonical URLs use preferred hostname; sitemap uses only that hostname; internal links consistently use it. `next.config.ts` already redirects `www` → non-www; verify it's active and correct.

4. **Unsubstantiated trust claims** — homepage, city pages, and `/managed-it-services-tampa` all render "5.0★ Google", "Licensed & Insured", "500+ Clients", "Top Rated Tampa Bay" (`src/app/page.tsx:171-189`, `[location]/page.tsx:178-194`, `managed-it-services-tampa/page.tsx:103-120`). `testimonials.ts` has only 3 curated, undated, photo-less quotes with `source: "curated"`. `config.googleReviewUrl` is a Google Maps *search* URL, not a direct review URL. `businessStats` does not support "500+ clients".
   - Fix: remove claims unless substantiated; replace with real reviews (dates, photos, source) or drop; fix `googleReviewUrl` to a direct review link; add review schema only for genuine third-party reviews. **Nuance: if "Licensed & Insured" is true, keep it but add license and insurance details; otherwise remove.**
   - Files: `src/lib/testimonials.ts`, `src/lib/config.ts`, page components

5. **Inconsistent NAP** — `config.ts` address = "Tampa, FL", phone = "(813) 702-3155" (source of truth, used by Footer). About page renders "Tampa Bay Area, FL — on-site & remote" (`about/page.tsx:210`). City pricing line says "Tampa Bay Area" with no phone (`[location]/page.tsx:166-174`). "5–100 employees" (homepage `page.tsx:62`) vs "5–500" (city page + managed-tampa) scope mismatch.
   - Fix: single source of truth; render identical NAP + employee range everywhere; match Google Business Profile exactly.
   - Files: `src/lib/config.ts`, `src/app/page.tsx`, `[location]/page.tsx`, `src/app/about/page.tsx`, `managed-it-services-tampa/page.tsx`

**P1 — Technical / indexing**

6. **Open Graph inconsistencies** — homepage (`layout.tsx` + `page.tsx`) sets no `og:image`; city/service/blog pages use `/og-image.png`. Homepage `twitter:title` ("Managed IT & Cybersecurity") differs from `<title>` ("Tampa Bay IT Support").
   - Fix: add `og:image: /og-image.png` + `images` to homepage metadata; align `twitter:title` with `<title>`; add brand to blog OG/twitter titles.
   - Files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/blog/page.tsx`

7. **`Loading service...` Suspense fallback** — `services/[...slug]/page.tsx:299`. Only shows on client transition; SSR/static renders full content. Confirm via Search Console URL Inspection that Google sees full HTML.
   - File: `src/app/services/[...slug]/page.tsx`

8. **Verify Search Console / GBP status and `robots.txt` fetch** (blocked in this environment). (`public/robots.txt`)

**P2 — Content / strategy**

9. **Keyword cannibalization** — homepage, `/it-support-tampa`, `/managed-it-services-tampa`, `/services/managed-it-services` all target "Tampa IT support / managed IT".
   - Fix: compare actual query/page data in Search Console first, then differentiate one intent per page; consolidate overlapping pages.
   - Files: homepage, `/it-support-tampa`, `/managed-it-services-tampa`, `/services/managed-it-services`

10. **Audience drift** — ~160 guides include consumer topics (Facebook/IG recovery, Apple ID, doorbell Wi-Fi, headphone crackle) diluting business-IT authority.
    - Fix: tag guides business vs consumer; surface business guides on service/city pages; keep consumer guides but separate them from the business funnel. Don't delete useful content indiscriminately.
    - Files: `src/lib/guides.ts`, `src/app/blog/page.tsx`, service/city pages

11. **E-E-A-T / About page gaps** — team member is initials "NT", no `photoUrl`, no LinkedIn, certs listed with no verification links (`about/page.tsx:153-165`). No named owner.
    - Fix: named owner, real photo, LinkedIn link, credential links; link the 6 case studies from service and city pages.
    - File: `src/app/about/page.tsx`

---

## Phased implementation order

**Phase 1 — Technical foundation**
- Fix sitemap: real `lastmod`, drop non-pages (`/apple-icon`, `/maintenance`, `/network-visualization`, `/opengraph-image`, `/icon.svg`).
- Consolidate www/non-www: permanent 301 to canonical hostname; canonicals, sitemap, internal links consistent.
- Verify canonicals across pages.
- Verify `robots.txt`.
- Verify rendered HTML via Search Console URL Inspection (service pages).

**Phase 2 — Protect existing search visibility**
- Export Search Console performance data for all 56 city pages.
- Identify pages worth retaining (clicks, meaningful impressions, strong positions, backlinks).
- Rewrite valuable pages with genuinely unique, accurate local content.
- Carefully redirect only genuinely weak or redundant pages to a relevant destination.
- Remove redirected pages from sitemap, footer, About pills.

**Phase 3 — Build credibility**
- Remove unsupported trust claims (or substantiate with license/insurance details).
- Add owner profile (Anthony Becker), real photograph (`public/team/AnthonyB.jpg`), LinkedIn link, verified credentials.
- Add real, dated, photo-backed customer testimonials; fix `googleReviewUrl` to direct review link.
- Link relevant case studies from service and city pages.

**Phase 4 — Improve search targeting**
- Differentiate page intents to end keyword cannibalization (homepage, `/it-support-tampa`, `/managed-it-services-tampa`, `/services/managed-it-services`).
- Separate business vs consumer guides; organize internal links toward managed IT services.
- Improve top-performing city pages (Tampa, Lakeland, St. Petersburg).

**Phase 5 — Validate**
- Run `npm run lint`, `npm run build`.
- Deploy.
- Check redirects and canonicals.
- Submit sitemap.
- Monitor Search Console for 2–4 weeks.

---

## Validation
- `npm run lint` passes
- `npm run build` succeeds (next-sitemap postbuild regenerates sitemap)
- Search Console URL Inspection: service pages render full HTML; sitemap accepted
- www/non-www 301 redirect active; canonicals use single hostname
- Kept city pages have unique local content; redirected pages return proper 301 to relevant destination
- NAP identical across homepage, footer, About, city pages, schema
- Monitor Search Console 2–4 weeks post-deploy for impressions/clicks/position changes

---

## Decision log

**Resolved — #1 metros to keep:** Prioritize 10 Tampa Bay metros (Tampa, St. Petersburg, Clearwater, Brandon, Riverview, Lakeland, Wesley Chapel, Plant City, Largo, Pinellas Park — the non-`remoteFirst` Tampa Bay core). **Do not blanket-redirect 46 pages.** Audit all 56 in Search Console first; keep/rewrite valuable pages; redirect only genuinely weak or redundant ones to a relevant destination. Source: user feedback Oct 30 2026 based on Search Console report.

**Resolved — #2 www/non-www:** Consolidate to one canonical hostname with permanent 301 redirect; canonicals, sitemap, and internal links use it consistently. `next.config.ts` already has `www` → non-www redirect; verify it's active. Source: user feedback Oct 30 2026 (www: 224 impressions, non-www: 156 impressions).

**Resolved — #3 sitemap priority/changefreq:** Fix real `lastmod` and drop non-pages only; do not spend significant effort optimizing `priority`/`changefreq` as Google does not use them as ranking signals. Source: user feedback Oct 30 2026.

**Resolved — #4 NAP:** "Nessco Tech Services · Tampa, FL · (813) 702-3155 · info@nesscotech.com" matches GBP exactly. Source: user confirmed 2026-10-30. Will make Footer/About/city pages/schema identical.

**Resolved — #5 employee range:** 5–100 employees everywhere. Source: user confirmed 2026-10-30. Align city page FAQ and managed-it-services-tampa to 5–100.

**Resolved — #6 trust claims:** Remove all unsubstantiated claims ("500+ Clients", "Licensed & Insured", "Top Rated Tampa Bay", "5.0★ Google") from homepage/city pages/managed-tampa. Replace curated placeholder reviews with real, dated, photo-backed reviews or drop them. Fix `googleReviewUrl` to a direct review link. **Nuance: if "Licensed & Insured" is true, keep it but add license and insurance details; otherwise remove.** Source: user confirmed 2026-10-30.

**Resolved — #7 About owner:** Anthony Becker, photo `public/team/AnthonyB.jpg`, LinkedIn https://www.linkedin.com/in/anthony-becker-77134738a/. Rename team member from initials "NT" to "Anthony Becker", add the photo + LinkedIn link + credential links; link the 6 case studies from service/city pages. Source: user supplied 2026-10-30.

**Open — deployment verification:** Plan's "already fixed" items (footer links, verification placeholder, keywords tag, pricing consistency) exist in code but reviewer observed old footer links + placeholder tag still on live /it-support-tampa and /blog this morning. Confirm these fixes are deployed before marking complete; re-check after next deploy.

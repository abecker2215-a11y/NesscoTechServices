# Plan: Add New Case Studies for Target Verticals

## Goal
Add 3 new case studies targeting missing AGENTS.md verticals (Construction, Financial Services, Nonprofits) to strengthen local SEO and trust-building content.

## Context
- Existing case studies: 3 (Law Firm M365 Migration, Medical Practice Ransomware, Retail Chain Wi-Fi)
- **Each case study is its own directory**: `src/app/case-studies/<slug>/page.tsx` — there is NO `[slug]` page and NO `generateStaticParams`
- Case study listing page: `src/app/case-studies/page.tsx` — hardcoded `caseStudies[]` array with fields: slug, title, industry, location, challenge, solution, results[], stats {time, savings, users}, quote, quoteName
- AGENTS.md target verticals: Healthcare ✅, Law Firms ✅, Financial Services ❌, Construction ❌ (plus Nonprofits gap)
- AGENTS.md content rules: no fabricated testimonials, customer counts, pricing, guarantees. Existing case studies already contain quotes + specific numbers (pre-existing content). New case studies should avoid fabricated quotes/specific numbers to comply.
- Valid helpCategories IDs (for CTA links): computer, wifi, email, m365, security, printer, hardware, business, other
- `next-sitemap` runs on `postbuild`, so new case study URLs are picked up automatically

## Design Decisions
1. **Add 3 new case studies:** Construction (job-site network), CPA/Accounting (QuickBooks hosting + security), Nonprofit (donor management security)
2. **File structure:** Create `src/app/case-studies/<slug>/page.tsx` for each (standalone static pages, not a `[slug]` param page)
3. **Follow existing convention:** metadata, JsonLd CaseStudy schema, challenge/solution/results sections, metrics cards, FAQ, CTA — mirroring `law-firm-m365-migration/page.tsx`
4. **Content rules compliance:** Omit fabricated quotes/testimonials and specific dollar/customer numbers. Use role-neutral or no attribution. Describe outcomes qualitatively where possible.
5. **CTA links:** Use `/get-help?category=<validId>` with valid category IDs (wifi, business, etc.)
6. **Add entries to `caseStudies[]` array** in listing page with all required fields (slug, title, industry, location, challenge, solution, results[], stats, quote, quoteName)
7. **No new dependencies** — existing components (Button, Reveal, FAQAccordion, Card, JsonLd, lucide-react)

## New Case Studies

| Slug | Title | Industry | Location | Focus | helpCategory CTA |
|------|-------|----------|----------|-------|------------------|
| construction-job-site-network | Construction Company: Job-Site Network & Wi-Fi | Construction | Tampa | Job-site connectivity, POS, mobile device management | wifi |
| cpa-firm-quickbooks-hosting | CPA Firm: QuickBooks Hosting & Data Security | Financial Services | Lakeland | QuickBooks hosting, tax season uptime, client data protection | business |
| nonprofit-donor-management | Nonprofit: Donor Management & Data Security | Nonprofits | St. Petersburg | Donor database, grant tracking, volunteer coordination | business |

## Affected Files
- `src/app/case-studies/construction-job-site-network/page.tsx` — NEW
- `src/app/case-studies/cpa-firm-quickbooks-hosting/page.tsx` — NEW
- `src/app/case-studies/nonprofit-donor-management/page.tsx` — NEW
- `src/app/case-studies/page.tsx` — add 3 entries to `caseStudies[]` array

## Task List
1. Create `src/app/case-studies/construction-job-site-network/page.tsx`
2. Create `src/app/case-studies/cpa-firm-quickbooks-hosting/page.tsx`
3. Create `src/app/case-studies/nonprofit-donor-management/page.tsx`
4. Add 3 entries to `caseStudies[]` in `src/app/case-studies/page.tsx`
5. Run `npm run lint` — must pass
6. Run `npm run build` — must succeed (verifies new static pages)
7. Verify sitemap includes new `/case-studies/*` URLs
8. Verify new case studies appear on `/case-studies` listing page

## Validation
- `npm run lint` passes with no errors
- `npm run build` succeeds (production build)
- All 3 new case study pages generate as static HTML
- New case studies appear on `/case-studies` listing page
- Sitemap includes all 3 new `/case-studies/*` URLs
- No fabricated testimonials, specific pricing, or customer counts in new content

## Rollback
- Delete the 3 new page files and remove the 3 array entries from `src/app/case-studies/page.tsx`

## Open Questions
None — all decisions resolved. Ready to implement.
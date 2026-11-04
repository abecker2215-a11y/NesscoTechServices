# Plan: Blog Content Expansion + UX Improvements

## Goal
Add 10 new blog articles targeting local service keywords and improve blog UX: working category filter, search, related posts, recent posts sidebar, date-based grouping.

## Context
- Blog data lives in `src/lib/blog.ts` (hardcoded `blogArticles[]`, 3 articles currently)
- Listing page: `src/app/blog/page.tsx` (Server Component, category buttons are non-functional)
- Detail page: `src/app/blog/[slug]/page.tsx` (uses `generateStaticParams`, no related posts)
- Categories on listing page: `["All", "Business IT", "Security", "Data Protection", "Guides", "Quick fixes"]`
- No automated tests exist (Phase 1 scope gap — out of scope for this plan)
- `next-sitemap` runs on `postbuild`, so new static blog URLs are picked up automatically
- AGENTS.md constraints: no fabricated claims, pricing, testimonials, certifications, or guarantees; build incrementally; no unnecessary dependencies
- Next.js version: `^16.5.0-canary.3` (Next 15 canary) — `searchParams` is a Promise in Server Components; must `await`
- Existing pattern for related items: `src/app/guides/[slug]/page.tsx:147-166` (`getGuidesForService(...).filter(...).slice(0,3)`)
- Existing global search: `src/components/search/FuseSearch.tsx` (client component, searches services/guides/pages, NOT blog articles)
- All existing blog articles are dated Sep–Oct 2026 — grouping by year yields a single group

## Design Decisions (resolved)
1. **Article count: 10** (within user's 6-10 range, good coverage of service keywords)
2. **Data source:** hardcoded in `src/lib/blog.ts` — consistent with existing pattern, no CMS/dependency added
3. **Category filter:** URL search param `?category=...`; buttons navigate with `next/link`; Server Component reads `await searchParams` and filters
4. **Date-based grouping:** group by month-year (e.g., "October 2026", "September 2026") — year-only grouping yields one group since all articles are 2026
5. **Related posts:** on detail page, up to 3 articles sharing same category, excluding current — mirrors existing guides pattern
6. **Recent posts sidebar:** 5 most recent articles, shown on both listing and detail pages
7. **No new dependencies** — use existing `lucide-react`, `clsx`, `tailwind-merge`
8. **No fabricated claims/pricing/testimonials** in any article content
9. **Component structure:** keep logic inline in page.tsx files first; extract to `src/components/blog/` only if pages exceed ~200 lines

## Design Decisions (resolved — user confirmed Option 1)
**A. Search approach:** URL search param `?q=...` on `/blog` — server-rendered, shareable URLs, works without JS, consistent with category filter approach. `await searchParams` in Server Component.

**B. Search + category composition:** Both `?q=` and `?category=` can coexist on `/blog` (e.g., `?category=Security&q=ransomware`). Filtering applies category first, then search within results.

**C. Empty states:** When category filter or search returns 0 results, show an empty state message ("No articles match your filters") with a link to clear filters, rather than an empty grid.

**D. Recent posts placement:** On the detail page, recent posts is a section at the bottom of the article (below related posts), not a sidebar — avoids major layout restructuring of the existing max-w-3xl container.

**E. Category buttons:** Change from static `<button>` elements to `<Link href="/blog?category=...">` so filtering works without client-side JS. "All" links to `/blog` (no param).

## Failure Modes & Edge Cases
- **Duplicate slugs:** `generateStaticParams` will fail at build time if two articles share a slug — all 13 slugs (3 existing + 10 new) are unique.
- **Missing serviceSlug:** Some articles may not have a `serviceSlug` — the "View related services" link on detail pages is conditionally rendered only when `serviceSlug` exists.
- **Category with no articles:** New categories (Cloud, Communications, Network) each have exactly one article — filter works, shows one result.
- **Search with no matches:** Returns empty state; no crash.
- **`searchParams` is a Promise:** Must `await` in both `generateMetadata` and the page component on `src/app/blog/page.tsx`.

## New Articles (added to `src/lib/blog.ts`)
| Slug | Title | Category | serviceSlug |
|------|-------|----------|-------------|
| it-support-tampa-bay-small-business | IT Support for Tampa Bay Small Businesses: What to Look For | Business IT | it-support |
| cloud-migration-tampa-bay | Cloud Migration for Tampa Bay Businesses: A Practical Guide | Cloud | cloud-solutions/infrastructure-migration |
| ransomware-protection-small-business | Ransomware Protection for Small Businesses | Security | it-security |
| microsoft-365-security-tampa | Microsoft 365 Security for Tampa Businesses | Security | cloud-solutions/microsoft-365 |
| business-email-security-tampa | Business Email Security: Protecting Against Phishing and Spoofing | Security | cloud-solutions/business-email |
| backup-disaster-recovery-tampa-bay | Backup and Disaster Recovery for Tampa Bay Businesses | Data Protection | backup-disaster-recovery |
| voip-phone-systems-small-business | VoIP Phone Systems for Small Businesses | Communications | communications/phone-systems |
| it-consulting-tampa-bay | IT Consulting for Growing Tampa Bay Businesses | Business IT | managed-it-services/consulting |
| cybersecurity-audit-tampa-bay | Cybersecurity Audit: What Tampa Bay Businesses Need to Know | Security | it-security/audit-compliance |
| network-wifi-setup-small-business | Network and Wi-Fi Setup for Small Businesses | Network | network-server |

New categories to add to listing page filter list: Cloud, Communications, Network
Article dates: all "Oct 2026" — consistent with existing article date format; date grouping produces one group initially

## Affected Files
- `src/lib/blog.ts` — add 10 articles; add helpers: `getArticlesByCategory`, `searchArticles`, `getRelatedArticles`, `getRecentArticles`, `groupArticlesByDate`
- `src/app/blog/page.tsx` — working category filter buttons (`?category=`), search input (`?q=`), date-based grouping, recent posts sidebar
- `src/app/blog/[slug]/page.tsx` — related posts section below article body (same category, max 3, exclude current)

## Task List
1. Add 10 new articles to `src/lib/blog.ts` following existing `BlogArticle` shape (no pricing, no fabricated claims); all dates "Oct 2026"
2. Add helper functions to `src/lib/blog.ts`: `getArticlesByCategory`, `searchArticles`, `getRelatedArticles`, `getRecentArticles`, `groupArticlesByDate`
3. Update `src/app/blog/page.tsx`: category buttons as `<Link href="/blog?category=...">`, search input (`?q=`), compose `?category=` + `?q=`, date-based grouping, recent posts section, empty state for zero results
4. Update `src/app/blog/[slug]/page.tsx`: related posts section below article body (same category, max 3, exclude current); recent posts section at bottom
5. Run `npm run lint` — must pass
6. Run `npm run build` — must succeed (verifies `generateStaticParams` for new slugs)
7. Verify sitemap includes new `/blog/*` URLs (next-sitemap postbuild)
8. Spot-check: category filter narrows results, search returns matches, `?category=&?q=` composition works, related posts show same-category articles, empty state shows for zero results

## Validation
- `npm run lint` passes with no errors
- `npm run build` succeeds (production build)
- All 10 new article slugs generate static pages
- Category filter narrows results on `/blog` (`?category=Security` shows only Security articles)
- Search returns matching articles on `/blog` (`?q=ransomware` shows matching articles)
- `?category=` + `?q=` composition works together
- Empty state shows when filter/search returns zero results
- Related posts section appears on each article detail page (same category, max 3, excludes current)
- Recent posts section shows 5 most recent articles on listing and detail pages
- No fabricated pricing, customer counts, or testimonials in article content

## Rollback
- Revert `src/lib/blog.ts` to original 3 articles; revert page.tsx changes
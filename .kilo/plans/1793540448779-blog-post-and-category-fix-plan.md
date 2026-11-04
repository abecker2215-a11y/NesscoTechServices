# Plan: Add 20 New Blog Articles + Fix Blog Category-Filter Mismatch

## Goal
- Add 20 new blog articles to `src/lib/blog.ts` with unique, real-sounding titles that fill category gaps (Backup, Applications, Cloud, Communications). Bodies are clearly-marked placeholders for real content (per AGENTS.md, no fabricated business claims).
- Fix the category-filter mismatch on `/blog` so every article is filterable and no chip always returns empty.
- Add tests in `src/lib/blog.test.ts` for the new category coverage.
- Verify lint + build + sitemap pick up the new slugs.

## Context
- Blog data is hardcoded in `src/lib/blog.ts` as `blogArticles[]` (currently 40 articles). No CMS.
- Listing page: `src/app/blog/page.tsx` — Server Component; category chips at lines 43-53; reads `await searchParams`.
- Detail page: `src/app/blog/[slug]/page.tsx` — `generateStaticParams()` derives routes from `getAllArticles()`, so new slugs auto-generate static routes at build.
- Tests: `src/lib/blog.test.ts` (vitest) covers pure helpers.
- Sitemap: `next-sitemap.config.js` runs postbuild; new static `/blog/*` URLs picked up automatically.
- AGENTS.md: no fabricated claims/pricing/testimonials/certifications/guarantees; build incrementally; no unnecessary dependencies.

## Verified facts (from code inspection)
- Category chips in `src/app/blog/page.tsx:43-53`: `["All","Business IT","Security","Data Protection","Guides","Quick fixes","Cloud","Communications","Network"]`.
- `Guides` and `Quick fixes` appear **only** as blog chips here. 0 articles use them as a blog `category` → those chips always return empty.
- `Backup` is used by 1 article (`high-availability-it-tampa-bay`) but missing from chips.
- `Applications` is used by 2 articles (`quickbooks-hosting-tampa-bay`, `secure-remote-access-tampa-bay`) but missing from chips.
- Removing a chip is safe: category filters are `?category=` query params on `/blog`, not separate routes.

## Category gap analysis (40 existing articles)
- Security: ~10 (well covered)
- Business IT: ~9 (well covered)
- Network: 5 (adequate)
- Data Protection: 4 (adequate)
- Communications: 3 (thin)
- Cloud: 2 (thin)
- Applications: 2 (thin)
- Backup: 1 (thin — biggest gap)

## Design Decisions (resolved)
1. **New articles:** 20 unique articles with real-sounding titles/slugs that fill category gaps. Slugs below (unique, no collisions with existing 40). Date `Nov 2026`, readTime `5 min read`, author `Nessco Tech Services`. No serviceSlug/image unless specified. Bodies are clearly-marked placeholders (`TODO: replace with real article body #N`) — real content must be supplied before publishing (AGENTS.md: no fabricated business content).

Article list (slug | title | category):
| new-article-01 | Immutable Backup Storage for Ransomware Protection | Backup |
| new-article-02 | Backup Encryption for Small Businesses | Backup |
| new-article-03 | Setting Backup Retention Policies | Backup |
| new-article-04 | Backing Up Microsoft 365 Data | Backup |
| new-article-05 | Understanding RPO and RTO for Backup Planning | Backup |
| new-article-06 | Hosted Sage and ERP Solutions for Small Business | Applications |
| new-article-07 | CRM Integration for Small Businesses | Applications |
| new-article-08 | Modernizing Legacy Line-of-Business Applications | Applications |
| new-article-09 | Choosing an ERP for Your Small Business | Applications |
| new-article-10 | Azure vs AWS for Small Business Workloads | Cloud |
| new-article-11 | Hybrid Cloud Strategy for Growing Businesses | Cloud |
| new-article-12 | Cloud Cost Optimization Best Practices | Cloud |
| new-article-13 | Disaster Recovery as a Service for Small Business | Cloud |
| new-article-14 | Unified Communications for Small Business | Communications |
| new-article-15 | Contact Center as a Service (CCaaS) Explained | Communications |
| new-article-16 | SIP Trunking Modernization for Small Business | Communications |
| new-article-17 | SD-WAN for Small Businesses | Network |
| new-article-18 | Managed Firewall Services for Small Business | Network |
| new-article-19 | HIPAA Compliance for Healthcare IT | Data Protection |
| new-article-20 | PCI DSS Compliance for Small Businesses | Data Protection |

Example object shape:
```ts
{
  slug: "new-article-01",
  title: "Immutable Backup Storage for Ransomware Protection",
  excerpt: "TODO: replace with real excerpt.",
  date: "Nov 2026",
  author: "Nessco Tech Services",
  category: "Backup",
  readTime: "5 min read",
  body: "TODO: replace with real article body 01.",
},
```
Insertion point: append to the end of `blogArticles[]`, before the closing `];` in `src/lib/blog.ts`.

2. **Category chips:** New list = `["All","Business IT","Security","Data Protection","Cloud","Communications","Network","Backup","Applications"]`. Adds `Backup`, `Applications`; removes `Guides`, `Quick fixes`.
3. **Tests:** add cases for Backup/Applications coverage + new slugs uniqueness + Guides/Quick fixes empty.
4. **No new dependencies.**

## Concrete test cases to add to `src/lib/blog.test.ts`
- `getArticlesByCategory("Backup")` returns length === 5 and every article has category `Backup`.
- `getArticlesByCategory("Applications")` returns length === 4 and every article has category `Applications`.
- `getArticlesByCategory("Cloud")` returns length === 4 and every article has category `Cloud`.
- `getArticlesByCategory("Communications")` returns length === 3 and every article has category `Communications`.
- `getArticlesByCategory("Guides")` returns `[]` (chip removed).
- `getArticlesByCategory("Quick fixes")` returns `[]` (chip removed).
- All 20 new slugs are retrievable via `getArticle(...)` and are unique.
- `getRelatedArticles` for each new article excludes itself and returns same-category articles.

## Affected Files
- `src/lib/blog.ts` — add 20 new articles to `blogArticles[]`.
- `src/app/blog/page.tsx` — replace category chips array (lines 43-53).
- `src/lib/blog.test.ts` — add test cases above.

## Task List
1. Insert 20 new article objects into `blogArticles[]` in `src/lib/blog.ts` (slugs/titles/categories from table above, TODO-marked bodies, date `Nov 2026`, readTime `5 min read`).
2. Replace category chips array in `src/app/blog/page.tsx` lines 43-53 with new list above.
3. Add test cases to `src/lib/blog.test.ts` per concrete assertions above.
4. Run `npm run lint` — must pass (no new errors from changed files).
5. Run `npm run build` — must succeed (verifies `generateStaticParams` + no duplicate slugs).
6. Verify sitemap includes each new `/blog/<slug>` (next-sitemap postbuild).
7. Spot-check: `/blog?category=Backup` shows 5 articles; `/blog?category=Applications` shows 4; `/blog?category=Guides` shows empty-state message.

## Validation
- `npm run lint` passes with no errors in changed files
- `npm run build` succeeds (production build; no duplicate slug in `generateStaticParams`)
- All 20 new article slugs retrievable via `getArticle`; all unique
- Category filter includes `Backup` and `Applications`; `Guides`/`Quick fixes` removed from chips
- New tests pass
- No fabricated pricing, customer counts, or testimonials in article content

## Rollback
- Remove the new article(s) from `src/lib/blog.ts`; revert `src/app/blog/page.tsx` chips; revert test additions

## Open decision (user input required — cannot be invented per AGENTS.md)
- Article bodies/excerpts are clearly-marked `TODO` placeholders. Real content must be supplied before publishing — I cannot invent business content per AGENTS.md. Recommendation: proceed with placeholder bodies so implementation can start; swap in real content per article before/during implementation. Confirm, or supply real content for each article now.

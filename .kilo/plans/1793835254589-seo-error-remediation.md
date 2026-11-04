# SEO Error Remediation & Quality Improvement Plan

**Project:** msp-website — nesscotech.com  
**Plan file:** `.kilo/plans/1793835254589-seo-error-remediation.md`  
**Status:** Ready for implementation after baseline collection  
**Execution mode:** Controlled implementation with validation checkpoints

---

# 1. Mission

Resolve the identified SEO problems across the website while protecting existing search visibility, indexed URLs, backlinks, canonical relationships, and working functionality.

Primary objectives:

1. Resolve all confirmed technical SEO errors.
2. Replace all 52 placeholder glossary entries with legitimate, useful IT content.
3. Eliminate inappropriate URLs from XML sitemaps.
4. Verify GA4 configuration and event delivery.
5. Identify and correct additional technical SEO problems discovered during implementation.
6. Improve crawlability, indexability, internal linking, and content quality.
7. Validate results against Google Search Console, Bing Webmaster Tools, and an independent website crawl.

**Important:** Zero errors in a crawler is not the ultimate objective. Search visibility, index quality, and preservation of existing organic traffic take precedence.

# 2. Existing SEO Work — Do Not Duplicate

The existing plan at:

`.kilo/plans/1793365291000-seo-audit-remediation-plan.md`

Already covers:

- Sitemap quality and accurate lastmod values.
- City pages audit and preservation of legitimate location pages.
- www/non-www consolidation.
- Removal of unsupported trust claims.
- NAP consistency.
- Open Graph consistency.
- Keyword cannibalization.
- About page E-E-A-T improvements.

Do not repeat these tasks unless new evidence demonstrates that an existing implementation is incomplete or incorrect.

Before making changes, read the existing plan and inspect the current implementation.

# 3. Mandatory Pre-Implementation Baseline

**Do not begin modifying source files until this phase is complete.**

## 3.1 Collect the original error report

Obtain the actual source of the reported 46 SEO errors across 44 pages.

Identify:

- Which crawler or platform generated the report.
- Exact error descriptions.
- Every affected URL.
- Severity and category.
- Whether errors are duplicated across URLs.
- Whether any reported issue is already covered by the existing SEO remediation plan.

Create:

`.kilo/reports/seo-baseline.md`

Include an error inventory:

| Field | Description |
|---|---|
| Error ID | Unique identifier |
| Error type | Exact reported issue |
| URL | Affected page |
| Severity | Critical, high, medium, low |
| Root cause | Verified technical cause |
| Existing coverage | Whether another plan addresses it |
| Resolution | Proposed fix |
| Validation | Required proof of correction |

Do not assume that source-code observations account for all 46 reported errors.

## 3.2 Capture baseline measurements

Record:

- Indexed URLs in Google Search Console.
- Indexed URLs in Bing Webmaster Tools.
- Submitted sitemap URLs.
- Excluded URLs.
- Discovered but not indexed URLs.
- Crawled but not indexed URLs.
- Existing organic clicks and impressions.
- Existing organic landing pages.
- Existing GA4 measurement configuration.
- Current production HTTP responses.
- Current crawl errors.

Save the results in the baseline report.

## 3.3 Establish source control protection

Before modifications:

- Verify Git working tree status.
- Preserve unrelated user changes.
- Create a dedicated remediation branch or checkpoint commit.
- Record the current commit hash.
- Do not overwrite unrelated changes.

# 4. Glossary Remediation — 52 Placeholder Entries

**Affected file:** `src/lib/glossary.ts`

**Affected entries:** `term-064` through `term-115`.

## 4.1 Objective

Replace all 52 placeholder entries with legitimate IT terminology and original, accurate explanations.

Do not remove the entries simply to reduce the number of pages.

Do not fabricate technical facts, certifications, customer experiences, testimonials, reviews, or business capabilities.

Research established terminology using authoritative technical documentation.

Preferred reference sources include:

- Microsoft Learn.
- CISA.
- NIST.
- Cisco documentation.
- Cloudflare documentation.
- AWS documentation.
- Official networking and security standards.

## 4.2 Content requirements

Each entry must contain:

| Field | Requirement |
|---|---|
| term | Recognized IT terminology |
| slug | Stable, descriptive URL slug |
| plain | Original plain-English explanation |
| whyItMatters | Practical small-business relevance |
| category | Valid GlossaryCategory |
| tags | Relevant search and topic associations |
| relatedService | Relevant existing service, when appropriate |
| relatedTerms | Existing valid glossary references |
| popularity | Reasonable relative ranking |

Use only valid categories:

- Security
- Networking
- Backup
- Microsoft 365
- Hardware
- General
- Cloud
- Support

## 4.3 Additional content quality requirements

Each glossary page should answer the following where relevant:

1. What is the technology or concept?
2. How does it work?
3. Why does it matter to a small business?
4. What common problems or misconceptions exist?
5. What related technologies should the reader understand?
6. When might professional IT assistance be appropriate?

Include realistic technical examples when they improve understanding.

Do not artificially inflate article length.

Do not repeat the same definition structure with substituted terminology.

Do not keyword-stuff city names or service keywords into glossary definitions.

## 4.4 Internal linking

Connect glossary entries to relevant existing website resources.

Examples:

- Microsoft 365 terms → Microsoft 365 services.
- Network terminology → Network management services.
- Security terminology → Cybersecurity services.
- Backup terminology → Backup and disaster recovery.
- Hardware terminology → IT support.

Requirements:

- Links must resolve to real existing pages.
- Links must be contextually relevant.
- Avoid excessive links.
- Avoid linking every glossary entry to every service.
- Prevent circular or irrelevant linking patterns.

## 4.5 Glossary indexing strategy

Do not automatically assume that all 115 entries deserve indexing.

Classify entries:

**Group A — Index**

Unique, useful content with meaningful independent search intent.

**Group B — Improve before indexing**

Useful terminology that needs additional explanation, differentiation, or internal linking.

**Group C — Consolidate or reconsider**

Terms with little standalone search value or substantial overlap with another glossary entry.

Preserve existing URLs whenever possible.

Do not introduce mass redirects or delete entries without explicit justification.

For every non-indexed entry, document the reasoning and the implementation method.

Do not apply noindex to an entire glossary section.

## 4.6 Validation

Create automated checks confirming:

- Exactly 115 intended glossary entries remain.
- No term starts with "IT Term".
- No placeholder definitions remain.
- No duplicate definitions.
- No duplicate whyItMatters content.
- All categories belong to the approved union.
- All relatedTerms references resolve.
- All slugs are unique.
- All relatedService references resolve.
- No unintended URL changes occurred.

# 5. Sitemap Remediation

**Affected files:**

- `next-sitemap.config.js`
- Generated sitemap XML files.
- Sitemap source configuration where applicable.

## 5.1 Investigate questionable URLs

| URL | Initial decision |
|---|---|
| /apple-icon | Exclude |
| /icon.svg | Exclude |
| /opengraph-image | Exclude |
| /maintenance | Inspect |
| /network-visualization | Inspect |

Before exclusion, inspect:

- HTTP status.
- Content-Type.
- Whether the URL serves HTML.
- Canonical URL.
- Robots directives.
- Whether the page is intended for organic search.
- Whether it provides useful indexable content.

Do not exclude valid HTML pages simply because they are unusual application routes.

Verified as HTML pages (keep in sitemap): `/maintenance`, `/network-visualization`.  
Verified as non-HTML (exclude): `/apple-icon` (image/png route), `/opengraph-image` (image/png route), `/icon.svg` (not found as route or static file).

## 5.2 Sitemap requirements

Ensure:

- Only intended canonical indexable pages appear.
- Non-HTML assets are excluded.
- Redirecting URLs are excluded.
- No 404 or soft-404 URLs are included.
- No noindex pages are included.
- No duplicate URLs exist.
- All URLs use the preferred hostname.
- All URLs use HTTPS.
- lastmod reflects actual meaningful content changes.
- Location pages are preserved according to the existing location audit.
- Sitemap references are valid.

Never manually edit generated sitemap XML as the permanent solution.

Correct the source configuration and regenerate the files.

## 5.3 Sitemap validation

Parse every generated XML sitemap.

Check:

- Valid XML structure.
- Valid URL format.
- Unique URL entries.
- Correct canonical hostname.
- Appropriate response codes.
- No excluded assets.
- No unexpected redirects.
- Correct sitemap index references.

# 6. GA4 Verification and Remediation

**Affected files:**

- `.env.production`
- `src/app/layout.tsx`

Current configured measurement ID:

`G-Q4XQPV4FH7`

## 6.1 Verify the actual property

Do not determine GA4 validity solely by checking whether gtag.js returns HTTP 200 or 404.

Verify:

1. Measurement ID exists in the intended Google Analytics property.
2. Production environment contains the correct ID.
3. Website loads the correct Google tag.
4. Browser Network tab shows successful GA4 collection requests.
5. GA4 Realtime or DebugView receives test events.
6. Page views are not duplicated.
7. Consent behavior does not unintentionally block legitimate measurement.
8. No conflicting or duplicate analytics installation exists.

## 6.2 Remediation rules

If the ID is valid, retain it.

If the ID is incorrect or belongs to an inaccessible or nonexistent property:

- Do not guess another ID.
- Remove the invalid configuration only after confirming the issue.
- Document the change.
- Ensure the application builds without analytics configuration.

Never expose private credentials or environment secrets in logs or reports.

# 7. Additional Technical SEO Audit

Inspect the website for the following issues, including those not explicitly listed in the original 46 errors.

## 7.1 Metadata

Check:

- Missing title tags.
- Duplicate title tags.
- Empty titles.
- Missing meta descriptions.
- Duplicate meta descriptions.
- Incorrect canonical URLs.
- Invalid robots directives.
- Missing or malformed viewport metadata.
- Incorrect language declarations.

Do not rewrite metadata that already works without evidence of a problem.

## 7.2 Page structure

Check:

- Missing H1.
- Duplicate or conflicting primary headings.
- Broken heading hierarchy.
- Empty page content.
- Duplicate page content.
- Thin or automatically generated pages.
- Incorrect breadcrumb structure.

Do not impose arbitrary heading-count rules that damage legitimate page structure.

## 7.3 Crawlability and indexability

Check:

- Accidental noindex directives.
- Robots.txt restrictions.
- Incorrect canonical relationships.
- Redirect chains.
- Redirect loops.
- Broken internal links.
- Broken external links.
- 404 errors.
- Soft 404s.
- Orphan pages.
- Unexpected HTTP errors.

Preserve legitimate indexed URLs.

## 7.4 Structured data

Inspect existing JSON-LD implementation in:

`src/lib/schemas.ts`

Validate relevant schemas:

- Organization.
- LocalBusiness.
- Service.
- BreadcrumbList.
- FAQPage, where eligible.

Requirements:

- Match visible page content.
- Use accurate business information.
- Do not fabricate reviews or aggregate ratings.
- Do not claim unsupported certifications.
- Avoid conflicting duplicate entities.
- Validate using Google's Rich Results Test and Schema Markup Validator where applicable.

Do not add structured data merely to increase schema count.

## 7.5 Images and accessibility

Check:

- Missing meaningful alt text.
- Broken image resources.
- Oversized images.
- Missing image dimensions where appropriate.
- Incorrect image formats.
- Images with unnecessarily duplicated alt text.

Decorative images should have appropriate empty alt attributes.

## 7.6 Performance and mobile

Inspect:

- Largest Contentful Paint.
- Interaction to Next Paint.
- Cumulative Layout Shift.
- Mobile rendering.
- Image loading.
- JavaScript errors.
- Unnecessary blocking resources.

Record existing measurements before making performance changes.

Do not introduce major design or architecture changes as part of this remediation unless required to resolve a confirmed issue.

# 8. Robots.txt Verification

Verify:

`https://nesscotech.com/robots.txt`

Requirements:

- Returns HTTP 200.
- Has valid robots.txt syntax.
- References `https://nesscotech.com/sitemap.xml`.
- Does not block important website content.
- Does not unintentionally block search engine crawlers.
- Preserves existing deliberate bot policies unless separately approved.

Verify the production response, not just the local file.

# 9. Implementation Sequence

Execute in this order.

**Phase 1 — Baseline and investigation**

- Read both SEO plans.
- Collect original 46-error report.
- Create error inventory.
- Capture existing search and indexing metrics.
- Create source control checkpoint.

**Phase 2 — Confirmed technical fixes**

- Resolve verified sitemap issues.
- Correct confirmed canonical errors.
- Correct unintended redirect behavior.
- Correct accidental noindex and crawl restrictions.
- Fix broken internal links.

**Phase 3 — Glossary completion**

- Research all 52 terms.
- Write original explanations.
- Validate technical accuracy.
- Add appropriate internal links.
- Classify indexing eligibility.
- Run duplicate and reference validation.

**Phase 4 — Analytics**

- Verify GA4 property.
- Verify production tracking.
- Correct duplicate or invalid tracking configuration.

**Phase 5 — Additional technical audit**

- Metadata.
- Page structure.
- Structured data.
- Images.
- Mobile.
- Performance.

**Phase 6 — Sitemap regeneration**

- Update source configuration.
- Generate sitemap files.
- Validate all generated URLs.

**Phase 7 — Automated validation**

Run:

`npm run lint`

`npm run build`

Run any existing project tests.

Do not suppress errors merely to obtain a passing result.

**Phase 8 — Production verification**

Compare:

- localhost:3000
- https://nesscotech.com

Check representative URLs from every affected page category.

Confirm production behavior independently.

**Phase 9 — Search engine validation**

- Verify Google Search Console sitemap processing.
- Verify Bing Webmaster Tools sitemap processing.
- Inspect representative URLs.
- Submit updated sitemap where appropriate.
- Monitor indexing changes.
- Record remaining errors and exclusions.

# 10. Acceptance Criteria

Implementation is complete only when the following are satisfied.

## Code quality

- [ ] npm run lint passes.
- [ ] npm run build succeeds.
- [ ] Existing automated tests pass.
- [ ] No unrelated files are modified.
- [ ] No credentials are exposed.

## Glossary

- [ ] All 52 placeholders are replaced.
- [ ] All 115 intended entries remain.
- [ ] No generic placeholder terminology remains.
- [ ] Definitions are technically accurate.
- [ ] No duplicate boilerplate remains.
- [ ] Internal links resolve.
- [ ] Slugs remain stable unless a change is justified.
- [ ] Indexing decisions are documented.

## Sitemap

- [ ] Non-page assets are excluded.
- [ ] All intended indexable pages are included.
- [ ] No broken URLs are included.
- [ ] Canonical host is consistent.
- [ ] XML validates.
- [ ] Robots.txt references the sitemap.

## Analytics

- [ ] GA4 property verified.
- [ ] Production measurement ID verified.
- [ ] Collection requests work.
- [ ] Test events arrive in GA4.
- [ ] Duplicate tracking is ruled out.

## Technical SEO

- [ ] Original 46 errors individually rechecked.
- [ ] Additional discovered issues documented.
- [ ] Canonical behavior validated.
- [ ] Redirect behavior validated.
- [ ] Robots and noindex behavior validated.
- [ ] Structured data checked.
- [ ] Internal links checked.

## Production

- [ ] Production website loads correctly.
- [ ] Representative pages return expected responses.
- [ ] No unexpected regressions.
- [ ] Google sitemap submission verified.
- [ ] Bing sitemap submission verified.
- [ ] Before-and-after report generated.

# 11. Reporting Requirements

Create:

`.kilo/reports/seo-remediation-results.md`

Include:

1. Original 46-error inventory.
2. Errors resolved.
3. Errors remaining.
4. New problems discovered.
5. Files modified.
6. Glossary terms added.
7. Sitemap changes.
8. GA4 verification results.
9. Lint results.
10. Build results.
11. Production validation.
12. Google Search Console status.
13. Bing Webmaster Tools status.
14. Remaining recommendations.

Distinguish between:

- Fixed and locally verified.
- Fixed and production verified.
- Submitted to search engines.
- Confirmed indexed.
- Pending search engine recrawl.

Do not claim an error is resolved merely because source code was changed.

Do not claim a URL is indexed merely because it appears in a sitemap.

# 12. Rollback and Safety

- Preserve existing Git changes.
- Use a dedicated branch or checkpoint.
- Avoid blanket redirects.
- Preserve existing working URLs.
- Never delete existing location pages without documented justification.
- Never overwrite unrelated SEO improvements.
- Revert only changes responsible for confirmed regressions.
- Preserve valid GA4 configuration.
- Preserve working production functionality.

# 13. Final Implementation Directive

This is a controlled SEO remediation project, not an opportunity for an unrestricted website rewrite.

The implementation agent must:

- Inspect before modifying.
- Verify before deciding.
- Research before publishing.
- Preserve before redirecting.
- Test before deploying.
- Measure before claiming success.

**Primary success metric:** All confirmed technical errors are resolved without damaging existing search visibility, while the website's content quality, crawlability, indexability, and analytics reliability improve.

**Secondary success metric:** Improved organic search performance over subsequent 30-, 60-, and 90-day measurement periods.

Do not sacrifice existing rankings simply to achieve a zero-error crawler report.

# 14. Open Questions

1. **Original error report** — The source of the 46 errors / 44 pages has not been obtained. The implementation agent must collect this during Phase 1 before modifying source files. Without the exact error types, fixes may not address the reported problems.

2. **Glossary content authority** — All 52 placeholder terms need real definitions. The plan directs research from authoritative sources (Microsoft Learn, CISA, NIST, etc.). The implementation agent should proceed with this research rather than inventing content.

---

**Note:** Plan mode only — no source files modified. An implementation-capable agent should execute the tasks above.
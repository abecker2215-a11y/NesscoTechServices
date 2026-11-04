# Plan: Add Automated Tests (vitest + React Testing Library)

## Goal
Add automated test infrastructure (vitest + RTL) with unit tests for pure functions in `src/lib/` and component tests for UI components. Required by Phase 1 scope ("Basic automated tests").

## Context
- No test files exist, no test framework configured, no `test` script in `package.json`
- Pure functions ideal for unit testing:
  - `src/lib/meta.ts`: `pageTitle`, `metaDescription`
  - `src/lib/utils.ts`: `cn`, `formatPhone`
  - `src/lib/dates.ts`: `daysAgo`
  - `src/lib/validation.ts`: Zod schemas (`contactSchema`, `helpRequestSchema`, etc.)
  - `src/lib/help-workflow.ts`: `getCategoryQuestions`, `getCategoryLabel`, `isEmergencyRequest`
  - `src/lib/blog.ts`: `getArticlesByCategory`, `searchArticles`, `getRelatedArticles`, `getRecentArticles`, `groupArticlesByDate`
- Next.js 16 canary, React 19, TypeScript
- AGENTS.md: no unnecessary dependencies; vitest + RTL + jsdom is the standard lightweight stack

## Design Decisions
1. **Framework: vitest** — fast, Vite-native, works with TS/ESM, minimal config
2. **DOM testing: @testing-library/react + @testing-library/jest-dom + jsdom** — standard for React component tests
3. **Test location: `src/lib/**/*.test.ts`** — co-located with source (Next.js convention)
4. **Test script: `npm run test`** — runs vitest in watch off mode
5. **No new runtime dependencies** — vitest/RTL/jsdom are devDependencies only
6. **Focus on pure functions first** — highest confidence, no DOM needed; add a few component tests for critical UI (FAQAccordion, Button)
7. **AGENTS.md compliance**: no fabricated test data that looks like real customer info; use clearly dummy data

## Affected Files
- `package.json` — add devDependencies, add `test` script
- `vitest.config.ts` — NEW — vitest config with jsdom environment
- `src/lib/meta.test.ts` — NEW — pageTitle, metaDescription tests
- `src/lib/utils.test.ts` — NEW — cn, formatPhone tests
- `src/lib/dates.test.ts` — NEW — daysAgo tests
- `src/lib/validation.test.ts` — NEW — Zod schema valid/invalid tests
- `src/lib/help-workflow.test.ts` — NEW — getCategoryQuestions, getCategoryLabel, isEmergencyRequest tests
- `src/lib/blog.test.ts` — NEW — blog helper function tests
- `src/components/ui/FAQAccordion.test.tsx` — NEW — component test (RTL)

## Task List
1. Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom as devDependencies
2. Create `vitest.config.ts`
3. Add `"test": "vitest run"` script to `package.json`
4. Write `src/lib/meta.test.ts`
5. Write `src/lib/utils.test.ts`
6. Write `src/lib/dates.test.ts`
7. Write `src/lib/validation.test.ts`
8. Write `src/lib/help-workflow.test.ts`
9. Write `src/lib/blog.test.ts`
10. Write `src/components/ui/FAQAccordion.test.tsx`
11. Run `npm run lint` — must pass
12. Run `npm run test` — all tests pass
13. Run `npm run build` — must succeed (ensure no breakage)

## Validation
- `npm run lint` passes with no errors
- `npm run test` passes all test files
- `npm run build` succeeds (production build)
- Test coverage includes: title suffix logic, description clamping, phone formatting, schema valid/invalid inputs, category lookup, emergency detection, blog filtering/search/related/recent/grouping

## Rollback
- Remove devDependencies, test script, vitest.config.ts, and all `*.test.*` files
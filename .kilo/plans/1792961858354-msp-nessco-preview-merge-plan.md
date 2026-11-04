# Plan: Merge nessco-preview-with-banner.html Design into MSP Website

## Context
- Source design preview: `tmp/nessco-preview-with-banner.html` and OneDrive copy at `C:\Users\AnthonyBecker\OneDrive - Nessco Tech Services\Desktop\Nessco Tech Services\nessco-preview-with-banner.html`
- Target repo: `D:\PROJECTS\msp-website` Next.js 16 App Router + Tailwind CSS v4 + TypeScript
- Goal: Adopt the preview's dark navy / cyan / orange / pink look and feel into the live site while preserving all existing functionality (get-help flow, pricing, testimonials, emergency triage, etc.)

## Design Tokens from Preview (to add or override)
- Navy palette: `--navy-950:#060d1f`, `--navy-900:#0a1530`, `--navy-800:#0e2250`, `--navy-700:#123378`
- Blue: `--blue-600:#1a56d6`, `--blue-500:#2b7bff`
- Cyan: `--cyan-400:#1fb6f2`, `--cyan-300:#6fd6ff`
- Orange: `--orange:#f59a5b`; Pink: `--pink:#e98ba8`
- Text: `--text:#c9d6f2`; Muted: `--muted:#8da2cc`
- Body: dark background `--navy-950`, light body text, system font stack
- Header: navy bg, border-bottom navy-700, logo text + cyan "TECH SERVICES", horizontal nav, gradient "Emergency help" pill
- Hero: full-width banner image with bottom gradient fade to page bg, centered copy, primary gradient button (blue->cyan with glow), secondary outline-cyan button
- Stats: 4 cards auto-fit grid, value bold white 22px + muted label 13px, card gradient navy-800->navy-900, radius 12px, border navy-700

## Existing Site State (relevant)
- Design system: Tailwind v4 CSS vars in `src/app/globals.css` (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--ring`, etc.) dark theme via `:root[data-theme="dark"]` and `prefers-color-scheme`
- Primary color currently teal/sky `--primary: #0ea5e9`; body bg `--background: #0b1020` (dark)
- Header: fixed top, transparent->solid on scroll, nav with mega menu, search, theme toggle, Get Help button, EmergencyTriageWidget inline
- Homepage hero: two-column copy + HeroVisual card (support queue), Get Help / Request a Quote buttons, HeroQuizClient, testimonial, stats bar from `businessStats`, trust badges, OpenStatus line
- Stats live counters in `src/components/ui/TrustSignalsClient.tsx` and `src/lib/testimonials.ts` `businessStats`
- Footer, global styles, animations (reveal, lift-hover, hero-glow, hero-grid-bg) exist

## Implementation Plan (ordered, homepage-first)

### 1 Design Tokens
- Add navy/cyan/blue/orange/pink token layer to `src/app/globals.css` as new CSS vars
- Map preview tokens to Tailwind v4 theme if safe; otherwise extend via utility classes; preserve existing light/dark theme overrides so internal pages do not break
- Scope: homepage-first adoption of dark identity — apply preview navy/cyan palette only within homepage hero/stats/footer sections; keep other pages unchanged

### 2 Global Base
- Set body background `--navy-950` and default text color to preview `--text` for preview dark identity **only on homepage** sections styled with the navy theme; keep other pages on existing light/teal design (no global token swap)

### 3 Header
- Restyle `src/components/layout/Header.tsx` to preview header: solid navy background, logo mark + "NESSCO" + cyan "TECH SERVICES", nav links, gradient "Emergency help" pill on right
- Keep mega menu, search, mobile nav, theme toggle intact (behavior preserved, visual updated)

### 4 Hero
- Replace homepage hero (`src/app/page.tsx`) with banner image hero: full-width image + bottom gradient fade `linear-gradient(180deg, transparent, navy-950)`, centered hero copy
- Primary gradient button (blue->cyan with glow shadow), secondary outline-cyan button
- Keep quiz, testimonial, stats, trust badges below as existing sections
- **Banner image**: copy the inline base64 PNG from the preview file into `public/hero-banner.png` (base64-decoded). Rationale: guarantees the exact visual match requested ("look and feel like this") with lowest-effort; risks small initial-bundle size increase (~30–60 KB gzipped); acceptable homepage-only trade-off

### 5 Stats
- Adopt preview stat cards (2 hrs response, $75 remote, 56 cities, 4.9 Star Google) using card style: gradient navy-800->navy-900, border navy-700, radius 12, value 22px white, label muted 13px
- **City-count consideration**: the reference preview states "56 cities across Tampa Bay" but the site's `lib/locations.ts` enumerates only ~33 Tampa Bay municipalities. The "56 cities" figure mirrors the external marketing reference you provided; the internal enumeration is a subset of the broader market and does not contradict the claim (it is non-exhaustive). Keep **56 cities** consistent with the reference design; if the user prefers site-exact data, substitute the enumerated count later. Decision: keep 56 cities per the preview
- Decide: reuse LiveStatsClient/businessStats or add preview-specific stats; prefer preview values/labels but keep live counters where data exists (homepage-hero area uses preview cards)

### 6 Emergency CTA
- Style gradient orange->pink pill consistent with preview, wire to `/emergency` (keep EmergencyTriageWidget behavior)

### 7 Mobile
- Ensure header stacks, buttons full-width, stats grid auto-fit minmax(150px,1fr) on mobile

### 8 Accessibility
- Keep semantic HTML, focus-visible rings, reduced-motion, aria labels, contrast (muted `#8da2cc` must pass; verify against navy bg)

### 9 Validation
- `npm run lint` passes
- `npm run build` passes
- Visual check homepage hero/stats/header via dev server/build output

## Risks / Constraints
- Global token swap could break light theme and internal pages. Homepage-first approach mitigates.
- Preview banner is inline base64 PNG placeholder.
- Next.js 16 canary breaking changes — check `node_modules/next/dist/docs/` before code changes (per AGENTS.md).
- No inventing business claims; stat values mirror FAQ/committed pricing and the external reference preview. The internal `lib/locations.ts` enumeration (~33 named municipalities) is a non-exhaustive subset of Tampa Bay, so "56 cities" per the external reference does not contradict existing data; keep per user request. $75/$125 rates already committed.

## Validation Plan
- `npm run lint` passes
- `npm run build` passes
- Homepage hero/stats/header visual regression check — no existing functionality broken
- Homepage sections regression checklist: services grid, remote vs onsite comparison, why-choose-us, business IT plans, testimonials, pricing cards, FAQ accordion, final CTA — all render and function identically

## Decisions (defaults)
1. Homepage-first adoption of preview dark identity (global token swap deferred to later phases).
2. Use preview static stats cards on homepage hero area; retain LiveStats elsewhere.
3. Replace homepage hero with banner-image style; keep HeroVisual for other sections.
4. Stat cards use preview values exactly: 2 hrs / $75 / 56 cities / 4.9★ — these mirror FAQ/committed pricing and the external reference; internal enumeration discrepancy noted.
5. Banner image: decode and deploy base64 PNG from preview as `public/hero-banner.png` for visual fidelity.

## Next Steps
1. Read Next.js docs in `node_modules/next/dist/docs/` for breaking changes affecting components.
2. Implement tokens + global base.
3. Restyle Header.
4. Replace homepage hero + stats.
5. Wire emergency CTA gradient.
6. Lint + build + report.

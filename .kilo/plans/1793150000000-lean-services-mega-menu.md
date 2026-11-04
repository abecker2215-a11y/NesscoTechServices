# Plan: Lean Services Mega Menu

**Goal:** Reduce clutter in the Services mega menu (Header.tsx) from 8 groups / 56 links + 8 category overviews + featured card down to ~6 categories / ~12-18 links, while keeping every service reachable via `/services` and category overview pages.

**Decisions (confirmed with user):**
1. **Lean structure (Option A):** 6 kept categories, 2-3 featured services each, plus one category-overview link per category and one featured card. Target ~20 links total.
2. **Keep 6 categories:** Managed IT, IT Security, Cloud Solutions, Network & Server, IT Support, Backup & Disaster Recovery.
3. **Drop from mega menu:** Applications and Communications categories (and all their children) — they remain on `/services` and `/services/category/applications` / `/services/category/communications`.
4. **Featured card stays:** "Managed IT Services" remains the featured card.
5. **"More" section removed:** No catch-all extras column.
6. **Mobile nav mirrors desktop:** `MobileDropdown` trimmed to the same 6 categories and featured children.
7. **Footer CTA kept:** "Not sure what you need?" + "View all services" link retained.

**Files affected:**
- `src/components/layout/Header.tsx` — rewrite `DropdownMenu` groups/children filtering, featured card, mobile mirror; remove "More" column; keep animations optional/simplified.
- `src/lib/config.ts` — trim `navItems[0]` (Services) `children` to the kept set; mark dropped children so they no longer render in the mega menu (keep them defined so nothing else breaks).

**Kept category -> featured children (config.ts):**

| Category (group id) | Category page | Featured children |
|---|---|---|
| managed | /services/category/managed-it-services | Managed IT Services (featured card), Co-Managed IT, 24/7 Monitoring |
| security | /services/category/it-security | IT Security & Cybersecurity, Managed Endpoint Security, Security Audits & Compliance |
| cloud | /services/category/cloud-solutions | Cloud Solutions, Microsoft 365 for Business |
| network | /services/category/network-server | Network & Server Infrastructure, Wireless Design & Implementation |
| support | /services/category/it-support | IT Support & Helpdesk, PC & Mac Support |
| backup | /services/category/backup-disaster-recovery | Backup & Disaster Recovery, Disaster Recovery Planning |

Dropped from mega menu (still on /services): Applications (m365-management, quickbooks-hosting, hosting, migrations, remote-access) and Communications (phone-systems, business-email, messaging, meetings).

**Implementation tasks:**
1. Edit `src/lib/config.ts`: reduce Services `children` to the kept featured set; keep all NavChild definitions (dropped ones remain valid data, just not rendered in mega menu). Keep `groups` array at 6 (drop apps/comm groups) — verify `categoryPageMap` in Header.tsx still matches kept groups.
2. Edit `src/components/layout/Header.tsx`:
   - `DropdownMenu`: build groups only from kept group ids; render category-overview link + kept children per group; render featured card for Managed IT Services; drop the `extras`/"More" column.
   - `MobileDropdown`: mirror same 6 groups + featured children; drop apps/comm.
   - Keep `max-h-[70vh]` scroll guard (now unnecessary but harmless) — may remove.
   - Keep `animate-mega-item-in` / delays (optional to simplify given fewer items).
3. Verify `src/app/services/page.tsx` still renders all services unchanged (no edit needed — it's the escape hatch for dropped links).
4. Run typecheck/lint/build: `npx tsc --noEmit` (or project typecheck script), `npm run lint`, `npm run build`.
5. Manual QA: open `http://localhost:9000`, hover Services, confirm lean panel, confirm dropped links work via `/services`, confirm mobile menu mirrors desktop.

**Validation:**
- TypeScript compiles without errors.
- Production build succeeds (`npm run build`).
- Lint passes.
- Mega menu renders 6 category columns + featured card, no "More" section, panel not scroll-cluttered.
- Clicking a dropped service (e.g. QuickBooks Hosting) via `/services` still resolves to its page.

**Out of scope:**
- Redesigning the `/services` page layout.
- Changing category overview pages (`/services/category/[category]`).
- New tests (none exist for Header; not adding test infrastructure).
- Production deploy / Docker.

**Open question (minor, implementation detail):** Whether to keep the `animate-mega-item-in` stagger animations or simplify them given ~20 items. Recommendation: keep as-is to minimize risk; simplify only if they feel sluggish.

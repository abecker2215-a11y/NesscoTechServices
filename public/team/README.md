# Team + review photos

Drop files here — no code changes needed, the UI picks them up:

- `public/team/owner.jpg` (512×512) → then set `photoUrl: "/team/owner.jpg"`
  in the `team` array in `src/app/about/page.tsx`.
- `public/reviews/<name>.jpg` (256×256) → then set `photoUrl: "/reviews/<name>.jpg"`
  on that entry in `src/lib/testimonials.ts`.

Until then the site renders initials avatars — nothing breaks.

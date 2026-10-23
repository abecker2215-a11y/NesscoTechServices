export interface Testimonial {
  name: string;
  location: string;
  service: string;
  quote: string;
  rating: number;
  /** Optional headshot at /public/team or /public/reviews — renders initials when absent. */
  photoUrl?: string;
  /** e.g. "Jan 2026" — shown under the name when set. */
  date?: string;
  /** Curated fallback vs live Google pull (set automatically by /api/reviews). */
  source?: "curated" | "google";
}

// TODO: Replace with real Google Business reviews once GOOGLE_MAPS_API_KEY +
// GOOGLE_PLACE_ID are set (see env.production.example). Until then these
// curated placeholders stand in — keep 3-6 short, specific quotes that mention
// the problem, the fix, and the town. Add `photoUrl: "/reviews/sarah-m.jpg"`
// after dropping the headshot into public/reviews/.
export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    location: "Riverview",
    service: "Wi-Fi & Networking",
    quote:
      "Dead zones all over our office. They installed a mesh network in one visit and now every room is fast. Explained everything in plain English.",
    rating: 5,
    source: "curated",
  },
  {
    name: "David R.",
    location: "Tampa",
    service: "Microsoft 365",
    quote:
      "Migrated our 12-person office from GoDaddy email over a weekend. Zero downtime Monday morning. The quote was exact — no surprises.",
    rating: 5,
    source: "curated",
  },
  {
    name: "Lisa K.",
    location: "Clearwater",
    service: "Remote Support",
    quote:
      "My Outlook stopped syncing before a big deadline. Fixed remotely in 40 minutes while I watched. $75 and I was back to work.",
    rating: 5,
    source: "curated",
  },
];

export interface BusinessStat {
  value: string;
  label: string;
}

export const businessStats: BusinessStat[] = [
  { value: "2 hrs", label: "Typical response, Mon–Fri 8am–6pm" },
  { value: "$75", label: "Starting rate for remote fixes" },
  { value: "56 cities", label: "Served across Tampa Bay + remote anywhere" },
  { value: "No fix, no fee", label: "On remote work we can't resolve" },
];

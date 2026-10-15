export interface MiniGuide {
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  /** "Beginner" | "Intermediate" — auto-derived from readMinutes if missing. */
  difficulty?: "Beginner" | "Intermediate";
  /** ISO date string for freshness line, e.g. "2026-10-01". */
  updated?: string;
  /** Optional YouTube/Loom embed URL. */
  videoUrl?: string;
  /** Category for the get-help flow (matches helpCategories in help-workflow.ts). */
  helpCategory: string;
  /** Human label for the help category (used in UI). */
  helpCategoryLabel: string;
  /** Service slug this guide supports (for cross-links and deep-linking). */
  serviceSlug: string;
  /** Human service label (for UI). */
  serviceLabel: string;
  /** 3-5 symptoms for the "Which guide do I need?" finder. */
  symptoms: string[];
  /** Step-by-step instructions. */
  steps: { heading: string; body: string }[];
  /** When to call us instead — honest upsell lines. */
  whenToCall: string[];
  /** FAQ pairs. */
  faqs: { q: string; a: string }[];
}

import type { Guide } from "./guides";

/** Convert a data-file entry into a full Guide. Type-checked at build time. */
export function toGuide(m: MiniGuide): Guide {
  return {
    slug: m.slug,
    title: m.title,
    excerpt: m.excerpt,
    readMinutes: m.readMinutes,
    updated: m.updated,
    videoUrl: m.videoUrl,
    serviceSlug: m.serviceSlug,
    serviceLabel: m.serviceLabel,
    helpCategory: m.helpCategory,
    helpCategoryLabel: m.helpCategoryLabel,
    steps: m.steps,
    whenToCall: m.whenToCall,
    faqs: m.faqs,
  };
}
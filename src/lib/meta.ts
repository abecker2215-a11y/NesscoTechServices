import { siteConfig } from "./config";

const SITE_SUFFIX = ` | ${siteConfig.name}`;

const TITLE_MAX = 69; // stay under search engines' ~70-character title display limit
const SHORT_DESC_PAD = ` ${siteConfig.name} provides managed IT, cybersecurity, cloud, network, and backup services for small businesses across Tampa Bay — proactive support without long-term contracts or jargon.`;

/**
 * Build a page title following the project SEO convention:
 * dynamic titles drop the ` | Nessco Tech Services` suffix when the base
 * title exceeds 40 characters, to stay under Google's ~600px limit.
 */
export function pageTitle(base: string): string {
  if (base.length > TITLE_MAX) return clampTitle(base, TITLE_MAX);
  return base.length > 40 ? base : `${base}${SITE_SUFFIX}`;
}

function clampTitle(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max - 1);
  return cut > 0 ? `${text.slice(0, cut)}…` : `${text.slice(0, max - 1)}…`;
}

/**
 * Clamp a meta description to stay under Google's snippet (~160 chars) while
 * guaranteeing a minimum length (~150) so short excerpts don't get flagged as
 * too thin by search engines.
 */
export function metaDescription(text: string, max = 160): string {
  const min = 150;
  if (text.length === 0) return text;
  if (text.length > max) return clamp(text, max);
  if (text.length < min) return clampMin(text + SHORT_DESC_PAD, max, min);
  return text;
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max - 1);
  return cut > 0 ? `${text.slice(0, cut)}…` : `${text.slice(0, max - 1)}…`;
}

/**
 * Clamp to `max` but never return below `min` when `max >= min`. The plain
 * word-boundary clamp can land a few characters under the target (e.g. 146)
 * when the next word straddles the limit; in that case take the full width so
 * padded descriptions stay inside the 150–160 range search engines expect.
 */
function clampMin(text: string, max: number, min: number): string {
  const clamped = clamp(text, max);
  if (max < min) return clamped;
  if (clamped.length >= min) return clamped;
  return `${text.slice(0, max - 1)}…`;
}

import { siteConfig } from "./config";

const SITE_SUFFIX = ` | ${siteConfig.name}`;

/**
 * Build a page title following the project SEO convention:
 * dynamic titles drop the ` | Nessco Tech Services` suffix when the base
 * title exceeds 40 characters, to stay under Google's ~600px limit.
 */
export function pageTitle(base: string): string {
  return base.length > 40 ? base : `${base}${SITE_SUFFIX}`;
}

/**
 * Clamp a meta description to stay under ~155 characters (Google snippet).
 */
export function metaDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max - 1);
  return cut > 0 ? `${text.slice(0, cut)}…` : `${text.slice(0, max - 1)}…`;
}

const WORDS_PER_MINUTE = 200;

/**
 * Count the words a reader actually reads: strip fenced code, inline code
 * markers, link/image targets and heading markers, then count what is left.
 */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[*_>]/g, " ")
    .trim();

  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Reading time in whole minutes, rounded up, with a floor of one minute.
 * Derived from the body so it can never drift from the content.
 */
export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
}

/** Display label, e.g. "2 min read". */
export function readTimeLabel(markdown: string): string {
  return `${readingMinutes(markdown)} min read`;
}
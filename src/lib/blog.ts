export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  body: string;
  image?: string;
  serviceSlug?: string;
}

const MONTH_INDEX: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Convert a display date such as "Nov 2026" into an ISO 8601 date
 * (2026-11-01) for structured data and Open Graph. Google requires ISO 8601
 * for datePublished/dateModified; unparseable input is returned unchanged.
 */
export function isoDate(date: string): string {
  const match = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(date.trim());
  if (!match) return date;
  const month = MONTH_INDEX[match[1].slice(0, 3).toLowerCase()];
  if (!month) return date;
  return `${match[2]}-${String(month).padStart(2, "0")}-01`;
}

export function searchArticles(articles: BlogArticle[], query: string): BlogArticle[] {
  if (!query.trim()) return articles;
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q)
  );
}

/**
 * Pick related posts from the same category, spread across the list rather
 * than always taking the newest few. Taking the head of the list every time
 * leaves older posts with no inbound links from their peers.
 */
export function getRelatedArticles(
  article: BlogArticle,
  all: BlogArticle[],
  limit = 3
): BlogArticle[] {
  const pool = all.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  );
  if (pool.length <= limit) return pool;
  const step = pool.length / limit;
  const picked: BlogArticle[] = [];
  for (let i = 0; i < limit; i++) {
    const item = pool[Math.floor(i * step)];
    if (item && !picked.includes(item)) picked.push(item);
  }
  return picked;
}

export function getRecentArticles(all: BlogArticle[], limit = 5): BlogArticle[] {
  return [...all]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function groupArticlesByDate(articles: BlogArticle[]): Array<{
  date: string;
  articles: BlogArticle[];
}> {
  const groups = new Map<string, BlogArticle[]>();
  for (const article of articles) {
    const existing = groups.get(article.date) ?? [];
    groups.set(article.date, [...existing, article]);
  }
  return [...groups.entries()]
    .map(([date, articles]) => ({ date, articles }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

import { cache } from "react";
import { format } from "date-fns";
import type { Category, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { BlogArticle } from "@/lib/blog";
import { readTimeLabel } from "@/lib/read-time";

type PostWithCategory = Post & { category: Category | null };

/**
 * Map a DB row to the BlogArticle shape the pages already consume.
 *
 * `readTime` is derived from the body rather than read from the column: the
 * stored value is a legacy import and goes stale whenever a post is edited.
 */
function toArticle(row: PostWithCategory): BlogArticle {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.publishedAt ? format(row.publishedAt, "MMM yyyy") : "",
    author: row.authorName,
    category: row.category?.name ?? "Uncategorized",
    readTime: readTimeLabel(row.body),
    body: row.body,
    image: row.image ?? undefined,
    serviceSlug: row.serviceSlug ?? undefined,
  };
}

/**
 * The published-post list is read on every blog request and includes every
 * body, which is several megabytes. Next's data cache caps a single entry at
 * 2 MB, so an `unstable_cache` over this payload never stores anything and
 * every request falls through to Postgres. Cache it in-process instead: the
 * app runs as a single container, and a short TTL keeps it fresh.
 */
const CACHE_TTL_MS = 60_000;

let listCache: { at: number; rows: PostWithCategory[] } | null = null;

/** Drop the memoised list. Called by the admin after a save or delete. */
export function purgePublishedPosts(): void {
  listCache = null;
}

async function loadPublishedRows(): Promise<PostWithCategory[]> {
  if (listCache && Date.now() - listCache.at < CACHE_TTL_MS) {
    return listCache.rows;
  }
  const rows = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  listCache = { at: Date.now(), rows };
  return rows;
}

export const getPublishedPosts = cache(async (): Promise<BlogArticle[]> => {
  const rows = await loadPublishedRows();
  return rows.map(toArticle);
});

export const getPublishedPost = cache(
  async (slug: string): Promise<BlogArticle | undefined> => {
    const rows = await loadPublishedRows();
    const row = rows.find((r) => r.slug === slug);
    return row ? toArticle(row) : undefined;
  }
);

export async function getPublishedByCategory(
  category: string
): Promise<BlogArticle[]> {
  const all = await getPublishedPosts();
  if (!category || category === "All") return all;
  return all.filter((a) => a.category === category);
}

/**
 * Published posts for a specific set of slugs, preserving the order the
 * caller asked for. Used by landing pages that curate a short list.
 */
export async function getPublishedBySlugs(slugs: string[]): Promise<BlogArticle[]> {
  if (slugs.length === 0) return [];
  const wanted = new Set(slugs);
  const rows = (await getPublishedPosts()).filter((a) => wanted.has(a.slug));
  const bySlug = new Map(rows.map((a) => [a.slug, a]));
  return slugs.map((s) => bySlug.get(s)).filter((a): a is BlogArticle => Boolean(a));
}

export interface CategorySummary {
  name: string;
  slug: string;
  description: string | null;
  count: number;
}

export const getBlogCategories = cache(async (): Promise<CategorySummary[]> => {
  const [cats, counts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.post.groupBy({
      by: ["categoryId"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
    }),
  ]);
  const countMap = new Map<string, number>();
  for (const c of counts) {
    if (c.categoryId) countMap.set(c.categoryId, c._count._all);
  }
  return cats.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    count: countMap.get(c.id) ?? 0,
  }));
});
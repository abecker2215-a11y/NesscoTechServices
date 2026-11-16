import { cache } from "react";
import { unstable_cache } from "next/cache";
import { format } from "date-fns";
import type { Category, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { BlogArticle } from "@/lib/blog";

type PostWithCategory = Post & { category: Category | null };

/**
 * Derive a "N min read" string from body length (~200 wpm), matching the
 * hand-authored values on the original articles.
 */
function readTimeFor(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/** Map a DB row to the BlogArticle shape the pages already consume. */
function toArticle(row: PostWithCategory): BlogArticle {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.publishedAt ? format(row.publishedAt, "MMM yyyy") : "",
    author: row.authorName,
    category: row.category?.name ?? "Uncategorized",
    readTime: row.readTime ?? readTimeFor(row.body),
    body: row.body,
    image: row.image ?? undefined,
    serviceSlug: row.serviceSlug ?? undefined,
  };
}

/**
 * All published posts, cached across requests and tagged so the editorial
 * admin can purge with revalidateTag("posts") after publishing. This keeps
 * build-time free of any DB access (the Docker build has no database) while
 * still serving cached content at runtime.
 */
const fetchPublishedRows = unstable_cache(
  async (): Promise<PostWithCategory[]> =>
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  ["published-posts"],
  { tags: ["posts"] }
);

export const getPublishedPosts = cache(async (): Promise<BlogArticle[]> => {
  const rows = await fetchPublishedRows();
  return rows.map(toArticle);
});

export const getPublishedPost = cache(
  async (slug: string): Promise<BlogArticle | undefined> => {
    const rows = await fetchPublishedRows();
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
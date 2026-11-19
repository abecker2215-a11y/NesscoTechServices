import type { Metadata } from "next";
import Link from "next/link";
import {
  searchArticles,
  groupArticlesByDate,
  getRecentArticles,
} from "@/lib/blog";
import {
  getPublishedPosts,
  getPublishedByCategory,
  getBlogCategories,
} from "@/lib/blog-db";
import { siteConfig } from "@/lib/config";
import { ArrowRight, Clock, Search, Tag } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";
import { BlogPagination } from "@/components/blog-pagination";

const PAGE_SIZE = 12;

// Rendered per request: the Docker build has no database, so blog content is
// read at runtime and cached across requests via unstable_cache in blog-db.
export const dynamic = "force-dynamic";

const baseMetadata: Metadata = {
  title: pageTitle("IT Resources & Blog"),
  description:
    metaDescription("IT tips and security alerts for Tampa Bay businesses. Free guides, quick fixes, and technology advice from your local IT team."),
  alternates: { canonical: "/blog" },
  openGraph: {
    title: pageTitle("IT Resources & Blog"),
    description:
      metaDescription("IT tips and security alerts for Tampa Bay businesses. Free guides, quick fixes, and technology advice from your local IT team."),
    url: "https://nesscotech.com/blog",
    type: "website",
    images: [
      {
        url: `https://${siteConfig.domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Nessco Tech Services — IT Resources & Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Resources & Blog",
    description:
      "IT tips and security alerts for Tampa Bay businesses. Free guides, quick fixes, and technology advice from your local IT team.",
    images: [`https://${siteConfig.domain}/og-image.png`],
  },
};

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

function parsePage(value?: string): number {
  const n = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * Filter, sort, and slice the article list for one page of the index.
 * Sorting is newest-first so page 1 holds the most recent posts.
 */
async function getPageState(category: string, q: string, rawPage?: string) {
  const matched = searchArticles(await getPublishedByCategory(category), q).sort(
    (a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return diff !== 0 ? diff : 0;
    }
  );

  const totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(rawPage), totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;

  return {
    matched,
    totalPages,
    currentPage,
    articles: matched.slice(offset, offset + PAGE_SIZE),
  };
}

function buildHref(paramsToSet: {
  category: string;
  q: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (paramsToSet.category && paramsToSet.category !== "All") {
    params.set("category", paramsToSet.category);
  }
  if (paramsToSet.q) params.set("q", paramsToSet.q);
  if (paramsToSet.page && paramsToSet.page > 1) params.set("page", String(paramsToSet.page));
  const qs = params.toString();
  return `/blog${qs ? "?" + qs : ""}`;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category = "All", q = "" } = await searchParams;
  const { currentPage } = await getPageState(category, q, (await searchParams).page);
  const categories = await getBlogCategories();
  const categorySlugByName = new Map(categories.map((c) => [c.name, c.slug]));
  const slug = categorySlugByName.get(category);

  // Canonical should point to the proper category route, not a query-param filter URL.
  let canonical: string;
  if (slug && slug !== "all") {
    canonical = `/blog/category/${slug}`;
    if (currentPage > 1) canonical += `?page=${currentPage}`;
  } else {
    canonical = buildHref({ category, q, page: currentPage });
  }

  return {
    ...baseMetadata,
    alternates: {
      canonical: canonical,
    },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category = "All", q = "" } = await searchParams;
  const requestedPage = (await searchParams).page;

  const { matched, totalPages, currentPage, articles } = await getPageState(
    category,
    q,
    requestedPage
  );

  const dateGroups = groupArticlesByDate(articles);
  const recentArticles = getRecentArticles(await getPublishedPosts(), 5);
  const categories = await getBlogCategories();
  const chipCategories = ["All", ...categories.map((c) => c.name)];
  const categorySlugByName = new Map(categories.map((c) => [c.name, c.slug]));

  const paginationBase = { category, q };

  const chipClassName = (cat: string) =>
    category === cat
      ? "shrink-0 rounded-full border border-primary px-4 py-2 text-sm font-medium bg-primary text-primary-foreground transition-colors"
      : "shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary text-muted-foreground hover:text-foreground";

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            IT Resources & Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Plain-English IT advice from your local Tampa Bay team. No jargon, no fluff.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <form
            action=""
            method="get"
            className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          >
            <label className="sr-only">Search articles</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search articles…"
              className="flex-1 min-w-[200px] pl-10 pr-4 h-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search articles"
            />
            <input type="hidden" name="category" defaultValue={category} />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sm:inline">Search</span>
            </button>
          </form>

          <div
            className="flex gap-2 mt-6 sm:mt-8 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
            role="list"
            aria-label="Categories"
          >
            {chipCategories.map((cat) => {
              const slug = categorySlugByName.get(cat);
              const href =
                !slug || slug === "all" ? "/blog" : `/blog/category/${slug}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={chipClassName(cat)}
                  aria-current={category === cat ? "page" : undefined}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {articles.length === 0 && (
          <div className="max-w-3xl mx-auto text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              No articles match your filters.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              Clear filters
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        {articles.length > 0 && (
          <>
            {currentPage === 1 && (
              <section className="mb-16 max-w-5xl mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Recent posts</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentArticles.map((article) => (
                    <article
                      key={article.slug}
                      className="rounded-xl border border-border bg-background p-6 lift-hover flex flex-col h-full"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="font-medium text-primary">{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {article.readTime}
                        </span>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          Read: {article.title}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {dateGroups.map(({ date, articles: groupArticles }) => (
              <section key={date} className="mb-16 max-w-5xl mx-auto">
                <h2 className="mb-6 text-2xl font-bold text-foreground">{date}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {groupArticles.map((article) => (
                    <article
                      key={article.slug}
                      className="rounded-xl border border-border bg-background p-6 lift-hover flex flex-col h-full"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="font-medium text-primary">{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {article.readTime}
                        </span>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          Read: {article.title}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            {totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={matched.length}
                hrefForPage={(page) => buildHref({ ...paginationBase, page })}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
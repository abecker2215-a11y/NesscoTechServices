import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllArticles,
  getArticlesByCategory,
  searchArticles,
  groupArticlesByDate,
  getRecentArticles,
} from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { ArrowLeft, ArrowRight, Clock, Search, Tag } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

const PAGE_SIZE = 12;

export const categoryFilters = [
  "All",
  "Business IT",
  "IT Strategy",
  "Industries",
  "Security",
  "Data Protection",
  "Cloud",
  "Communications",
  "Network",
  "Backup",
  "Applications",
];

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
function getPageState(category: string, q: string, rawPage?: string) {
  const matched = searchArticles(getArticlesByCategory(category), q).sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : 0;
  });

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
  const { currentPage } = getPageState(category, q, (await searchParams).page);

  return {
    ...baseMetadata,
    alternates: {
      canonical: buildHref({ category, q, page: currentPage }),
    },
  };
}

function pageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("gap");
    out.push(sorted[i]);
  }
  return out;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category = "All", q = "" } = await searchParams;
  const requestedPage = (await searchParams).page;

  const { matched, totalPages, currentPage, articles } = getPageState(
    category,
    q,
    requestedPage
  );

  const dateGroups = groupArticlesByDate(articles);
  const recentArticles = getRecentArticles(getAllArticles(), 5);

  const paginationBase = { category, q };
  const prevHref =
    currentPage > 1 ? buildHref({ ...paginationBase, page: currentPage - 1 }) : null;
  const nextHref =
    currentPage < totalPages ? buildHref({ ...paginationBase, page: currentPage + 1 }) : null;

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
            {categoryFilters.map((cat) => (
              <Link
                key={cat}
                href={buildHref({ category: cat, q })}
                className={chipClassName(cat)}
                aria-current={category === cat ? "page" : undefined}
              >
                {cat}
              </Link>
            ))}
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
              <nav
                aria-label="Pagination"
                className="max-w-5xl mx-auto mt-4 flex flex-col items-center gap-4"
              >
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} · {matched.length} articles
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {prevHref ? (
                    <Link
                      href={prevHref}
                      rel="prev"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground/50"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Previous
                    </span>
                  )}

                  {pageWindow(currentPage, totalPages).map((p, i) =>
                    p === "gap" ? (
                      <span
                        key={`gap-${i}`}
                        aria-hidden="true"
                        className="px-1 text-sm text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={buildHref({ ...paginationBase, page: p })}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={
                          p === currentPage
                            ? "rounded-lg border border-primary bg-primary text-primary-foreground px-3 py-2 text-sm font-medium"
                            : "rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                        }
                      >
                        {p}
                      </Link>
                    )
                  )}

                  {nextHref ? (
                    <Link
                      href={nextHref}
                      rel="next"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground/50"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
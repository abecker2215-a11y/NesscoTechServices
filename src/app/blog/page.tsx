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
import { ArrowRight, Clock, Search, Tag } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
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

const categories = [
  "All",
  "Business IT",
  "Security",
  "Data Protection",
  "Guides",
  "Quick fixes",
  "Cloud",
  "Communications",
  "Network",
];

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category = "All", q = "" } = await searchParams;

  const categoryArticles = getArticlesByCategory(category);
  const articles = searchArticles(categoryArticles, q);
  const dateGroups = groupArticlesByDate(articles);
  const recentArticles = getRecentArticles(getAllArticles(), 5);

  function buildHref(targetCategory: string, currentQuery: string): string {
    const params = new URLSearchParams();
    if (targetCategory && targetCategory !== "All") params.set("category", targetCategory);
    if (currentQuery) params.set("q", currentQuery);
    const qs = params.toString();
    return `/blog${qs ? "?" + qs : ""}`;
  }

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
            className="flex flex-wrap gap-2 justify-center mt-6 sm:mt-8"
            role="list"
            aria-label="Categories"
          >
            {categories.map((cat) => (
              <Link
                key={cat}
                href={buildHref(cat, q)}
                className={
                  category === cat
                    ? "rounded-full border border-primary px-4 py-2 text-sm font-medium bg-primary text-primary-foreground transition-colors"
                    : "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary text-muted-foreground hover:text-foreground"
                }
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
          </>
        )}
      </div>
    </section>
  );
}

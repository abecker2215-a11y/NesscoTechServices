import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { JsonLd } from "@/components/layout/JsonLd";
import { BlogPagination } from "@/components/blog-pagination";
import { breadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/config";
import { pageTitle, metaDescription } from "@/lib/meta";
import { getBlogCategories, getPublishedByCategory } from "@/lib/blog-db";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 12;

// Rendered per request: the Docker build has no database, so content is read
// at runtime and cached across requests via unstable_cache in blog-db.
export const dynamic = "force-dynamic";

async function loadCategory(slug: string) {
  const categories = await getBlogCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return { title: "Category Not Found" };

  const description = metaDescription(
    category.description ??
      `${category.name} articles and guides for Tampa Bay businesses.`
  );

  return {
    title: pageTitle(`${category.name} Articles`),
    description,
    alternates: { canonical: `https://${siteConfig.domain}/blog/category/${category.slug}` },
    openGraph: {
      title: pageTitle(`${category.name} Articles`),
      description,
      url: `https://${siteConfig.domain}/blog/category/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const category = await loadCategory(slug);
  if (!category) notFound();

  const all = await getPublishedByCategory(category.name);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const parsed = Number.parseInt(page ?? "1", 10);
  const currentPage = Number.isNaN(parsed)
    ? 1
    : Math.min(Math.max(parsed, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const articles = all.slice(start, start + PAGE_SIZE);

  const others = (await getBlogCategories())
    .filter((c) => c.slug !== slug && c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <section className="py-16 lg:py-24">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: category.name, path: `/blog/category/${category.slug}` },
        ])}
      />
      <div className="container">
        <div className="max-w-3xl mx-auto mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All articles
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground">{category.description}</p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {all.length} {all.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {articles.map((article) => (
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
              <h2 className="text-lg font-semibold text-foreground mb-2 transition-colors">
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>
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

        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={all.length}
          hrefForPage={(page) =>
            page <= 1
              ? `/blog/category/${category.slug}`
              : `/blog/category/${category.slug}?page=${page}`
          }
        />

        {others.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Other categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/category/${other.slug}`}
                  className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary hover:text-foreground"
                >
                  {other.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {other.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
          >
            Talk to us about {category.name.toLowerCase()}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
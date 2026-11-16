import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedArticles, getRecentArticles, isoDate, type BlogArticle } from "@/lib/blog";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog-db";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { siteConfig } from "@/lib/config";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Clock, User, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

interface Props {
  params: Promise<{ slug: string }>;
}

// Rendered per request: the Docker build has no database, so post content is
// read at runtime and cached across requests via unstable_cache in blog-db.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedPost(slug);
  if (!article) return { title: "Article Not Found" };

  const baseUrl = `https://${siteConfig.domain}`;
  const pageUrl = `${baseUrl}/blog/${slug}`;

  return {
    title: pageTitle(article.title),
    description: metaDescription(article.excerpt),
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle(article.title),
      description: metaDescription(article.excerpt),
      url: pageUrl,
      type: "article",
      publishedTime: isoDate(article.date),
      authors: [article.author],
      tags: [article.category],
      images: [
        {
          url: article.image ?? `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle(article.title),
      description: metaDescription(article.excerpt),
      images: [article.image ?? `${baseUrl}/og-image.png`],
    },
  };
}

function articleSchema(article: BlogArticle, baseUrl: string) {
  const published = isoDate(article.date);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: published,
    dateModified: published,
    image: [article.image ?? `${baseUrl}/og-image.png`],
    author: {
      "@type": "Organization",
      name: article.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${article.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedPost(slug);
  if (!article) notFound();

  const baseUrl = `https://${siteConfig.domain}`;
  const allArticles = await getPublishedPosts();
  const relatedArticles = getRelatedArticles(article, allArticles);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: article.title, path: `/blog/${slug}` },
      ])} />
      <JsonLd data={articleSchema(article, baseUrl)} />
      <article className="py-16 lg:py-24">
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-foreground">{article.title}</span>
          </nav>

          <header className="mb-8 max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Tag className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium text-primary">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span>{article.date}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              {article.title}
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">{article.category}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" aria-hidden="true" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {article.readTime}
              </span>
            </div>
          </header>

          <MarkdownBody content={article.body} />

          {article.slug.includes("tampa") && (
            <div className="mt-12 max-w-3xl rounded-xl border border-border bg-background p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">Tampa IT resources</h2>
              <p className="text-muted-foreground mb-4">
                Need help implementing this for your Tampa Bay business?
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/it-support-tampa" className="font-medium text-primary hover:underline">IT support in Tampa</Link>
                <Link href="/managed-it-services-tampa" className="font-medium text-primary hover:underline">Managed IT services in Tampa</Link>
                {article.serviceSlug && (
                  <Link href={`/services/${article.serviceSlug}`} className="font-medium text-primary hover:underline">Related services</Link>
                )}
              </div>
            </div>
          )}

          {relatedArticles.length > 0 && (
            <div className="mt-12 max-w-3xl">
              <h2 className="mb-6 text-xl font-bold text-foreground">Related articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="block rounded-lg border border-border bg-background p-5 lift-hover hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-medium text-primary">{related.category}</span>
                    </div>
                    <span className="block font-semibold text-foreground">{related.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                      {related.excerpt}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className="my-12 border-border" />

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground mb-6">
              Need help implementing this for your Tampa Bay business?
            </p>
            {article.serviceSlug && (
              <Link
                href={`/services/${article.serviceSlug}`}
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                View related services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          <section className="mt-16 max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-foreground">Recent posts</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getRecentArticles(allArticles, 5).map((recent) => (
                <article
                  key={recent.slug}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="font-medium text-primary">{recent.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recent.date}</span>
                  </div>
                  <span className="block font-semibold text-foreground">{recent.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                    {recent.excerpt}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
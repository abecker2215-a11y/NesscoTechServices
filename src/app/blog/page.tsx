import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { ArrowRight, Clock, Tag } from "lucide-react";
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

const categories = ["All", "Business IT", "Security", "Data Protection", "Guides", "Quick fixes"];

export default function BlogPage() {
  const articles = getAllArticles();

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

          <div className="max-w-5xl mx-auto">
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Practical IT guidance written for Tampa Bay small businesses. Each article covers a real
            problem we&apos;ve seen in the field — from printer issues to Microsoft 365 security — with
            steps you can follow yourself and a clear line for when it&apos;s time to call for help. New
            articles are added regularly based on the questions our customers ask most often.
          </p>
            <div className="flex flex-wrap gap-2 justify-center mb-12" role="list" aria-label="Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="listitem"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group rounded-xl border border-border bg-background p-6 lift-hover h-full flex flex-col"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="font-medium text-primary">{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.date}</span>
                </div>

                <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="text-sm text-muted-foreground flex-1 mb-4">{article.excerpt}</p>

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
        </div>
      </div>
    </section>
  );
}

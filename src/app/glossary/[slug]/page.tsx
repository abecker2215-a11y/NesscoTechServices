import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTermBySlug, getRelatedTerms, categoryColors as CATEGORY_COLORS } from "@/lib/glossary";
import { getGuidesForService } from "@/lib/guides";
import { getServiceHelpCategory } from "@/lib/services";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, definitionSchema } from "@/lib/schemas";
import { BookOpen, Tag, TrendingUp, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ShareButtons } from "@/components/glossary/ShareButtons";
import { siteConfig } from "@/lib/config";

interface GlossaryTermPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    return {
      title: "Term Not Found — IT Glossary",
    };
  }

  return {
    title: `${term.term} — IT Glossary`,
    description: term.plain,
    openGraph: {
      title: `${term.term} — IT Glossary`,
      description: term.plain,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${term.term} — IT Glossary`,
      description: term.plain,
    },
  };
}

export async function generateStaticParams() {
  const { glossaryTerms } = await import("@/lib/glossary");
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms = getRelatedTerms(term);
  const guides = term.relatedService ? getGuidesForService(term.relatedService.slug) : [];
  const helpCategory = term.relatedService ? getServiceHelpCategory(term.relatedService.slug) : null;

  const structuredData = definitionSchema({
    term: term.term,
    definition: term.plain,
    category: term.category,
    url: `/glossary/${term.slug}`,
    relatedTerms: relatedTerms.map((t) => t.term),
  });

  const pageUrl = `https://${siteConfig.domain}/glossary/${term.slug}`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "IT Glossary", path: "/glossary" },
        { name: term.term, path: `/glossary/${term.slug}` },
      ])} />
      <JsonLd data={structuredData} />
      <article className="py-16 lg:py-24" aria-labelledby="term-heading">
        <div className="container max-w-3xl">
          <Link
            href="/glossary"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Glossary
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${CATEGORY_COLORS[term.category]}`}>
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[term.category]}`}>
                  {term.category}
                </span>
                {term.popularity && (
                  <span className="ml-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Popularity: {term.popularity}/100
                  </span>
                )}
              </div>
            </div>
            <h1 id="term-heading" className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              {term.term}
            </h1>
          </header>

          <section className="prose prose-lg max-w-none mb-10" aria-labelledby="definition-heading">
            <h2 id="definition-heading" className="text-2xl font-bold text-foreground mb-4">
              Definition
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{term.plain}</p>
          </section>

          <section className="mb-10 p-6 bg-muted/30 rounded-xl" aria-labelledby="why-it-matters-heading">
            <h2 id="why-it-matters-heading" className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              Why It Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed">{term.whyItMatters}</p>
          </section>

          {term.tags.length > 0 && (
            <section className="mb-10" aria-labelledby="tags-heading">
              <h2 id="tags-heading" className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" aria-hidden="true" />
                Related Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {term.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-sm text-muted-foreground"
                  >
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {relatedTerms.length > 0 && (
            <section className="mb-10" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-bold text-foreground mb-4">
                Related Terms
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTerms.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/glossary/${related.slug}`}
                    className="group rounded-xl border border-border bg-background p-5 hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${CATEGORY_COLORS[related.category]}`}>
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {related.term}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{related.plain}</p>
                        <span className="mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {related.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {term.relatedService && (
            <section className="mb-10" aria-labelledby="help-heading">
              <h2 id="help-heading" className="text-xl font-bold text-foreground mb-4">
                Need Help With This?
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/services/${term.relatedService.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <span className="font-medium text-foreground">{term.relatedService.label}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                </Link>
                {guides.length > 0 && (
                  <div className="space-y-2">
                    {guides.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <span className="text-sm font-medium text-muted-foreground">Guide:</span>
                        <span className="text-sm text-foreground hover:text-primary transition-colors">
                          {guide.title.split(/[—:(]/)[0].trim()}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {helpCategory && (
                  <Link
                    href={`/get-help?category=${helpCategory}`}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Button size="sm" className="p-0 bg-transparent hover:bg-transparent shadow-none">
                      Get Help With This
                    </Button>
                  </Link>
                )}
              </div>
            </section>
          )}

          <section className="border-t border-border pt-8" aria-labelledby="share-heading">
            <h2 id="share-heading" className="text-lg font-semibold text-foreground mb-4">Share this term</h2>
            <ShareButtons term={term.term} definition={term.plain} url={pageUrl} />
          </section>
        </div>
      </article>
    </>
  );
}
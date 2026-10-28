import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide, getGuidesForService } from "@/lib/guides";
import { guideUpdated } from "@/lib/guides";
import { Button, FAQAccordion, Reveal } from "@/components/ui";
import { GuideActions } from "@/components/guides/GuideActions";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/config";
import { PhoneCall, Clock, CircleAlert } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: guide.title.length > 40 ? guide.title : `${guide.title} | ${siteConfig.name}`,
      description: guide.excerpt,
      url: `https://nesscotech.com/guides/${slug}`,
      type: "article",
    },
  };
}

function articleSchema(guide: NonNullable<ReturnType<typeof getGuide>>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.excerpt,
    totalTime: `PT${guide.readMinutes}M`,
    step: guide.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.heading,
      text: s.body,
    })),
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />
      <JsonLd data={articleSchema(guide)} />
      <JsonLd data={faqPageSchema(guide.faqs)} />

      <section className="py-16 lg:py-24" aria-labelledby="guide-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/guides" className="hover:text-foreground">Guides</Link>
            </nav>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {guide.readMinutes} min read · {guide.readMinutes <= 4 ? "Beginner" : "Intermediate"} · Related: {guide.serviceLabel}
            </p>
            <p className="mb-6 text-xs text-muted-foreground">Updated {guideUpdated(guide)} · Tampa Bay–tested steps</p>
            <h1 id="guide-heading" className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {guide.title}
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">{guide.excerpt}</p>

            {guide.videoUrl && (
              <div className="mb-10 overflow-hidden rounded-xl border border-border">
                <iframe
                  src={guide.videoUrl}
                  title={`${guide.title} — video walkthrough`}
                  className="aspect-video w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <ol className="space-y-8" role="list">
              {guide.steps.map((step, i) => (
                <Reveal key={i}>
                  <li className="rounded-xl border border-border bg-background p-6">
                    <h2 className="mb-2 text-xl font-semibold text-foreground">{step.heading}</h2>
                    <p className="text-muted-foreground">{step.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-10 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 lg:p-8">
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
                <CircleAlert className="h-5 w-5 text-primary" aria-hidden="true" />
                When to call us instead
              </h2>
              <ul className="space-y-2 text-muted-foreground" role="list">
                {guide.whenToCall.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary" aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" href={`/get-help?category=${guide.helpCategory}`}>
                  Get help with this
                </Button>
                <Button size="lg" variant="outline" href={telHref}>
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.phone}
                </Button>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Guide FAQ</h2>
              <FAQAccordion items={guide.faqs} />
            </div>

            <GuideActions slug={guide.slug} title={guide.title} helpCategory={guide.helpCategory} />

            {getGuidesForService(guide.serviceSlug).filter((g) => g.slug !== guide.slug).slice(0, 3).length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">Keep going on {guide.serviceLabel}</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {getGuidesForService(guide.serviceSlug)
                    .filter((g) => g.slug !== guide.slug)
                    .slice(0, 3)
                    .map((g) => (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="block rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{g.title.split(/[—:(]/)[0].trim()}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{g.readMinutes} min read</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <p className="mt-10 text-sm text-muted-foreground">
              Related service:{" "}
              <Link href={`/services/${guide.serviceSlug}`} className="font-medium text-primary hover:underline">
                {guide.serviceLabel} →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fixes, getFix, getFixesForService } from "@/lib/fixes";
import { Button, Reveal } from "@/components/ui";
import { GuideActions } from "@/components/guides/GuideActions";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/config";
import { PhoneCall, Clock, CircleAlert, Stethoscope } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fixes.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fix = getFix(slug);
  if (!fix) return { title: "Fix Not Found" };
  return {
    title: `${fix.title} — Quick Fix`,
    description: fix.excerpt,
    alternates: { canonical: `/fixes/${slug}` },
    openGraph: {
      title: `${fix.title} | ${siteConfig.name}`,
      description: fix.excerpt,
      url: `https://nesscotech.com/fixes/${slug}`,
      type: "article",
    },
  };
}

export default async function FixPage({ params }: Props) {
  const { slug } = await params;
  const fix = getFix(slug);
  if (!fix) notFound();

  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
  const others = fixes.filter((f) => f.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Quick Fixes", path: "/fixes" },
          { name: fix.title, path: `/fixes/${fix.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: fix.title,
          description: fix.excerpt,
          totalTime: `PT${fix.readMinutes}M`,
          step: fix.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.heading, text: s.body })),
        }}
      />

      <section className="py-16 lg:py-24" aria-labelledby="fix-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/fixes" className="hover:text-foreground">Quick Fixes</Link>
            </nav>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {fix.readMinutes} min fix · Related: {fix.serviceLabel}
            </p>
            <h1 id="fix-heading" className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {fix.title}
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">{fix.excerpt}</p>

            {fix.videoUrl && (
              <div className="mb-10 overflow-hidden rounded-xl border border-border">
                <iframe
                  src={fix.videoUrl}
                  title={`${fix.title} — video walkthrough`}
                  className="aspect-video w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
                Does this match?
              </h2>
              <ul className="space-y-2 text-muted-foreground" role="list">
                {fix.symptoms.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary" aria-hidden="true">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ol className="space-y-8" role="list">
              {fix.steps.map((step, i) => (
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
                {fix.whenToCall.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary" aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" href={`/get-help?category=${fix.helpCategory}`}>
                  Get help with this
                </Button>
                <Button size="lg" variant="outline" href={telHref}>
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.phone}
                </Button>
              </div>
            </div>

            <GuideActions slug={fix.slug} title={fix.title} helpCategory={fix.helpCategory} />

            {getFixesForService(fix.serviceSlug).filter((f) => f.slug !== fix.slug).slice(0, 3).length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">More {fix.serviceLabel} fixes</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {getFixesForService(fix.serviceSlug)
                    .filter((f) => f.slug !== fix.slug)
                    .slice(0, 3)
                    .map((f) => (
                      <Link
                        key={f.slug}
                        href={`/fixes/${f.slug}`}
                        className="block rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{f.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{f.readMinutes} min fix</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <p className="mt-10 text-sm text-muted-foreground">
              Related service:{" "}
              <Link href={`/services/${fix.serviceSlug}`} className="font-medium text-primary hover:underline">
                {fix.serviceLabel} →
              </Link>
            </p>

            {others.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">Other quick fixes</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      href={`/fixes/${o.slug}`}
                      className="block rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">{o.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{o.readMinutes} min fix</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

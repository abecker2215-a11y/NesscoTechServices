import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { services, getService, getRelatedServices, getServiceHelpCategory } from "@/lib/services";
import { getGuidesForService } from "@/lib/guides";
import { getFixesForService } from "@/lib/fixes";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceQuoteSidebar } from "@/components/services/ServiceQuoteSidebar";
import { VideoSection } from "@/components/services/VideoSection";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schemas";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug.join("/"));
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical: `https://nesscotech.com/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | Nessco Tech Services`,
      description: service.shortDescription,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug.split("/") }));
}

async function ServiceContent({ params }: Props) {
  const { slug } = await params;
  const key = slug.join("/");
  const service = getService(key);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(key);
  const relatedGuides = getGuidesForService(key);
  const relatedFixes = getFixesForService(key);
  const shownGuides = relatedGuides.slice(0, 6);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: `/services/${service.slug}` },
      ])} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqPageSchema(service.faqs)} />
      <ServiceHero service={service} />

      <section className="py-16 lg:py-24" aria-labelledby="problem-heading">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="max-w-3xl">
            <h2 id="problem-heading" className="text-3xl font-bold text-foreground mb-6">
              The Problem
            </h2>
            <p className="text-lg text-muted-foreground mb-8">{service.problem}</p>
            
            <h3 className="text-xl font-semibold text-foreground mb-4">What We Do</h3>
            <ul className="space-y-3 text-muted-foreground mb-8" role="list">
              {service.whatWeDo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-4">Who It&apos;s For</h3>
            <p className="text-muted-foreground mb-8">{service.whoItsFor}</p>

            <h3 className="text-xl font-semibold text-foreground mb-4">Pricing & Availability</h3>
            <div className="flex flex-wrap gap-4 mb-8">
              {service.remoteAvailable && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  Remote: Starting at ${service.pricing.remote}/hr
                </span>
              )}
              {service.onsiteAvailable && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  On-Site: Starting at ${service.pricing.onsite}/hr
                </span>
              )}
            </div>

            <Button href={`/get-help?category=${getServiceHelpCategory(service.slug)}`} className="w-full sm:w-auto" size="lg">
              Get Help with {service.title}
            </Button>
          </div>

          <ServiceQuoteSidebar service={service} />
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={service.faqs} />

      <VideoSection
        serviceSlug={service.slug}
        serviceTitle={service.title}
        pageUrl={`https://nesscotech.com/services/${service.slug}`}
      />

      {relatedGuides.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="guides-heading">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 id="guides-heading" className="text-3xl font-bold text-foreground mb-4">
                Try it yourself first
              </h2>
              <p className="text-muted-foreground">
                Free step-by-step guides for this exact problem — we&apos;ll tell you honestly when you don&apos;t need us.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {shownGuides.map((guide) => (
                <a
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block p-6 rounded-lg lift-hover border border-border bg-background hover:border-primary/50 transition-colors"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-2">{guide.readMinutes} min read</p>
                  <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.excerpt}</p>
                </a>
              ))}
            </div>
            {relatedGuides.length > shownGuides.length && (
              <p className="mt-8 text-center text-muted-foreground">
                Plus {relatedGuides.length - shownGuides.length} more —{" "}
                <Link href="/guides" className="font-medium text-primary hover:underline">
                  browse all {service.title.toLowerCase()} guides →
                </Link>
              </p>
            )}
            {relatedFixes.length > 0 && (
              <div className="mx-auto mt-8 max-w-4xl">
                <p className="mb-3 text-center text-sm font-semibold text-foreground">
                  In a hurry? {relatedFixes.length === 1 ? "Quick answer" : `${relatedFixes.length} quick answers`} (3 min or less):
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {relatedFixes.map((fix) => (
                    <a
                      key={fix.slug}
                      href={`/fixes/${fix.slug}`}
                      className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                      {fix.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="related-heading">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="related-heading" className="text-3xl font-bold text-foreground mb-4">
                Often bundled with
              </h2>
              <p className="text-muted-foreground">
                Clients who needed {service.title.toLowerCase()} often add one of these in the same visit:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <ServiceCard key={related.slug} service={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start a service request in under 2 minutes. We&apos;ll contact you within 2 hours during business hours.
            </p>
            <Button size="lg" href={`/get-help?category=${getServiceHelpCategory(service.slug)}`}>
              Get Help Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ServicePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading service...</div>}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

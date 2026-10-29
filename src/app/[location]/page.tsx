import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations, getLocation } from "@/lib/locations";
import { services } from "@/lib/services";
import { blogArticles } from "@/lib/blog";
import { Briefcase, Shield, Database, Cable, Headset, HardDrive, Monitor, Mail } from "lucide-react";
import { guides } from "@/lib/guides";
import { fixes } from "@/lib/fixes";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { TrustSignalBarClient, LiveStatsClient } from "@/components/ui/TrustSignalsClient";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { CloudLightning, ArrowRight, Star, BadgeCheck, Users, Award } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, cityBusinessSchema, faqPageSchema } from "@/lib/schemas";
import { FAQItem } from "@/lib/types";
import { pageTitle, metaDescription } from "@/lib/meta";

interface Props {
  params: Promise<{ location: string }>;
}

const locationFaqs = (name: string, remoteFirst?: boolean): FAQItem[] => {
  const base: FAQItem[] = [
  {
    q: `Do you provide on-site IT support in ${name}?`,
    a: remoteFirst
      ? `Yes — on-site visits in ${name} are scheduled by appointment (typically within 2–3 business days) for hardware, cabling, and installs. Most software issues are fixed same-day remotely.`
      : `Yes. We offer on-site support throughout ${name} and the greater Tampa Bay area for hardware, cabling, network installs, and anything that can't be fixed remotely.`,
  },
  {
    q: `How fast can you respond in ${name}?`,
    a: "During business hours (Mon–Fri, 8am–6pm) we typically respond within 2 hours. Remote issues are often resolved the same day; on-site visits are scheduled at your convenience.",
  },
  {
    q: "Do you also support remote workers?",
    a: "Yes — remote support works anywhere with an internet connection, so we can help home offices and traveling employees no matter where they are.",
  },
  ];
  if (name === "Tampa") {
    base.push(
      {
        q: "Do you offer managed IT services in Tampa?",
        a: "Yes. We provide managed IT services in Tampa for businesses with 5–500 employees, including 24/7 monitoring, patching, security, backups, and vCIO strategy. See /managed-it-services-tampa for details.",
      },
      {
        q: "Is there IT support near me in Tampa?",
        a: "Yes. We serve Tampa and the greater Tampa Bay area with same-day remote IT support and next-business-day on-site visits for hardware and network issues.",
      }
    );
  }
  return base;
};

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const loc = getLocation(location);
  if (!loc) return { title: "Location Not Found" };

  const isTampa = loc.name === "Tampa";
  const titleBase = isTampa
    ? "IT Support & Managed IT Services in Tampa, FL"
    : `IT Support in ${loc.name}, FL`;
  const baseUrl = `https://nesscotech.com`;
  const pageUrl = `${baseUrl}/${location}`;
  const descriptionText = isTampa
    ? "Business IT support in Tampa, FL. Managed IT services, helpdesk, cybersecurity, Microsoft 365, and backups for companies with 5-500 employees. Remote from $75/hr, on-site from $125/hr."
    : `Professional IT support in ${loc.name}, ${loc.county} County. Remote help starting at $75/hr, on-site visits at $125/hr. Computers, Wi-Fi, Microsoft 365, security. Serving Tampa Bay.`;

  return {
    title: pageTitle(titleBase),
    description: metaDescription(descriptionText),
    alternates: { canonical: `/${location}` },
    openGraph: {
      title: pageTitle(titleBase),
      description: metaDescription(isTampa ? "Business IT support in Tampa, FL. Managed IT services, helpdesk, cybersecurity, Microsoft 365, and backups for companies with 5-500 employees. Remote from $75/hr, on-site from $125/hr." : `Professional IT support in ${loc.name}, ${loc.county} County. Remote help starting at $75/hr, on-site at $125/hr. Computers, Wi-Fi, Microsoft 365, security. Serving Tampa Bay.`),
      url: pageUrl,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Nessco Tech Services — IT Support in ${loc.name}, FL`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle(titleBase),
      description: metaDescription(isTampa ? "Professional IT support in Tampa, FL. Managed IT, helpdesk, cybersecurity, Microsoft 365, and backups." : `Professional IT support in ${loc.name}, ${loc.county} County. Remote help starting at $75/hr, on-site at $125/hr.`),
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

function LocalFAQ({ name, remoteFirst }: { name: string; remoteFirst?: boolean }) {
  return <FAQAccordion items={locationFaqs(name, remoteFirst)} className="max-w-3xl mx-auto" />;
}

/**
 * Deterministic rotation so each city page features a different set of
 * guides and fixes — unique internal linking per location for SEO.
 */
function rotate<T>(arr: T[], seed: string, n: number): T[] {
  if (arr.length === 0) return [];
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, arr.length); i++) out.push(arr[(h + i) % arr.length]);
  return out;
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params;
  const loc = getLocation(location);
  if (!loc) notFound();

  const otherLocations = locations.filter((l) => l.slug !== location);
  // Same-county neighbors first, capped — the full list lives in the footer.
  const nearbyLocations = [...otherLocations]
    .sort((a, b) => Number(b.county === loc.county) - Number(a.county === loc.county))
    .slice(0, 12);
  const cityGuides = rotate(guides, loc.slug, 3);
  const cityFixes = rotate(fixes, `${loc.slug}-fix`, 3);

  return (
    <>
      <section className="relative hero-navy pt-0 sm:pt-0 lg:pt-0 pb-0 overflow-hidden" aria-hidden="true">
        <div className="relative w-full">
          <HeroBanner />
          <div className="absolute inset-0 bg-navy-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
        </div>
      </section>

      <section className="border-b border-border bg-primary/5" aria-label="Storm readiness check">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="flex items-center gap-3 text-sm text-foreground">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CloudLightning className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <strong>Hurricane season doesn&apos;t negotiate.</strong>{" "}
                <span className="text-muted-foreground">60-second check: would your files survive an outage?</span>
              </span>
            </p>
            <Button variant="outline" size="sm" href="/storm-ready" className="shrink-0">
              Check my score
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <LiveStatsClient />

      <TrustSignalBarClient />

      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <OpenStatus variant="inline" />
        <span aria-hidden="true">•</span>
        <span>Starting at $75</span>
        <span aria-hidden="true">•</span>
        <span>Remote & On-Site</span>
        <span aria-hidden="true">•</span>
        <span>Tampa Bay Area</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
          <span className="font-medium text-foreground">5.0★</span>
          <span>Google</span>
        </span>
        <span className="flex items-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Licensed & Insured</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>500+ Clients</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-warning" aria-hidden="true" />
          <span>Top Rated Tampa Bay</span>
        </span>
      </div>

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: `${loc.name}, FL`, path: `/${loc.slug}` }])} />
      <JsonLd data={cityBusinessSchema(loc)} />
      <JsonLd data={faqPageSchema(locationFaqs(loc.name, loc.remoteFirst))} />
      <section className="py-16 lg:py-24" aria-labelledby="location-heading">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
              {loc.remoteFirst ? "Remote-first area · on-site by appointment" : `Serving ${loc.county} County & Tampa Bay`}
            </p>
            <h1 id="location-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT Support in {loc.name}, FL
            </h1>
            <p className="text-lg text-muted-foreground">{loc.intro}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" href="/get-help">
              Get Help in {loc.name}
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              See Pricing
            </Button>
          </div>

          <div className="mx-auto mb-16 max-w-3xl rounded-xl border border-border bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Common jobs in {loc.name}</h2>
            <ul className="space-y-2 text-muted-foreground" role="list">
              {loc.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-primary" aria-hidden="true">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Scheduling: </span>
              {loc.responseNote}
            </p>
          </div>

          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Services We Provide in {loc.name}</h2>
              <p className="text-muted-foreground">
                Every service below is available to {loc.name} residents and businesses — remotely or on-site.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { key: "managed-it-services", label: "Managed IT Services", icon: Briefcase },
                { key: "it-security", label: "IT Security", icon: Shield },
                { key: "cloud-solutions", label: "Cloud Solutions", icon: Database },
                { key: "network-server", label: "Network & Server", icon: Cable },
                { key: "it-support", label: "IT Support & Helpdesk", icon: Headset },
                { key: "backup-disaster-recovery", label: "Backup & Disaster Recovery", icon: HardDrive },
                { key: "applications", label: "Business Applications", icon: Monitor },
                { key: "communications", label: "Business Communications", icon: Mail },
              ].map((group) => {
                const groupServices = services.filter((s) => s.slug.split("/")[0] === group.key);
                if (groupServices.length === 0) return null;
                const Icon = group.icon;
                return (
                  <details key={group.key} className="group rounded-lg border border-border bg-background">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-foreground marker:content-none">
                      <span className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        {group.label} ({groupServices.length})
                      </span>
                      <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="grid grid-cols-1 gap-2 border-t border-border p-4 md:grid-cols-2 lg:grid-cols-3" role="list">
                      {groupServices.map((service) => (
                        <li key={service.slug}>
                          <Link href={`/services/${service.slug}`} className="block rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50 transition-colors">
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-background p-6 lg:p-8">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Worth reading in {loc.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Free guides and 3-minute fixes from Tampa Bay jobs like yours — try it yourself first.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guides</p>
                  <ul className="space-y-2" role="list">
                    {cityGuides.map((g) => (
                      <li key={g.slug}>
                        <a href={`/guides/${g.slug}`} className="block rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                          <span className="block text-sm font-medium text-foreground">{g.title.split(/[—:(]/)[0].trim()}</span>
                          <span className="text-xs text-muted-foreground">{g.readMinutes} min read</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick fixes</p>
                  <ul className="space-y-2" role="list">
                    {cityFixes.map((f) => (
                      <li key={f.slug}>
                        <a href={`/fixes/${f.slug}`} className="block rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                          <span className="block text-sm font-medium text-foreground">{f.title}</span>
                          <span className="text-xs text-muted-foreground">{f.readMinutes} min fix</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/guides" className="font-medium text-primary hover:underline">All 160+ guides</Link>
                {" · "}
                <Link href="/fixes" className="font-medium text-primary hover:underline">All quick fixes</Link>
              </p>
              {loc.slug === "it-support-tampa" && (
                <div className="mt-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tampa IT resources</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                    {blogArticles
                      .filter((a) =>
                        [
                          "it-support-tampa-bay-small-business",
                          "it-helpdesk-tampa-bay",
                          "it-consulting-tampa-bay",
                          "microsoft-365-security-tampa",
                          "cybersecurity-audit-tampa-bay",
                        ].includes(a.slug)
                      )
                      .map((a) => (
                        <li key={a.slug}>
                          <a href={`/blog/${a.slug}`} className="block rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                            <span className="block text-sm font-medium text-foreground">{a.title}</span>
                            <span className="text-xs text-muted-foreground">{a.readTime}</span>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="nearby-heading">
        <div className="container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 id="nearby-heading" className="text-3xl font-bold text-foreground mb-4">
                Also Serving Nearby
              </h2>
              <p className="text-muted-foreground">Nearby cities first — find all {locations.length} in the footer below.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {nearbyLocations.map((l) => (
                <a
                  key={l.slug}
                  href={`/${l.slug}`}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground lift-hover"
                >
                  IT Support in {l.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">
              {loc.name} IT Support FAQ
            </h2>
          </div>
          <LocalFAQ name={loc.name} remoteFirst={loc.remoteFirst} />
          <div className="mt-10 text-center">
            <Button variant="outline" href="/contact">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

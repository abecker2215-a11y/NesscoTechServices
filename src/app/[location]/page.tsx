import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations, getLocation } from "@/lib/locations";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { fixes } from "@/lib/fixes";
import { ServiceCard } from "@/components/services";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, cityBusinessSchema, faqPageSchema } from "@/lib/schemas";
import { FAQItem } from "@/lib/types";

interface Props {
  params: Promise<{ location: string }>;
}

const locationFaqs = (name: string, remoteFirst?: boolean): FAQItem[] => [
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

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params;
  const loc = getLocation(location);
  if (!loc) return { title: "Location Not Found" };

  return {
    title: `IT Support in ${loc.name}, FL`,
    description: `Professional IT support in ${loc.name}, ${loc.county} County. Remote help starting at $75/hr, on-site visits at $125/hr. Computers, Wi-Fi, Microsoft 365, security. Serving Tampa Bay.`,
    alternates: { canonical: `/${location}` },
    openGraph: {
      title: `IT Support in ${loc.name}, FL`,
      description: `Professional IT support in ${loc.name}, ${loc.county} County. Remote help starting at $75/hr, on-site at $125/hr. Computers, Wi-Fi, Microsoft 365, security. Serving Tampa Bay.`,
      url: `https://nesscotech.com/${location}`,
      type: "website",
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
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

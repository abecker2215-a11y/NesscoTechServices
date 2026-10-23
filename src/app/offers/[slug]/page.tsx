import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { campaigns, getCampaign, isCampaignLive, getCampaignsNow } from "@/lib/campaigns";
import { Button, Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { siteConfig } from "@/lib/config";
import { PhoneCall, BadgeCheck } from "lucide-react";
import { CampaignCountdown } from "@/components/offers/CampaignCountdown";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) return { title: "Offer Not Found" };
  return {
    title: `${c.title} — ${c.season} Offer`,
    description: c.excerpt,
    alternates: { canonical: `/offers/${slug}` },
    openGraph: { title: `${c.title} | ${siteConfig.name}`, description: c.excerpt, url: `/offers/${slug}`, type: "website" },
  };
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
  const others = campaigns.filter((c) => c.slug !== slug);
  const live = isCampaignLive(campaign);
  const daysLeft = getCampaignsNow().find((o) => o.campaign.slug === slug)?.daysLeft;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Seasonal Offers", path: "/offers" },
          { name: campaign.title, path: `/offers/${campaign.slug}` },
        ])}
      />
      <section className="py-16 lg:py-24" aria-labelledby="offer-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/offers" className="hover:text-foreground">Seasonal Offers</Link>
            </nav>
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {campaign.season} offer{live ? " · live now" : ""}
            </p>
            {live && daysLeft !== undefined && (
              <div className="mb-6">
                <CampaignCountdown daysLeft={daysLeft} label="This season ends in" />
              </div>
            )}
            <h1 id="offer-heading" className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {campaign.title}
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">{campaign.pitch}</p>

            <ol className="space-y-6" role="list">
              {campaign.checklist.map((item, i) => (
                <Reveal key={i}>
                  <li className="flex gap-4 rounded-xl border border-border bg-background p-6">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-foreground">{item.heading}</span>
                      <span className="mt-1 block text-muted-foreground">{item.body}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-10 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center lg:p-8">
              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
                Same flat rates — remote $75/hr, on-site $125/hr. Quoted upfront.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" href={`/get-help?category=${campaign.helpCategory}`}>
                  {campaign.cta}
                </Button>
                <Button size="lg" variant="outline" href={telHref}>
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.phone}
                </Button>
              </div>
              {campaign.guideSlug && (
                <p className="mt-4 text-sm text-muted-foreground">
                  DIY first?{" "}
                  <Link href={`/guides/${campaign.guideSlug}`} className="font-medium text-primary hover:underline">
                    {campaign.guideLabel ?? "Read the guide"} →
                  </Link>
                </p>
              )}
            </div>

            {others.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-foreground">Other seasons</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      href={`/offers/${o.slug}`}
                      className="block rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition-colors"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{o.season}</span>
                      <span className="block text-sm font-medium text-foreground">{o.title}</span>
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

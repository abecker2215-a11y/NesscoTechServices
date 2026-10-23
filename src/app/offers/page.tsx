import { Metadata } from "next";
import Link from "next/link";
import { getCampaignsNow } from "@/lib/campaigns";
import { Button, Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { CalendarHeart, ArrowRight } from "lucide-react";
import { CampaignCountdown } from "@/components/offers/CampaignCountdown";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Seasonal Offers — Right Fix, Right Season",
  description:
    "Limited-season IT checkups for Tampa Bay: back-to-school setup, holiday scam protection, tax-season backup checks. Same flat rates, seasonal focus.",
  alternates: { canonical: "/offers" },
  openGraph: {
    title: "Seasonal Offers — Right Fix, Right Season",
    description: "Limited-season IT checkups for Tampa Bay: back-to-school setup, holiday scam protection, tax-season backup checks.",
    url: "https://nesscotech.com/offers",
  },
};

export default function OffersPage() {
  const ordered = getCampaignsNow();
  const live = ordered.filter((o) => o.live);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Seasonal Offers", path: "/offers" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="offers-heading">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarHeart className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="offers-heading" className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Seasonal Offers
            </h1>
            <p className="text-lg text-muted-foreground">
              The right fix at the right time of year. Same flat rates — seasonal focus.
            </p>
            {live.length > 0 && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                {live.length === 1 ? "1 offer live now" : `${live.length} offers live now`}
              </p>
            )}
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {ordered.map(({ campaign: c, live: isLive, daysLeft, startsInDays }) => (
              <Reveal key={c.slug}>
                <article className={cn(
                  "relative flex h-full flex-col rounded-xl border bg-background p-6 lift-hover",
                  isLive ? "border-primary/50 shadow-md shadow-primary/10" : "border-border"
                )}>
                  {isLive ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      LIVE NOW
                    </span>
                  ) : startsInDays !== undefined && startsInDays <= 45 ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      Returns in ~{startsInDays}d
                    </span>
                  ) : null}
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{c.season}</p>
                  <h2 className="mb-2 text-xl font-bold text-foreground">
                    <Link href={`/offers/${c.slug}`} className="hover:text-primary hover:underline">
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{c.excerpt}</p>
                  {isLive && daysLeft !== undefined && (
                    <div className="mb-4 flex justify-center">
                      <CampaignCountdown daysLeft={daysLeft} />
                    </div>
                  )}
                  <Link
                    href={`/offers/${c.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    See the checklist
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-muted-foreground">Year-round emergency? Skip the seasons.</p>
            <Button size="lg" href="/get-help">
              Get Help Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

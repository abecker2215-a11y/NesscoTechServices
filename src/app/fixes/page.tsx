import { Metadata } from "next";
import Link from "next/link";
import { fixes } from "@/lib/fixes";
import { Button, Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Zap, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Quick Fixes — Exact Error, Exact Steps",
  description:
    "Type-what-you-see IT fixes for Tampa Bay businesses: printer offline, red-light router, Outlook stuck syncing. 2–4 minutes each.",
  alternates: { canonical: "/fixes" },
  openGraph: {
    title: "Quick Fixes — Exact Error, Exact Steps",
    description: "Type-what-you-see IT fixes for Tampa Bay businesses. 2–4 minutes each.",
    url: "https://nesscotech.com/fixes",
  },
};

export default function FixesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Quick Fixes", path: "/fixes" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="fixes-heading">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Zap className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="fixes-heading" className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Quick Fixes
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the exact symptom, follow 3–4 steps, done in minutes.
              Every fix ends with exactly when it&apos;s time to call us instead.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fixes.map((fix) => (
              <Reveal key={fix.slug}>
                <article className="flex h-full flex-col rounded-lg border border-border bg-background p-6 lift-hover">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {fix.readMinutes} min fix · {fix.serviceLabel}
                  </p>
                  <h2 className="mb-2 text-lg font-semibold text-foreground">
                    <Link href={`/fixes/${fix.slug}`} className="hover:text-primary hover:underline">
                      {fix.title}
                    </Link>
                  </h2>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{fix.excerpt}</p>
                  <Link
                    href={`/fixes/${fix.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Fix it now
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-muted-foreground">
              Don&apos;t see your exact error? Describe it in your own words — or go deeper with a full guide.
              Tripped by jargon?{" "}
              <Link href="/glossary" className="font-medium text-primary hover:underline">
                IT glossary in plain English →
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" href="/get-help">
                Get Help
              </Button>
              <Button size="lg" variant="outline" href="/guides">
                Browse Fix-It Guides
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

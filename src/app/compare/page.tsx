import { Metadata } from "next";
import Link from "next/link";
import { CompareCalculator, CompareTable } from "@/components/compare/CompareSections";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Break-Fix vs Managed IT — The Real Math"),
  description:
    metaDescription("Break-fix vs managed IT costs for Tampa Bay small businesses. Interactive calculator plus honest comparison."),
  alternates: { canonical: "/compare" },
  openGraph: {
    title: pageTitle("Break-Fix vs Managed IT — The Real Math"),
    description: metaDescription("What reactive IT really costs Tampa Bay small businesses vs a managed plan."),
    url: "https://nesscotech.com/compare",
  },
};

export default function ComparePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Compare", path: "/compare" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="compare-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 id="compare-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Break-fix vs. managed: the real math
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Break-Fix vs Managed IT</h2>
            <p className="text-lg text-muted-foreground">
              Reactive repairs feel cheap until you add them up. Drag the sliders —
              the numbers use our own published $125/hr on-site rate.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Break-fix means you only pay when something breaks — but downtime, emergency rates,
              and repeated issues add up fast. Managed IT means proactive monitoring, patching, and
              support for a flat monthly cost. See which model fits your Tampa Bay business below.
            </p>
          </div>
          <div className="mx-auto mb-16 max-w-5xl">
            <CompareCalculator />
          </div>
          <div className="mx-auto max-w-5xl">
            <CompareTable />
            <div className="mt-10 text-center">
              <p className="mb-4 text-muted-foreground">Convinced either way? Both start with the same 2-minute request.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" href="/get-help">
                  Start a service request
                </Button>
                <Button size="lg" variant="outline" href="/pricing">
                  See pricing
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Want your exact numbers?{" "}
                <Link href="/roi" className="font-medium text-primary hover:underline">
                  Calculate what downtime costs you →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

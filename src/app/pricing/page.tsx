import { Metadata } from "next";
import Link from "next/link";
import { PricingTabs } from "@/components/pricing/PricingTabs";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Wrench, ShieldAlert, CalendarX } from "lucide-react";
import { PricingCalculator } from "@/components/ui/PricingCalculator";
import { ServiceComparisonTable } from "@/components/ui/ComparisonTable";
import { ServiceModelComparison } from "@/components/pricing/ServiceModelComparison";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Pricing"),
    description: metaDescription("Simple, transparent IT pricing. Remote $75/hr, on-site $125/hr. Business IT plans, fixed monthly pricing."),
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: pageTitle("Simple, Transparent Pricing"),
  description: metaDescription("Simple, transparent IT pricing. Remote $75/hr, on-site $125/hr. Business IT plans, fixed monthly pricing."),
    url: "https://nesscotech.com/pricing",
    type: "website",
    images: [
      {
        url: "https://nesscotech.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nessco Tech Services — Simple Transparent Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple, Transparent Pricing",
    description: "Remote support starting at $75/hr, on-site at $125/hr. Business IT plans with fixed monthly pricing. No hidden fees.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const pricingFaqs = [
  { q: "Are there any hidden fees?", a: "No. Hourly rates include labor only. Parts/materials are quoted separately with your approval before purchase. Monthly plans are all-inclusive for the listed device count." },
  { q: "Do I need a contract for hourly work?", a: "No. Pay-as-you-go hourly work requires no contract. You approve the estimate before we start." },
  { q: "What's the minimum for monthly plans?", a: "Month-to-month with 30-day written cancellation. No annual commitment required." },
  { q: "Can I switch plans later?", a: "Yes, upgrade or downgrade at any time. Changes take effect at the next billing cycle." },
  { q: "What payment methods do you accept?", a: "Credit cards, ACH, and checks. Invoices due on receipt for hourly work; monthly plans auto-bill." },
  { q: "Do you offer discounts for non-profits?", a: "Yes, we offer 10% off monthly plans for registered 501(c)(3) organizations. Just mention your status when you get in touch and we'll apply it." },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
      <JsonLd data={faqPageSchema(pricingFaqs)} />
      <section className="py-20 lg:py-32" aria-labelledby="pricing-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 id="pricing-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              No hidden fees. No long-term contracts unless you want one. 
              Business plans are month-to-month with 30-day cancellation.
            </p>
          </div>

          <div className="mb-16">
            <PricingTabs />
          </div>

          <section className="mb-16" aria-labelledby="calculator-heading">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 id="calculator-heading" className="text-3xl font-bold text-foreground mb-4">
                  Build Your Custom Quote
                </h2>
                <p className="text-muted-foreground text-lg">
                  Select services, adjust quantities, and see your estimate instantly.
                </p>
              </div>
              <PricingCalculator />
            </div>
          </section>

          <section className="mb-16" aria-labelledby="comparison-heading">
            <div className="container">
              <ServiceComparisonTable />
            </div>
          </section>

          <ServiceModelComparison />

          <section className="mb-16" aria-labelledby="downtime-heading">
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-8 lg:p-10">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 id="downtime-heading" className="text-3xl font-bold text-foreground mb-4">
                  What &ldquo;break-fix only&rdquo; really costs
                </h2>
                <p className="text-muted-foreground">
                  One reactive repair vs. a month of prevention. The math below uses our own published rates —
                  and it still loses.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="rounded-xl border border-border bg-background p-6">
                  <Wrench className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                  <p className="text-lg font-bold text-foreground">2 on-site hours = $250</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    More than a month of Essentials ($149/mo) — with none of the monitoring, patching, or help desk.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-6">
                  <CalendarX className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                  <p className="text-lg font-bold text-foreground">4 on-site hours = $500</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Roughly a month and a half of Managed ($349/mo) — our most popular all-inclusive plan.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-6">
                  <ShieldAlert className="h-7 w-7 text-primary mb-3" aria-hidden="true" />
                  <p className="text-lg font-bold text-foreground">A full day = $1,000</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    About 6.7 months of Essentials covering monitoring, patching, help desk, and backup oversight.
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button size="lg" href="/contact">
                  Get a Plan Recommendation
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 bg-muted/30" aria-labelledby="faq-heading">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">
                  Pricing FAQ
                </h2>
              </div>
              <FAQAccordion items={pricingFaqs} className="max-w-3xl mx-auto" />
            </div>
          </section>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Not Sure Which Option Fits?
            </h2>
            <p className="text-muted-foreground mb-8">
              We&apos;ll help you choose the right plan. No pressure, just honest guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Talk to Us
              </Button>
              <Button size="lg" variant="outline" href="/get-help">
                Start a Service Request
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Know someone fighting their tech?{" "}
              <Link href="/refer" className="font-medium text-primary hover:underline">
                Refer them — you both get $25 →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
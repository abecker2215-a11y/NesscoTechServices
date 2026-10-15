import { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "Get a Quote — Business IT Pricing in Tampa Bay",
  description:
    "Build a custom IT quote in 2 minutes. Tell us what you need and get a clear starting point for managed IT, security, cloud, and support — no obligation.",
  alternates: { canonical: "https://nesscotech.com/quote" },
  openGraph: {
    title: "Get a Quote | Nessco Tech Services",
    description:
      "Answer a few questions and get a clear starting point for your business IT — managed IT, security, cloud, and support in Tampa Bay.",
    url: "https://nesscotech.com/quote",
    type: "website",
  },
};

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Get a Quote", path: "/quote" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="quote-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calculator className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="quote-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Build your IT quote in 2 minutes
            </h1>
            <p className="text-lg text-muted-foreground">
              Answer a few quick questions and get a clear starting point. We&apos;ll follow up within 2 business
              hours with next steps — no obligation, no pressure.
            </p>
          </div>

          <QuoteWizard />
        </div>
      </section>
    </>
  );
}

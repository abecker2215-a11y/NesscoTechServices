import { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Calculator } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Get a Quote — Business IT Pricing in Tampa Bay"),
  description:
    metaDescription("Build a custom IT quote in 2 minutes. Clear starting point for managed IT, security, cloud, and support."),
  alternates: { canonical: "https://nesscotech.com/quote" },
  openGraph: {
    title: pageTitle("Get a Quote | Nessco Tech Services"),
    description:
      metaDescription("Answer a few questions and get a clear starting point for your business IT — managed IT, security, cloud, and support in Tampa Bay."),
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
            <h2 className="text-xl font-semibold text-foreground mb-6">Transparent IT Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Answer a few quick questions and get a clear starting point. We&apos;ll follow up within 2 business
              hours with next steps — no obligation, no pressure.
            </p>
            <p className="text-lg text-muted-foreground mt-6">
              We provide transparent pricing for managed IT services, cybersecurity, cloud solutions, network and
              server support, and backup/disaster recovery for Tampa Bay businesses. Whether you need remote
              support starting at $75/hr or on-site visits at $125/hr, our quote tool gives you a clear estimate
              before any work begins.
            </p>
            <p className="text-lg text-muted-foreground mt-6">
              Monthly managed IT plans are billed per user or per device with no long-term contracts required.
              Hourly break-fix work is available with same-day scheduling. Fill out the form below and we&apos;ll
              deliver a customized quote tailored to your business needs.
            </p>
          </div>

          <QuoteWizard />
        </div>
      </section>
    </>
  );
}

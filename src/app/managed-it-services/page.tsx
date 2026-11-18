import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Managed IT Services for Business"),
  description: metaDescription("Proactive managed IT services for businesses nationwide. 24/7 monitoring, cybersecurity, Microsoft 365 management, and strategic IT planning under predictable monthly agreements."),
  alternates: { canonical: "https://nesscotech.com/managed-it-services/" },
  openGraph: {
    title: pageTitle("Managed IT Services for Business"),
    description: metaDescription("Proactive managed IT services for businesses nationwide. 24/7 monitoring, cybersecurity, Microsoft 365 management, and strategic IT planning under predictable monthly agreements."),
    url: "https://nesscotech.com/managed-it-services/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Managed IT Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed IT Services for Business",
    description: "Proactive managed IT services for businesses nationwide. 24/7 monitoring, cybersecurity, Microsoft 365 management, and strategic IT planning.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const plans = [
  {
    name: "Essentials",
    price: "$89/user/mo",
    period: "/month",
    description: "Basic monitoring, patching, and help desk for small teams.",
    features: ["Remote monitoring & alerts", "Automated patch management", "Help desk (email/phone)", "Monthly health report", "Up to 10 devices"],
    href: "/contact",
    cta: "Get Started",
  },
  {
    name: "Managed",
    price: "$139/user/mo",
    period: "/month",
    description: "Full IT management: monitoring, security, backups, strategy.",
    features: ["Everything in Essentials", "Managed antivirus/EDR", "Automated cloud backups", "Microsoft 365 management", "Network monitoring", "Quarterly business review", "Up to 25 devices"],
    href: "/contact",
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Complete",
    price: "$189/user/mo",
    period: "/month",
    description: "Managed IT + advanced security, compliance, and vCIO guidance.",
    features: ["Everything in Managed", "Advanced threat protection", "Compliance documentation", "vCIO strategic planning", "Vendor management", "Unlimited devices", "Priority response (1hr)"],
    href: "/contact",
    cta: "Contact Sales",
  },
];

const faqs = [
  { q: "What does managed IT actually include?", a: "Proactive monitoring of your systems, automated patching, help desk support, security management, backup oversight, Microsoft 365 administration, and quarterly strategy reviews. Everything is covered under a predictable monthly agreement." },
  { q: "Do you support businesses outside Florida?", a: "Yes. Our managed IT services are delivered remotely nationwide. We support businesses across the U.S. with the same monitoring, security, and help desk coverage. On-site support is available in the Tampa Bay area." },
  { q: "Is there a long-term contract?", a: "Most agreements are month-to-month with 30-day cancellation. We earn your business every month rather than locking you in. Annual options are available if you prefer." },
  { q: "How quickly do you respond to issues?", a: "During business hours we typically respond within 2 hours. Managed clients get priority response with defined SLAs. Critical issues are triaged immediately." },
  { q: "Do you require a minimum number of users?", a: "Our plans start at 5 devices and scale to unlimited. We work with businesses from 5 to 500+ employees. Contact us to scope the right fit." },
  { q: "What happens if we have an emergency?", a: "Managed clients get after-hours emergency coverage. We follow an incident response plan to contain, resolve, and document what happened, then harden against repeats." },
];

export default function ManagedITServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Managed IT Services", path: "/managed-it-services/" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Serving businesses nationwide
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Your Business IT Department — Without the Cost of Hiring One
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Nessco Tech Services provides proactive managed IT to businesses across the U.S. We handle monitoring, security, backups, and strategy so you can focus on running your business — not putting out IT fires.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Get a Free Consultation</Button>
              <Button size="lg" variant="outline" href="/#pricing-heading" className="min-h-[48px]">View Pricing</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "24/7 Monitoring", body: "Your servers, network, and endpoints monitored around the clock. We catch issues before they become outages." },
              { title: "Flat Monthly Pricing", body: "No surprise invoices. Predictable monthly cost based on the plan that fits your team." },
              { title: "Remote-First Delivery", body: "Support delivered where your team works — anywhere in the U.S. with an internet connection." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="plans-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="plans-heading" className="text-3xl font-bold text-foreground mb-4">Simple, Predictable Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that fits your team. All plans are month-to-month with no long-term contracts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative p-6 rounded-xl border bg-background lift-hover ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6" role="list">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "primary" : "outline"} className="w-full" href={plan.href}>{plan.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="included-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="included-heading" className="text-3xl font-bold text-foreground mb-4">Everything Under One Roof</h2>
            <p className="text-muted-foreground text-lg">Managed IT means you have one partner for every layer of your technology stack.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              "Remote help desk & ticketing",
              "24/7 infrastructure monitoring",
              "Automated patch management",
              "Microsoft 365 administration",
              "Email security & phishing protection",
              "Endpoint detection & response",
              "Backup monitoring & verification",
              "User onboarding & offboarding",
              "Security reporting",
              "Vendor & license management",
              "Quarterly business reviews",
              "IT budgeting & strategy",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Managed IT FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Ready to Stop Managing IT Yourself?</h2>
            <p className="text-muted-foreground mb-8">Book a free 15-minute consultation. We&apos;ll assess your current setup, discuss your pain points, and tell you honestly whether managed IT is the right fit.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Book Free Consultation</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start a Service Request</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
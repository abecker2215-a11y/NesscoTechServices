import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Users, Monitor, Shield, DollarSign, Check } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("IT Support for Small Business"),
  description: metaDescription("IT support and managed services for small businesses (5-50 employees) nationwide. Remote help desk, proactive monitoring, and predictable pricing — no internal IT department required."),
  alternates: { canonical: "https://nesscotech.com/it-support-for-small-business/" },
  openGraph: {
    title: pageTitle("IT Support for Small Business"),
    description: metaDescription("IT support and managed services for small businesses (5-50 employees) nationwide. Remote help desk, proactive monitoring, and predictable pricing."),
    url: "https://nesscotech.com/it-support-for-small-business/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — IT Support for Small Business" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Support for Small Business",
    description: "IT support and managed services for small businesses (5-50 employees) nationwide. Remote help desk, proactive monitoring, and predictable pricing.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const problems = [
  { title: "No Internal IT Team", body: "You&apos;re the IT person by default — but IT isn&apos;t your job.", icon: Users },
  { title: "Unpredictable Costs", body: "Every break-fix call is a surprise invoice. No budgeting, no planning.", icon: DollarSign },
  { title: "Security Blind Spots", body: "No one is watching for threats. You only find out after something breaks.", icon: Shield },
  { title: "Slow Response", body: "Your team waits hours or days for help. Productivity drops every time.", icon: Monitor },
];

const faqs = [
  { q: "What size businesses do you support?", a: "We specialize in businesses with 5-50 employees. We also serve companies up to 500 employees with our Complete plan." },
  { q: "Do we need an internal IT person?", a: "No. That&apos;s the point. We become your IT department — handling support, monitoring, security, and strategy so you don&apos;t need to hire one." },
  { q: "How does remote support work for small businesses?", a: "Your team contacts us by phone, email, or portal. We connect remotely and fix the issue while they watch. Most issues resolve in under an hour." },
  { q: "Is there a long-term contract?", a: "Month-to-month with 30-day cancellation. We earn your business every month." },
  { q: "What&apos;s the difference from break-fix?", a: "Break-fix is reactive — you pay for every hour. Managed IT is proactive — we prevent issues, monitor 24/7, and cover support under a flat monthly fee." },
];

export default function SmallBusinessITSupportPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "IT Support for Small Business", path: "/it-support-for-small-business/" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Designed for 5-50 Employee Companies
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT Support for Small Business — Without the IT Department
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              You don&apos;t need a full-time IT person. You need reliable technology that lets your team work. Nessco provides managed IT, security, and support under predictable monthly pricing — so you can focus on your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Get a Free Consultation</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Service Request</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {problems.map((prob) => (
              <div key={prob.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <prob.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{prob.title}</h3>
                <p className="text-sm text-muted-foreground">{prob.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="solution-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="solution-heading" className="text-3xl font-bold text-foreground mb-4">What You Get</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Help desk for your whole team",
              "24/7 system monitoring",
              "Automated patch management",
              "Email & phishing protection",
              "Backup monitoring",
              "Microsoft 365 management",
              "User onboarding/offboarding",
              "Monthly health reports",
              "Quarterly strategy reviews",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="pricing-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="pricing-heading" className="text-3xl font-bold text-foreground mb-4">Simple Pricing for Small Teams</h2>
            <p className="text-muted-foreground">Flat monthly rates. No surprise invoices. No long-term contracts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Essentials", price: "$89/user/mo", features: ["Up to 10 devices", "Monitoring & alerts", "Patch management", "Help desk", "Monthly report"] },
              { name: "Managed", price: "$139/user/mo", features: ["Up to 25 devices", "Everything in Essentials", "Managed EDR/antivirus", "Cloud backups", "M365 management", "Quarterly review"], popular: true },
              { name: "Complete", price: "$189/user/mo", features: ["Unlimited devices", "Everything in Managed", "Advanced threat protection", "Compliance docs", "vCIO planning", "1hr priority response"] },
            ].map((plan) => (
              <div key={plan.name} className={`relative p-6 rounded-xl border bg-background ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Best Value</div>
                )}
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-foreground mb-2">{plan.price}</div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6" role="list">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "primary" : "outline"} className="w-full" href="/contact">Get Started</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Small Business IT FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Stop Being the IT Person</h2>
            <p className="text-muted-foreground mb-8">Book a free consultation. We&apos;ll assess your current setup and show you what managed IT looks like for your team.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Book Free Consultation</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Service Request</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
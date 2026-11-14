import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Users, Shield, Monitor, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Co-Managed IT Services"),
  description: metaDescription("Co-managed IT for businesses with internal IT teams. Supplement your staff with enterprise-level expertise, 24/7 monitoring, and strategic planning — without replacing your team."),
  alternates: { canonical: "https://nesscotech.com/co-managed-it/" },
  openGraph: {
    title: pageTitle("Co-Managed IT Services"),
    description: metaDescription("Co-managed IT for businesses with internal IT teams. Supplement your staff with enterprise-level expertise, 24/7 monitoring, and strategic planning."),
    url: "https://nesscotech.com/co-managed-it/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Co-Managed IT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Co-Managed IT Services",
    description: "Co-managed IT for businesses with internal IT teams. Supplement your staff with enterprise-level expertise, 24/7 monitoring, and strategic planning.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const benefits = [
  { title: "Supplement Your Team", body: "Your IT staff handles daily operations. We fill the gaps with enterprise-level expertise and 24/7 coverage.", icon: Users },
  { title: "Shared Responsibility", body: "Clear boundaries, documented processes, and shared accountability. No stepping on toes.", icon: Shield },
  { title: "Enterprise Expertise", body: "Access specialists in Microsoft 365, cybersecurity, networking, and cloud — without hiring them full-time.", icon: Monitor },
  { title: "24/7 Monitoring", body: "Your team sleeps. Our monitoring never does. After-hours incidents get handled while you rest.", icon: Zap },
];

const faqs = [
  { q: "How does co-managed IT differ from full MSP?", a: "With co-managed IT, you keep your internal IT team in place. We supplement them with specialized expertise, 24/7 monitoring, and strategic planning. Your team stays in control of day-to-day operations." },
  { q: "Will our IT staff lose their jobs?", a: "No. Co-managed IT helps your team do more, not less. We handle the burdensome tasks (monitoring, patching, after-hours) while your staff focuses on strategic work." },
  { q: "How does pricing work?", a: "Pricing is based on scope — often a base monthly fee plus per-user or per-device costs for the services we provide. We structure it so you only pay for what your team needs." },
  { q: "Can we start small?", a: "Yes. Many co-managed engagements start with 24/7 monitoring and alert response, then expand to strategic planning and vendor management as trust builds." },
  { q: "What if we have a disagreement with your team?", a: "Clear boundaries and documented responsibilities are written into the agreement from day one. We escalate issues to your IT director and respect your chain of command." },
];

export default function CoManagedITPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Co-Managed IT", path: "/co-managed-it/" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              For Businesses with Internal IT
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Co-Managed IT: Your Team, Enhanced
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              You have in-house IT — but they&apos;re stretched thin. Nessco supplements your team with enterprise-level expertise, 24/7 monitoring, and strategic planning. No replacing, no turf wars, just better outcomes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Explore Co-Managed IT</Button>
              <Button size="lg" variant="outline" href="/services/managed-it-services/co-managed" className="min-h-[48px]">Learn More</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="model-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="model-heading" className="text-3xl font-bold text-foreground mb-4">The Co-Managed Model</h2>
            <p className="text-lg text-muted-foreground">Clear responsibilities. Shared accountability. No confusion about who does what.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl border border-border bg-background">
              <h3 className="text-xl font-semibold text-foreground mb-4">Your IT Team Handles</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li>• Day-to-day help desk</li>
                <li>• Employee onboarding</li>
                <li>• Vendor relationships</li>
                <li>• Local infrastructure</li>
                <li>• Strategic direction</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-primary/50 bg-primary/5">
              <h3 className="text-xl font-semibold text-foreground mb-4">We Handle</h3>
              <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                <li>• 24/7 monitoring & alerting</li>
                <li>• After-hours emergency response</li>
                <li>• Specialized security expertise</li>
                <li>• Microsoft 365 administration</li>
                <li>• Backup monitoring & testing</li>
                <li>• Strategic planning support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Co-Managed IT FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Give Your IT Team a Boost</h2>
            <p className="text-muted-foreground mb-8">Book a free consultation to explore whether co-managed IT is the right fit for your team and your budget.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Book Free Consultation</Button>
              <Button size="lg" variant="outline" href="/services/managed-it-services/co-managed" className="min-h-[48px]">Explore Service Page</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
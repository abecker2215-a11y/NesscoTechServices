import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Mail, Shield, Users, Target } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Microsoft 365 Management"),
  description: metaDescription("Microsoft 365 administration, migration, security setup, and ongoing management for businesses nationwide. Secure tenant, email, Teams, SharePoint, and OneDrive."),
  alternates: { canonical: "https://nesscotech.com/microsoft-365-management" },
  openGraph: {
    title: pageTitle("Microsoft 365 Management"),
    description: metaDescription("Microsoft 365 administration, migration, security setup, and ongoing management for businesses nationwide."),
    url: "https://nesscotech.com/microsoft-365-management",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Microsoft 365 Management" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Microsoft 365 Management",
    description: "Microsoft 365 administration, migration, security setup, and ongoing management for businesses nationwide.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const services = [
  { title: "Tenant Setup & Migration", body: "Microsoft 365 tenant deployment, data migration from any platform, user provisioning", icon: Mail },
  { title: "Security Configuration", body: "MFA, Conditional Access, email security policies, threat protection setup", icon: Shield },
  { title: "Ongoing Administration", body: "User lifecycle management, licensing optimization, monthly reporting", icon: Users },
  { title: "Collaboration Management", body: "Teams, SharePoint, OneDrive setup, governance, permissions", icon: Target },
];

const faqs = [
  { q: "Do you manage existing M365 tenants?", a: "Yes. We take over administration of existing tenants, clean up unused licenses, secure settings, and optimize costs." },
  { q: "Will migration cause downtime?", a: "We plan cutovers outside business hours to minimize disruption. Most migrations complete with zero visible downtime." },
  { q: "Can you reduce our M365 licensing costs?", a: "Yes. We audit licenses monthly, identify unused seats, and recommend the right plan tiers for each user." },
  { q: "Do you support Teams and SharePoint?", a: "Yes. We configure Teams channels, SharePoint sites, OneDrive policies, and external sharing controls." },
  { q: "Is email security included?", a: "Yes. We set up anti-phishing, anti-spam, encryption, and email security policies as part of management." },
];

export default function M365ManagementPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Microsoft 365 Management", path: "/microsoft-365-management" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Microsoft 365 Management Nationwide
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Microsoft 365 Management That Just Works
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your Microsoft 365 tenant should be secure, well-configured, and easy to manage. We handle administration, security, and optimization so your team can focus on work — not IT tickets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Get a Free Assessment</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Service Request</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((svc) => (
              <div key={svc.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svc.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{svc.title}</h3>
                <p className="text-sm text-muted-foreground">{svc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">Why Businesses Outsource M365 Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Security by Default", body: "MFA, Conditional Access, email filtering, and threat protection configured and maintained." },
              { title: "License Optimization", body: "Stop paying for unused seats. We right-size your licensing to actual usage." },
              { title: "Proactive Monitoring", body: "We watch for outages, security incidents, and compliance issues before they impact you." },
              { title: "No Admin Burden", body: "Your team doesn't need to be Microsoft experts. We handle user setup, permissions, and password resets." },
              { title: "Monthly Reporting", body: "Clear reports on usage, security posture, license spend, and upcoming renewals." },
              { title: "Nationwide Coverage", body: "Remote administration means we support your M365 tenant from anywhere in the U.S." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">M365 Management FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Stop Managing M365 Yourself</h2>
            <p className="text-muted-foreground mb-8">Book a free assessment of your Microsoft 365 tenant. We&apos;ll review security, licensing, and setup — and tell you what needs fixing.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Book Free Assessment</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Service Request</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
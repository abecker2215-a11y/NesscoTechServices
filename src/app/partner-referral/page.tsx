import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Users, DollarSign, Handshake, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Partner Referral Program"),
  description: metaDescription("Partner with Nessco Tech Services. Earn referral commissions by referring small businesses that need managed IT services, cybersecurity, and Microsoft 365 management."),
  alternates: { canonical: "https://nesscotech.com/partner-referral" },
  openGraph: {
    title: pageTitle("Partner Referral Program"),
    description: metaDescription("Partner with Nessco Tech Services. Earn referral commissions by referring small businesses that need managed IT services."),
    url: "https://nesscotech.com/partner-referral",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Partner Referral Program" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner Referral Program",
    description: "Partner with Nessco Tech Services. Earn referral commissions by referring small businesses.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const partnerTypes = [
  {
    title: "Accounting Firms",
    body: "Refer your small business clients for IT support, Microsoft 365 management, and cybersecurity.",
    icon: DollarSign,
  },
  {
    title: "Business Consultants",
    body: "Technology recommendations to your clients without becoming an IT expert yourself.",
    icon: Users,
  },
  {
    title: "Independent MSPs",
    body: "Overflow work, specialized project support, or white-label delivery partnership.",
    icon: Handshake,
  },
  {
    title: "VoIP & Phone Providers",
    body: "Network and Microsoft 365 services for your customers.",
    icon: Shield,
  },
];

const howItWorks = [
  { step: "1", title: "Refer a Qualified Prospect", body: "Introduce us to a business owner who needs IT management. No upfront commitment from them required." },
  { step: "2", title: "We Qualify & Quote", body: "Our team handles the consultation, scoping, and proposal. You stay out of the technical details." },
  { step: "3", title: "Earn When They Sign", body: "Receive your referral commission after the client signs and completes onboarding. Paid monthly." },
];

const faqs = [
  { q: "Who can join the referral program?", a: "Any business that serves other small businesses — accounting firms, consultants, MSPs, VoIP providers, copier companies, and more." },
  { q: "How does the commission work?", a: "We pay an agreed referral commission on each referred client who signs a managed services agreement and completes onboarding. Commissions are paid monthly." },
  { q: "Do we own the client relationship?", a: "No. Nessco owns the client relationship and handles all service delivery. You receive the referral commission as the introducer." },
  { q: "Is there a cost to join?", a: "No. There are no upfront fees, lead-buying agreements, or hidden costs." },
  { q: "How do we track referrals?", a: "We use unique referral codes or tracking links so every introduction is attributed and commission-eligible." },
  { q: "Can we white-label Nessco services?", a: "Yes. We offer white-label partnerships where you own the client relationship and Nessco provides technical delivery at wholesale rates." },
];

export default function PartnerReferralPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Partner Referral", path: "/partner-referral" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              No Upfront Fees — Ever
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Earn Commissions by Referring Businesses That Need IT
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              You already serve small business owners. Nessco handles their IT. You earn a referral commission for every qualified introduction. No upfront fees, no lead-buying, no technical overhead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="#apply" className="min-h-[48px]">Apply to Partner</Button>
              <Button size="lg" variant="outline" href="/contact" className="min-h-[48px]">Ask About Partnership</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="partner-types-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="partner-types-heading" className="text-3xl font-bold text-foreground mb-4">Who We Partner With</h2>
            <p className="text-muted-foreground">Businesses that already have relationships with small business owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {partnerTypes.map((p) => (
              <div key={p.title} className="p-6 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="how-it-works-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="how-it-works-heading" className="text-3xl font-bold text-foreground mb-4">How the Program Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {howItWorks.map((step) => (
              <div key={step.step} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Referral Program FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section id="apply" className="py-16 lg:py-24" aria-labelledby="apply-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="apply-heading" className="text-3xl font-bold text-foreground mb-4">Ready to Partner?</h2>
            <p className="text-muted-foreground mb-8">Apply below and we&apos;ll respond within 2 business hours to discuss partnership details.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px] w-full sm:w-auto">Apply to Partner</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
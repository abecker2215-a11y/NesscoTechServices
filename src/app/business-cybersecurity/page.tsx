import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Shield, ShieldCheck, Lock, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Business Cybersecurity"),
  description: metaDescription("Managed cybersecurity for businesses nationwide. Endpoint protection, email security, threat monitoring, and incident response planning under predictable monthly plans."),
  alternates: { canonical: "https://nesscotech.com/business-cybersecurity/" },
  openGraph: {
    title: pageTitle("Business Cybersecurity"),
    description: metaDescription("Managed cybersecurity for businesses nationwide. Endpoint protection, email security, threat monitoring, and incident response planning."),
    url: "https://nesscotech.com/business-cybersecurity/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Business Cybersecurity" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Cybersecurity",
    description: "Managed cybersecurity for businesses nationwide. Endpoint protection, email security, threat monitoring, and incident response planning.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const components = [
  { title: "Endpoint Protection", body: "EDR/XDR with 24/7 monitoring and automated threat response for every device.", icon: Shield },
  { title: "Email Security", body: "Phishing, spoofing, malware protection, and data-loss prevention for business email.", icon: Lock },
  { title: "Threat Monitoring", body: "24/7 SOC-style monitoring with human triage and rapid response.", icon: Eye },
  { title: "Incident Response", body: "Plan, prepare, respond, and recover with documented playbooks and testing.", icon: ShieldCheck },
];

const faqs = [
  { q: "What does managed cybersecurity include?", a: "Endpoint protection (EDR/XDR), email security (phishing, spoofing, malware), threat monitoring with human triage, backup monitoring, and incident response planning under a predictable monthly plan." },
  { q: "How quickly do you respond to security threats?", a: "Managed clients get priority response with defined SLAs, including after-hours emergency coverage. Critical threats are triaged immediately." },
  { q: "Do you handle compliance (HIPAA, PCI, SOC 2)?", a: "We implement technical controls aligned to common frameworks and provide the evidence auditors expect. For formal attestation, we partner with specialized auditors." },
  { q: "What happens if we get breached?", a: "We follow an incident response plan to contain, eradicate, and recover. We document lessons learned and harden systems against repeats." },
  { q: "Can you secure a remote workforce?", a: "Yes. We protect endpoints, email, identities, and network access regardless of where your team works." },
];

export default function BusinessCybersecurityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Business Cybersecurity", path: "/business-cybersecurity/" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Security-First Protection
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Cybersecurity for Businesses That Can&apos;t Afford Downtime
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Managed cybersecurity that protects your business before, during, and after incidents. Layered defense, proactive monitoring, and rapid response — under predictable monthly plans.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Get Free Security Assessment</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Security Assessment</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {components.map((svc) => (
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

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="approach-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="approach-heading" className="text-3xl font-bold text-foreground mb-4">Our Security Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Layered Defense", body: "Endpoint, email, network, and identity protection working together." },
              { title: "Proactive Monitoring", body: "24/7 monitoring with automated detection and human triage." },
              { title: "Prepared Response", body: "Documented incident response playbooks and tested recovery plans." },
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
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Cybersecurity FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Protect Your Business Today</h2>
            <p className="text-muted-foreground mb-8">Get a free security assessment. We&apos;ll audit your current posture and tell you exactly what needs attention.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact" className="min-h-[48px]">Get Free Assessment</Button>
              <Button size="lg" variant="outline" href="/get-help" className="min-h-[48px]">Start Security Assessment</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
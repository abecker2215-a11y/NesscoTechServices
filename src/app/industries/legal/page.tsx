import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Server, Database, Lock, FileText, CheckCircle, Clock, Headset, Scale, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Law Firms & Legal Practices | Tampa Bay",
  description: "Secure IT support for Tampa Bay law firms. Client confidentiality, document management, and reliable infrastructure.",
  alternates: { canonical: "https://nesscotech.com/industries/legal" },
  openGraph: {
    title: "IT Services for Law Firms & Legal Practices | Tampa Bay",
    description: "Secure IT support for Tampa Bay law firms. Client confidentiality, document management.",
    url: "https://nesscotech.com/industries/legal",
  },
};

const legalFaqs = [
  { q: "How do you protect client confidentiality?", a: "Multi-layered security: encrypted storage, access controls, audit logging, secure communications, and policies aligned with attorney-client privilege requirements." },
  { q: "Do you support legal practice management software?", a: "Yes. We support Clio, PracticePanther, MyCase, Rocket Matter, and custom practice management systems. We also handle document management systems." },
  { q: "Can you help with eDiscovery?", a: "We provide infrastructure for eDiscovery processing, secure data collection, and chain-of-custody logging. We don't perform the eDiscovery analysis itself." },
  { q: "What about remote access for attorneys?", a: "Secure remote access via VPN, zero-trust network access, and encrypted connections. All remote sessions are logged and access is role-based." },
  { q: "Do you understand billable hour tracking?", a: "Yes. We ensure your time tracking, billing systems, and practice management software are integrated and reliable." },
  { q: "Can you help with document retention policies?", a: "We implement automated document retention, archiving, and secure deletion according to your firm's policies and jurisdictional requirements." },
];

const services = [
  {
    icon: Shield,
    title: "Client Data Security",
    description: "Encrypted storage, access controls, and audit logging to protect privileged attorney-client communications.",
  },
  {
    icon: Server,
    title: "Practice Management Infrastructure",
    description: "Reliable servers, networking, and cloud infrastructure for practice management and billing systems.",
  },
  {
    icon: Database,
    title: "Document Management",
    description: "Secure document storage, version control, and retention policies for case files and client records.",
  },
  {
    icon: Lock,
    title: "Access Control & Compliance",
    description: "Role-based access, MFA, and audit trails aligned with attorney-client privilege requirements.",
  },
  {
    icon: FileText,
    title: "eDiscovery Infrastructure",
    description: "Secure infrastructure for data collection, processing, and chain-of-custody logging.",
  },
  {
    icon: Search,
    title: "Secure Communications",
    description: "Encrypted email, secure file sharing, and protected communications with clients and opposing counsel.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Client Confidentiality",
    description: "Security measures designed to protect privileged communications and client data.",
  },
  {
    icon: Clock,
    title: "Reliable Uptime",
    description: "Minimal downtime ensures attorneys can access case files and billing systems when needed.",
  },
  {
    icon: Headset,
    title: "Legal-Experienced Support",
    description: "Our team understands legal workflows, billable hours, and the stakes of practice IT.",
  },
  {
    icon: Scale,
    title: "Compliance-Aligned",
    description: "Policies and procedures aligned with ethical requirements and confidentiality obligations.",
  },
];

export default function LegalPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Legal", path: "/industries/legal" }])} />
      <JsonLd data={faqPageSchema(legalFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Scale className="h-4 w-4" aria-hidden="true" />
              Law Firms & Legal Practices
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Secure IT for Tampa Bay Law Firms
            </h1>
            <p className="text-lg text-muted-foreground">
              Client confidentiality, reliable practice management infrastructure, and document security 
              — designed for the unique requirements of legal practices.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Legal IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Legal Practice Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Legal Practice IT Services
            </h2>
            <p className="text-muted-foreground">
              Designed for client confidentiality, practice management, and document security requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="p-6 rounded-lg border border-border bg-background lift-hover">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4 w-fit">
                  <service.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">
              Why Law Firms Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand legal workflows, billable hours, and the critical importance of client confidentiality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="compliance-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="compliance-heading" className="text-3xl font-bold text-foreground mb-4">
                Client Confidentiality Framework
              </h2>
              <p className="text-muted-foreground">
                Security measures aligned with attorney-client privilege requirements and ethical obligations.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Data Protection
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted storage at rest
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted communications
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure file sharing
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Automated backup with encryption
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                    Access & Audit
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Role-based access controls
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Multi-factor authentication
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Comprehensive audit logging
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Document retention policies
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">
              Legal Practice IT FAQ
            </h2>
          </div>
          <FAQAccordion items={legalFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Secure Your Firm&apos;s IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your client confidentiality needs, practice management infrastructure, 
              and legal-specific IT requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Legal IT Consultation
              </Button>
              <Button size="lg" variant="outline" href="/services">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

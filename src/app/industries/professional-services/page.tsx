import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Briefcase, Building2, FileText, CheckCircle, Clock, Headset, Users, Calculator, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional Services IT | Tampa Bay",
  description: "IT support for Tampa Bay professional services firms. Document management, secure collaboration.",
  alternates: { canonical: "https://nesscotech.com/industries/professional-services" },
  openGraph: {
    title: "Professional Services IT | Tampa Bay",
    description: "IT support for Tampa Bay professional services. Document management, secure collaboration, and practice management.",
    url: "https://nesscotech.com/industries/professional-services",
  },
};

const professionalServicesFaqs = [
  { q: "Can you help with document management?", a: "Yes. We implement secure document management systems with version control, access controls, and automated workflows for professional services firms." },
  { q: "How do you handle compliance?", a: "We implement compliance measures for HIPAA, PCI DSS, SOC 2, and other relevant regulations for professional services firms." },
  { q: "What practice management software do you support?", a: "We support Clio, MyCase, Fiserv, and custom practice management systems with case management, billing, and client portal integration." },
  { q: "Can you help with secure collaboration?", a: "Yes. We implement secure collaboration tools with encryption, access controls, and audit trails for client communications and document sharing." },
  { q: "How do you support remote work?", a: "We implement secure remote access solutions with VPN, multi-factor authentication, and mobile device management for professional services firms." },
  { q: "Can you help with billing and invoicing?", a: "Yes. We integrate with accounting software, implement automated billing systems, and provide financial reporting for professional services firms." },
];

const services = [
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure document management with version control, access controls, and automated workflows for professional services firms.",
  },
  {
    icon: Shield,
    title: "Secure Collaboration",
    description: "Encrypted collaboration tools with access controls and audit trails for client communications and document sharing.",
  },
  {
    icon: Briefcase,
    title: "Practice Management",
    description: "Clio, MyCase, and custom practice management systems with case management, billing, and client portals.",
  },
  {
    icon: Building2,
    title: "Office Infrastructure",
    description: "Network infrastructure, server management, and IT support for professional services offices.",
  },
  {
    icon: Calculator,
    title: "Financial Management",
    description: "Integrated billing, invoicing, and financial reporting systems for professional services firms.",
  },
  {
    icon: Home,
    title: "Remote Access",
    description: "Secure remote access solutions with VPN, multi-factor authentication, and mobile device management.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Professional Services Expertise",
    description: "We understand the professional services industry's requirements for document management, compliance, and client services.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Practice management systems and document access available 24/7 for professional services firms.",
  },
  {
    icon: Headset,
    title: "Professional Services Experience",
    description: "Our team understands the professional services industry's specific challenges and requirements.",
  },
  {
    icon: Users,
    title: "Client-Focused Technology",
    description: "Technology that enhances client experience and supports professional services operations.",
  },
];

export default function ProfessionalServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Professional Services", path: "/industries/professional-services" }])} />
      <JsonLd data={faqPageSchema(professionalServicesFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              Professional Services
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT for Tampa Bay Professional Services Firms
            </h1>
            <p className="text-lg text-muted-foreground">
              Document management, secure collaboration, and practice management — designed specifically for the unique requirements of professional services firms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Professional Services IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Professional Services Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Professional Services IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for professional services firms, from document management to secure collaboration and practice management.
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
              Why Professional Services Firms Choose Us
            </h2>
            <p className="text-muted-foreground">
We understand the professional services industry&apos;s requirements for document management, compliance, and client services.
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

      <section className="py-16 lg:py-24" aria-labelledby="mobility-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="mobility-heading" className="text-3xl font-bold text-foreground mb-4">
                Professional Services Technology Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for professional services firms, document management, secure collaboration, and practice management.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                    Document Management
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Version control & audit trails
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Role-based access controls
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Automated workflows
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure client portals
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Secure Collaboration
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted client communications
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Multi-factor authentication
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Document sharing & tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Compliance reporting
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
              Professional Services IT FAQ
            </h2>
          </div>
          <FAQAccordion items={professionalServicesFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Professional Services IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your professional services firm&apos;s IT needs, from document management to secure collaboration and practice management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Professional Services IT Consultation
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

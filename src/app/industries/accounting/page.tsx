import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Server, Calculator, FileText, CheckCircle, Clock, Headset, Users, DollarSign, PieChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Accounting & Tax Firm IT | Tampa Bay",
  description: "Secure IT support for Tampa Bay accounting firms. Tax software hosting, data protection, compliance.",
  alternates: { canonical: "https://nesscotech.com/industries/accounting" },
  openGraph: {
    title: "Accounting & Tax Firm IT | Tampa Bay",
    description: "Secure IT support for Tampa Bay accounting firms. Tax software hosting, data protection, and compliance.",
    url: "https://nesscotech.com/industries/accounting",
  },
};

const accountingFaqs = [
  { q: "Can you host QuickBooks, Xero, and other accounting software?", a: "Yes. We provide secure hosting, remote access, backup, and disaster recovery for all major accounting platforms. We also handle updates and ensure compliance with your state&apos;s requirements." },
  { q: "How do you handle client tax data security?", a: "We implement IRS Pub 4557 compliance with encrypted storage, secure backup procedures, and strict access controls. We also provide audit trails and detailed reporting for regulatory compliance." },
  { q: "What tax software do you support?", a: "We support QuickBooks Online/Desktop, Xero, Sage, Microsoft Dynamics 365 Business Central, and Intuit ProSeries/Refined for tax preparation. We also provide custom tax software solutions." },
  { q: "Can you help with document management?", a: "Yes. We provide secure document storage, client portals, workflow automation, and integration with accounting software. We also implement secure document retention and destruction policies." },
  { q: "How do you ensure compliance with tax regulations?", a: "We maintain current knowledge of state and federal tax regulations, implement compliant security measures, and provide documentation for audits. We also keep detailed logs of all access and changes." },
  { q: "Can you help with multi-firm accounting?", a: "Yes. We provide secure multi-tenant environments, separate client portals, and role-based access controls. We also support network of firms accounting solutions." },
];

const services = [
  {
    icon: Calculator,
    title: "Tax Software Hosting",
    description: "Secure hosting for QuickBooks, Xero, Sage, and Intuit ProSeries with fast remote access and automatic backups.",
  },
  {
    icon: Shield,
    title: "Tax Data Security",
    description: "IRS Pub 4557 compliant security, encrypted storage, and secure backup procedures for all client tax data.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure document storage, client portals, and workflow automation for efficient tax preparation and filing.",
  },
  {
    icon: Server,
    title: "Infrastructure Support",
    description: "Network infrastructure, server management, and IT support for accounting firms with 24/7 monitoring.",
  },
  {
    icon: DollarSign,
    title: "Compliance Management",
    description: "Tax compliance tracking, audit preparation, and regulatory updates for CPA firms.",
  },
  {
    icon: PieChart,
    title: "Practice Management",
    description: "Staff scheduling, resource allocation, and productivity tracking for accounting teams.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Tax Software Expertise",
    description: "We understand the unique requirements of accounting software, tax preparation workflows, and CPA firm operations.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Your tax software and client data are accessible 24/7 with our secure remote access solutions.",
  },
  {
    icon: Headset,
    title: "Accounting-Knowledgeable Support",
    description: "Our team understands the accounting industry&apos;s specific challenges and requirements.",
  },
  {
    icon: Users,
    title: "Scalable Solutions",
    description: "From solo practitioners to multi-partner firms, we scale with your accounting practice.",
  },
];

export default function AccountingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Accounting", path: "/industries/accounting" }])} />
      <JsonLd data={faqPageSchema(accountingFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Accounting & Tax Firms
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Secure IT for Tampa Bay Accounting Firms
            </h1>
            <p className="text-lg text-muted-foreground">
              Tax software hosting, data security, and compliance — designed specifically for the unique requirements of CPA and accounting firms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule an Accounting IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Accounting Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Accounting IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for accounting firms, from tax software hosting to document management and compliance.
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
              Why Accounting Firms Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand the accounting industry&apos;s specific requirements for security, compliance, and accessibility.
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
                Accounting Data Protection Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for secure tax data management, compliance, and client confidentiality.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    IRS Compliance
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      IRS Pub 4557 compliant security
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted tax data storage
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure backup procedures
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Detailed audit trails
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                    Document Management
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Client document portals
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Workflow automation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure file sharing
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Retention policy management
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
              Accounting IT FAQ
            </h2>
          </div>
          <FAQAccordion items={accountingFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Secure Your Accounting IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your accounting firm&apos;s IT needs, from tax software hosting to compliance management and document security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Accounting IT Consultation
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




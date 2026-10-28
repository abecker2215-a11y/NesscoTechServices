import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Home, Building2, Key, CheckCircle, Clock, Headset, Users, FileText, MapPin, DollarSign } from "lucide-react";

export const metadata: Metadata = {
    title: "Real Estate IT Services | Tampa Bay",
  description: "IT support for Tampa Bay real estate and property management. MLS systems, tenant portals.",
  alternates: { canonical: "https://nesscotech.com/industries/real-estate" },
  openGraph: {
  title: "Real Estate IT Services | Tampa Bay",
    description: "IT support for Tampa Bay real estate and property management. MLS systems, tenant portals.",
    url: "https://nesscotech.com/industries/real-estate",
  },
};

const realEstateFaqs = [
  { q: "Can you integrate with MLS systems?", a: "Yes. We support MLS system integration, property listing management, and CRM integration for real estate firms. We also handle data synchronization across multiple MLS platforms." },
  { q: "How do you handle tenant data security?", a: "We implement secure tenant screening systems with encrypted data storage, compliance with state privacy laws, and secure document handling for all tenant information." },
  { q: "What property management software do you support?", a: "We support AppFolio, RealPage, Yardi, LinkedIn Real Estate, and custom property management systems. We also provide integration with accounting and maintenance software." },
  { q: "Can you help with building access systems?", a: "Yes. We provide smart building access control, key card systems, and mobile access solutions for multi-family properties." },
  { q: "How do you handle lease management?", a: "We offer lease management systems with automated rent collection, renewal reminders, and secure document storage for all lease agreements." },
  { q: "Can you help with maintenance requests?", a: "Yes. We provide maintenance request systems, work order management, and vendor coordination for property management companies." },
];

const services = [
  {
    icon: Building2,
    title: "MLS System Integration",
    description: "Secure MLS system integration, property listing management, and real-time data synchronization across multiple platforms.",
  },
  {
    icon: Home,
    title: "Property Management Software",
    description: "Support for AppFolio, RealPage, Yardi, and custom property management systems with full CRM integration.",
  },
  {
    icon: Key,
    title: "Access Control Systems",
    description: "Smart building access control, key card systems, and mobile access solutions for secure property access.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description: "Automated lease management with rent collection, renewal reminders, and secure document storage.",
  },
  {
    icon: MapPin,
    title: "Maintenance Systems",
    description: "Maintenance request systems, work order management, and vendor coordination for property management.",
  },
  {
    icon: DollarSign,
    title: "Financial Management",
    description: "Integration with accounting software, rent collection systems, and financial reporting for property managers.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Real Estate Expertise",
    description: "We understand the real estate industry's requirements for MLS integration, property management, and tenant services.",
  },
  {
    icon: Clock,
    title: "24/7 Property Access",
    description: "Secure property access systems and online tenant portals available 24/7 for property managers.",
  },
  {
    icon: Headset,
    title: "Property Management Experience",
    description: "Our team understands property management workflows, tenant services, and building operations.",
  },
  {
    icon: Users,
    title: "Tenant-Friendly Solutions",
    description: "Secure, user-friendly tenant portals and mobile apps that improve tenant satisfaction.",
  },
];

export default function RealEstatePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Real Estate", path: "/industries/real-estate" }])} />
      <JsonLd data={faqPageSchema(realEstateFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Home className="h-4 w-4" aria-hidden="true" />
              Real Estate & Property Management
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Property Management IT for Tampa Bay Real Estate
            </h1>
            <p className="text-lg text-muted-foreground">
              MLS integration, property management systems, and tenant services — designed for the unique requirements of real estate and property management firms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Real Estate IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Real Estate Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Real Estate IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for real estate firms, from MLS integration to property management and tenant services.
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
              Why Real Estate Firms Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand the real estate industry&apos;s specific requirements for MLS integration, property management, and tenant services.
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
                Real Estate Technology Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for real estate and property management operations, MLS integration, and tenant services.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    MLS Integration
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Multiple MLS platform support
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Property listing synchronization
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Lead management integration
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      CRM system connectivity
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" aria-hidden="true" />
                    Property Access Systems
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Smart building access control
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Mobile key access
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Visitor management
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Security camera integration
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
              Real Estate IT FAQ
            </h2>
          </div>
          <FAQAccordion items={realEstateFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Real Estate IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your real estate firm&apos;s IT needs, from MLS integration to property management systems and tenant portals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Real Estate IT Consultation
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

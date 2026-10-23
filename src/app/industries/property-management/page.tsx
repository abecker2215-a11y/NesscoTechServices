import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Key, Building, Users, FileText, CheckCircle, Clock, Headset, Home, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Property Management | Tampa Bay",
  description: "IT support for Tampa Bay property management firms. Tenant portals, building access systems, lease management, and maintenance systems.",
  alternates: { canonical: "https://nesscotech.com/industries/property-management" },
  openGraph: {
    title: "IT Services for Property Management | Tampa Bay",
    description: "IT support for Tampa Bay property management. Tenant portals, building access systems, and lease management.",
    url: "https://nesscotech.com/industries/property-management",
  },
};

const propertyManagementFaqs = [
  { q: "Can you help with tenant portals?", a: "Yes. We implement tenant portals with rent payment, maintenance requests, document upload, and secure messaging for property managers." },
  { q: "How do you handle building access?", a: "We provide smart building access control, key card systems, and mobile access solutions for secure property access." },
  { q: "What lease management systems do you support?", a: "We support Buildertree, Iconic, and custom lease management systems with automated rent collection and renewal reminders." },
  { q: "Can you help with maintenance requests?", a: "Yes. We implement maintenance request systems with work order management, vendor coordination, and tracking." },
  { q: "How do you protect tenant data?", a: "We implement secure tenant databases with encryption, access controls, and compliance with state privacy laws." },
  { q: "Can you integrate with accounting software?", a: "Yes. We integrate property management systems with accounting software for seamless financial management." },
];

const services = [
  {
    icon: Users,
    title: "Tenant Portals",
    description: "Secure tenant portals with rent payment, maintenance requests, document upload, and communication features.",
  },
  {
    icon: Key,
    title: "Access Control",
    description: "Smart building access control, key card systems, and mobile access solutions for secure property access.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description: "Buildertree, Iconic, and custom lease management systems with automated rent collection and renewal reminders.",
  },
  {
    icon: Building,
    title: "Maintenance Systems",
    description: "Maintenance request systems, work order management, and vendor coordination for property management.",
  },
  {
    icon: DollarSign,
    title: "Financial Integration",
    description: "Integration with accounting software, rent collection systems, and financial reporting for property managers.",
  },
  {
    icon: Home,
    title: "Property Management Software",
    description: "Custom property management systems with CRM integration, tenant screening, and reporting capabilities.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Property Management Expertise",
    description: "We understand the property management industry's requirements for tenant services, building access, and lease management.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Tenant portals and maintenance systems available 24/7 for tenants and property managers.",
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

export default function PropertyManagementPage() {
  return (
    <>      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Property Management", path: "/industries/property-management" }])} />
      <JsonLd data={faqPageSchema(propertyManagementFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Key className="h-4 w-4" aria-hidden="true" />
              Property Management
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Property Management IT for Tampa Bay Property Managers
            </h1>
            <p className="text-lg text-muted-foreground">
              Tenant portals, building access systems, and lease management — designed specifically for the unique requirements of property management firms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Property Management IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Property Management Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Property Management IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for property management firms, from tenant portals to access control and lease management.
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
              Why Property Managers Choose Us
            </h2>
            <p className="text-muted-foreground">
We understand the property management industry&apos;s requirements for tenant services, building access, and lease management.
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
                Property Management Technology Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for property management firms, tenant portals, building access, and lease management.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                    Tenant Portals
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Online rent payment
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Maintenance requests
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Document upload
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure messaging
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" aria-hidden="true" />
                    Building Access
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Smart key card systems
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Mobile access solutions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Visitor management
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Security integration
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
              Property Management IT FAQ
            </h2>
          </div>
          <FAQAccordion items={propertyManagementFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Property Management IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your property management firm&apos;s IT needs, from tenant portals to building access systems and lease management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Property Management IT Consultation
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

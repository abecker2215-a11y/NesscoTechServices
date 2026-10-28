import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Server, Database, Lock, CheckCircle, Clock, Headset, Users, ShoppingCart, CreditCard, Wifi } from "lucide-react";

export const metadata: Metadata = {
  title: "Retail & E-Commerce IT | Tampa Bay",
  description: "Reliable IT support for Tampa Bay retail businesses. POS systems, payment processing, inventory management.",
  alternates: { canonical: "https://nesscotech.com/industries/retail" },
  openGraph: {
    title: "Retail & E-Commerce IT | Tampa Bay",
    description: "Reliable IT support for Tampa Bay retail businesses. POS systems, payment processing, inventory management.",
    url: "https://nesscotech.com/industries/retail",
  },
};

const retailFaqs = [
  { q: "Do you support POS systems?", a: "Yes. We support major POS systems including Square, Toast, Lightspeed, Clover, and custom POS implementations. We also handle payment processing integration." },
  { q: "How do you protect customer payment data?", a: "PCI DSS compliance: encrypted card readers, secure payment gateways, segmented networks, and regular security assessments." },
  { q: "Can you help with inventory management?", a: "Yes. We support inventory management systems, barcode scanners, and integration between POS and inventory systems." },
  { q: "What about customer Wi-Fi?", a: "We design and implement secure guest Wi-Fi with captive portals, bandwidth management, and network segmentation to protect business systems." },
  { q: "Do you support e-commerce platforms?", a: "Yes. We support Shopify, WooCommerce, Magento, and custom e-commerce platforms including hosting, security, and performance optimization." },
  { q: "Can you help with multi-location retail?", a: "Yes. We implement secure VPN connections, centralized management, and consistent systems across multiple retail locations." },
];

const services = [
  {
    icon: ShoppingCart,
    title: "POS System Support",
    description: "Installation, maintenance, and troubleshooting of point-of-sale systems and payment processing.",
  },
  {
    icon: CreditCard,
    title: "Payment Security",
    description: "PCI DSS compliance, encrypted card readers, secure payment gateways, and fraud prevention.",
  },
  {
    icon: Database,
    title: "Inventory Management",
    description: "Inventory systems, barcode scanners, and integration between POS and inventory platforms.",
  },
  {
    icon: Wifi,
    title: "Customer Wi-Fi",
    description: "Secure guest Wi-Fi with captive portals, bandwidth management, and network segmentation.",
  },
  {
    icon: Server,
    title: "E-Commerce Infrastructure",
    description: "Hosting, security, and performance optimization for Shopify, WooCommerce, and custom platforms.",
  },
  {
    icon: Shield,
    title: "Multi-Location Support",
    description: "Secure VPN connections, centralized management, and consistent systems across locations.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Payment Security",
    description: "PCI DSS compliance protects customer payment data and your business from liability.",
  },
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "POS systems and payment processing stay available during peak hours and sales events.",
  },
  {
    icon: Headset,
    title: "Retail-Experienced Support",
    description: "Our team understands retail workflows, peak seasons, and the stakes of POS downtime.",
  },
  {
    icon: Users,
    title: "Scalable Solutions",
    description: "From single locations to multi-store chains, we scale with your retail business.",
  },
];

export default function RetailPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Retail", path: "/industries/retail" }])} />
      <JsonLd data={faqPageSchema(retailFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              Retail & E-Commerce
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Reliable IT for Tampa Bay Retail Businesses
            </h1>
            <p className="text-lg text-muted-foreground">
              POS systems, payment security, inventory management, and customer-facing technology 
              — designed for the unique requirements of retail operations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Retail IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Retail Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Retail IT Services
            </h2>
            <p className="text-muted-foreground">
              Designed for POS reliability, payment security, and customer-facing technology requirements.
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
              Why Retail Businesses Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand retail workflows, peak seasons, and the critical importance of POS uptime.
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
                PCI DSS Compliance Framework
              </h2>
              <p className="text-muted-foreground">
                Security measures aligned with PCI DSS requirements to protect customer payment data.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Payment Security
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted card readers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure payment gateways
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Network segmentation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Regular security assessments
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                    Data Protection
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Encrypted cardholder data
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Access controls
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Audit logging
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                    Vulnerability management
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
              Retail IT FAQ
            </h2>
          </div>
          <FAQAccordion items={retailFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Retail IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your POS systems, payment security, 
              and retail-specific IT requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Retail IT Consultation
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

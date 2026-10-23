import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Utensils, MapPin, CheckCircle, Clock, Headset, Users, Building, Star, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Restaurants & Hospitality | Tampa Bay",
  description: "IT support for Tampa Bay restaurants and hospitality businesses. POS systems, payment security, reservation management, and guest Wi-Fi.",
  alternates: { canonical: "https://nesscotech.com/industries/hospitality" },
  openGraph: {
    title: "IT Services for Restaurants & Hospitality | Tampa Bay",
    description: "IT support for Tampa Bay restaurants and hospitality. POS systems, payment security, reservation management.",
    url: "https://nesscotech.com/industries/hospitality",
  },
};

const hospitalityFaqs = [
  { q: "Can you help with POS systems?", a: "Yes. We support Square POS, Lightspeed, Toast, and NCR systems with remote support, backups, and security monitoring. We also integrate third-party apps." },
  { q: "How do you handle payment security?", a: "We implement PCI DSS compliant payment systems, secure token storage, and regular security audits. We also provide tools for fraud detection and prevention." },
  { q: "What reservation systems do you support?", a: "We support OpenTable, Resy, Tabelog, and custom reservation systems with online booking, waitlist management, and integration with payment systems." },
  { q: "Can you help with guest Wi-Fi?", a: "Yes. We provide secure guest Wi-Fi with captive portal, user management, and analytics for guest usage tracking." },
  { q: "How do you support restaurant operations?", a: "We implement kitchen display systems, order management, and integration with inventory and accounting systems." },
  { q: "Can you help with loyalty programs?", a: "Yes. We integrate loyalty programs with POS systems and provide customer analytics for targeted marketing." },
];

const services = [
  {
    icon: CreditCard,
    title: "POS Systems",
    description: "Square POS, Lightspeed, Toast, and NCR systems with remote support, backups, and security monitoring.",
  },
  {
    icon: Shield,
    title: "Payment Security",
    description: "PCI DSS compliant payment systems, secure token storage, and fraud detection tools.",
  },
  {
    icon: Utensils,
    title: "Reservation Systems",
    description: "OpenTable, Resy integration, and custom booking systems with online booking and waitlist management.",
  },
  {
    icon: MapPin,
    title: "Guest Wi-Fi",
    description: "Secure guest Wi-Fi with captive portal, user management, and usage analytics.",
  },
  {
    icon: Building,
    title: "Restaurant Operations",
    description: "Kitchen display systems, order management, and integration with inventory and accounting.",
  },
  {
    icon: Star,
    title: "Loyalty Programs",
    description: "Customer loyalty integration with POS systems and analytics for targeted marketing.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Restaurant Expertise",
    description: "We understand the restaurant industry's requirements for POS, payment security, and guest services.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "POS systems and reservation systems available 24/7 with remote support during business hours.",
  },
  {
    icon: Headset,
    title: "Hospitality Experience",
    description: "Our team understands the hospitality industry's specific challenges and customer service requirements.",
  },
  {
    icon: Users,
    title: "Guest-Focused Technology",
    description: "Technology that enhances the guest experience and supports restaurant operations.",
  },
];

export default function HospitalityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Hospitality", path: "/industries/hospitality" }])} />
      <JsonLd data={faqPageSchema(hospitalityFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Utensils className="h-4 w-4" aria-hidden="true" />
              Restaurants & Hospitality
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT for Tampa Bay Restaurants & Hospitality
            </h1>
            <p className="text-lg text-muted-foreground">
              POS systems, payment security, reservation management, and guest Wi-Fi — designed specifically for the unique requirements of restaurants and hospitality businesses.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Hospitality IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Hospitality Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Hospitality IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for restaurants and hospitality, from POS systems to payment security and guest Wi-Fi.
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
              Why Hospitality Businesses Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand the hospitality industry&apos;s requirements for POS, payment security, and guest services.
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
                Hospitality Technology Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for restaurants and hospitality, POS systems, payment security, and guest Wi-Fi.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" aria-hidden="true" />
                    Point of Sale
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Square, Lightspeed, Toast support
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Remote support & backups
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Third-party app integration
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Customer loyalty integration
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Payment Security
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      PCI DSS compliance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Token storage
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Fraud detection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Regular security audits
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
              Hospitality IT FAQ
            </h2>
          </div>
          <FAQAccordion items={hospitalityFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Hospitality IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your restaurant or hospitality business&apos;s IT needs, from POS systems to payment security and guest Wi-Fi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Hospitality IT Consultation
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

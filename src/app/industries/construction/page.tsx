import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Server, Database, Lock, CheckCircle, Clock, Headset, Users, HardHat, Truck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Construction & Field Services | Tampa Bay",
  description: "Mobile IT support for Tampa Bay construction companies. Field service management, project tracking, and remote connectivity for job sites.",
  alternates: { canonical: "https://nesscotech.com/industries/construction" },
};

const constructionFaqs = [
  { q: "Do you support field service management software?", a: "Yes. We support Jobber, ServiceTitan, Housecall Pro, JobNimbus, and custom field service platforms. We also handle mobile device management." },
  { q: "How do you handle remote job sites?", a: "Cellular hotspots, satellite connectivity, VPN connections, and mobile device management for reliable job site connectivity." },
  { q: "Can you help with project management software?", a: "Yes. We support Procore, Autodesk Construction Cloud, Bluebeam, and custom project management systems including hosting and integration." },
  { q: "What about equipment tracking?", a: "We support GPS tracking systems, IoT sensors, and integration between field devices and management platforms." },
  { q: "Do you support mobile devices for field crews?", a: "Yes. We provide mobile device management (MDM), rugged device support, and secure access to field service apps." },
  { q: "Can you help with multi-site construction?", a: "Yes. We implement secure connections between job sites, central management, and consistent systems across multiple projects." },
];

const services = [
  {
    icon: Truck,
    title: "Field Service Management",
    description: "Support for field service platforms, mobile device management, and job site connectivity.",
  },
  {
    icon: MapPin,
    title: "Job Site Connectivity",
    description: "Cellular hotspots, satellite internet, VPN connections, and network design for remote sites.",
  },
  {
    icon: Database,
    title: "Project Management Infrastructure",
    description: "Hosting, security, and integration for Procore, Autodesk Construction Cloud, and custom systems.",
  },
  {
    icon: Shield,
    title: "Mobile Device Management",
    description: "MDM for field devices, app distribution, and secure access to field service applications.",
  },
  {
    icon: Server,
    title: "Equipment Tracking",
    description: "GPS tracking systems, IoT sensors, and integration between field devices and management platforms.",
  },
  {
    icon: Lock,
    title: "Multi-Site Coordination",
    description: "Secure connections between job sites, central management, and consistent project systems.",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Field Connectivity",
    description: "Reliable job site connectivity keeps field crews connected to office and project data.",
  },
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "Field service platforms and project management stay available across all job sites.",
  },
  {
    icon: Headset,
    title: "Construction-Experienced Support",
    description: "Our team understands construction workflows, job site challenges, and field service requirements.",
  },
  {
    icon: Users,
    title: "Scalable Solutions",
    description: "From single projects to multi-site operations, we scale with your construction business.",
  },
];

export default function ConstructionPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Construction", path: "/industries/construction" }])} />
      <JsonLd data={faqPageSchema(constructionFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <HardHat className="h-4 w-4" aria-hidden="true" />
              Construction & Field Services
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Mobile IT for Tampa Bay Construction Companies
            </h1>
            <p className="text-lg text-muted-foreground">
              Field service management, job site connectivity, and project tracking 
              — designed for the unique requirements of construction and field service operations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Construction IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Construction Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Construction IT Services
            </h2>
            <p className="text-muted-foreground">
              Designed for field service mobility, job site connectivity, and project management requirements.
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
              Why Construction Companies Choose Us
            </h2>
            <p className="text-muted-foreground">
              We understand construction workflows, job site challenges, and the critical importance of field connectivity.
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
                Field Mobility Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for construction field work, remote job sites, and mobile field crews.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                    Job Site Connectivity
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Cellular hotspots
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Satellite internet options
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      VPN connections
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Network design for remote sites
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                    Mobile Device Management
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      MDM for field devices
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      App distribution
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Secure app access
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Device tracking
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
              Construction IT FAQ
            </h2>
          </div>
          <FAQAccordion items={constructionFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Field IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your field service management, job site connectivity, 
              and construction-specific IT requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Construction IT Consultation
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

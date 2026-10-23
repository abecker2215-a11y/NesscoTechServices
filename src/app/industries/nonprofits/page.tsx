import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { Shield, Heart, Users, FileText, CheckCircle, Clock, Headset, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services for Nonprofits & Associations | Tampa Bay",
  description: "IT support for Tampa Bay nonprofits and associations. Donor management, grant tracking, compliance, and volunteer coordination.",
  alternates: { canonical: "https://nesscotech.com/industries/nonprofits" },
  openGraph: {
    title: "IT Services for Nonprofits & Associations | Tampa Bay",
    description: "IT support for Tampa Bay nonprofits and associations. Donor management, grant tracking, and volunteer coordination.",
    url: "https://nesscotech.com/industries/nonprofits",
  },
};

const nonprofitFaqs = [
  { q: "Can you help with donor management systems?", a: "Yes. We implement donor management systems like DonorPerfect, Bloomerang, and Aplos with secure online donation platforms, recurring giving, and donor tracking." },
  { q: "How do you handle grant compliance?", a: "We implement grant tracking systems with compliance monitoring, automated reporting, and secure documentation for all grant requirements and reporting deadlines." },
  { q: "What volunteer coordination systems do you support?", a: "We support VolunteerLocal, VolunteerNow, and custom volunteer management systems with scheduling, background checks, and volunteer tracking." },
  { q: "Can you help with IRS compliance?", a: "Yes. We implement 501(c)(3) compliance measures, Form 990 preparation assistance, and secure financial reporting for nonprofit organizations." },
  { q: "How do you protect donor data?", a: "We implement secure donor databases with encryption, access controls, and compliance with state and federal donor privacy laws." },
  { q: "Can you help with multi-state operations?", a: "Yes. We implement systems that support operations across multiple states with compliance tracking for each state's specific requirements." },
];

const services = [
  {
    icon: Heart,
    title: "Donor Management",
    description: "Secure donor databases, online donation platforms, and recurring giving systems with compliance tracking.",
  },
  {
    icon: Shield,
    title: "Grant Compliance",
    description: "Grant tracking systems, compliance monitoring, and automated reporting for all funding requirements.",
  },
  {
    icon: Users,
    title: "Volunteer Coordination",
    description: "Volunteer management systems with scheduling, background checks, and volunteer tracking capabilities.",
  },
  {
    icon: Building,
    title: "IRS Compliance",
    description: "501(c)(3) compliance measures, Form 990 assistance, and secure financial reporting.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure document storage for bylaws, board minutes, and compliance documentation.",
  },
  
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Nonprofit Expertise",
    description: "We understand the nonprofit sector's requirements for donor management, grant compliance, and volunteer coordination.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Donor management systems and volunteer portals available 24/7 for your supporters.",
  },
  {
    icon: Headset,
    title: "Nonprofit-Knowledgeable Support",
    description: "Our team understands the nonprofit industry's specific challenges and requirements.",
  },
  {
    icon: Users,
    title: "Mission-Focused Technology",
    description: "Technology that supports your mission and helps you make a difference in the community.",
  },
];

export default function NonprofitPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }, { name: "Nonprofits", path: "/industries/nonprofits" }])} />
      <JsonLd data={faqPageSchema(nonprofitFaqs)} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Nonprofits & Associations
            </div>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT for Tampa Bay Nonprofits & Associations
            </h1>
            <p className="text-lg text-muted-foreground">
              Donor management, grant tracking, and volunteer coordination — designed specifically for the unique requirements of nonprofits and associations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/contact">
              Schedule a Nonprofit IT Consultation
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              View Nonprofit Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
              Nonprofit IT Services
            </h2>
            <p className="text-muted-foreground">
              Comprehensive IT support for nonprofits, from donor management to grant compliance and volunteer coordination.
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
              Why Nonprofits Choose Us
            </h2>
            <p className="text-muted-foreground">
We understand the nonprofit sector&apos;s requirements for donor management, grant compliance, and volunteer coordination.
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
                Nonprofit Technology Framework
              </h2>
              <p className="text-muted-foreground">
                Solutions designed for nonprofits and associations, donor management, grant compliance, and volunteer coordination.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-background p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                    Donor Management
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Online donation platforms
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Recurring giving systems
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Donor tracking and reporting
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Event fundraising integration
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" aria-hidden="true" />
                    Grant Compliance
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Grant tracking systems
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Automated reporting
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Compliance monitoring
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" aria-hidden="true" />
                      Audit preparation
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
              Nonprofit IT FAQ
            </h2>
          </div>
          <FAQAccordion items={nonprofitFaqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Support Your Nonprofit IT?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your nonprofit&apos;s IT needs, from donor management to grant compliance and volunteer coordination.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Schedule Nonprofit IT Consultation
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

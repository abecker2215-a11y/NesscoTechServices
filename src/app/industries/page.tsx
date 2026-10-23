import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Stethoscope, Scale, ShoppingCart, HardHat, Calculator, Home, Heart, Utensils, Briefcase, Key, ArrowRight, CheckCircle, Clock, Headset, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve | Tampa Bay IT Services",
  description: "Specialized IT services for Healthcare, Legal, Retail, Construction, and other Tampa Bay industries. Industry-specific solutions and compliance expertise.",
  alternates: { canonical: "https://nesscotech.com/industries" },
  openGraph: {
    title: "Industries We Serve | Tampa Bay IT Services",
    description: "Specialized IT services for Healthcare, Legal, Retail, Construction, and other Tampa Bay industries.",
    url: "https://nesscotech.com/industries",
  },
};

const industries = [
  {
    slug: "healthcare",
    title: "Healthcare & Medical Practices",
    description: "HIPAA-compliant IT support for medical practices, EHR infrastructure, and patient data protection.",
    icon: Stethoscope,
    compliance: "HIPAA",
    color: "from-red-500 to-pink-500",
  },
  {
    slug: "legal",
    title: "Law Firms & Legal Practices",
    description: "Secure IT for law firms, client confidentiality, practice management, and document security.",
    icon: Scale,
    compliance: "Attorney-Client Privilege",
    color: "from-blue-500 to-indigo-500",
  },
  {
    slug: "retail",
    title: "Retail & E-Commerce",
    description: "POS systems, payment security, inventory management, and customer-facing technology.",
    icon: ShoppingCart,
    compliance: "PCI DSS",
    color: "from-green-500 to-emerald-500",
  },
  {
    slug: "construction",
    title: "Construction & Field Services",
    description: "Field service management, job site connectivity, and mobile device management.",
    icon: HardHat,
    compliance: "Mobile Security",
    color: "from-orange-500 to-amber-500",
  },
  {
    slug: "accounting",
    title: "Accounting & Tax Firms",
    description: "Secure tax software, client data protection, and compliance for CPA firms.",
    icon: Calculator,
    compliance: "IRS Pub 4557",
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "real-estate",
    title: "Real Estate & Property Management",
    description: "MLS systems, transaction management, and tenant portal technology.",
    icon: Home,
    compliance: "State Licensing",
    color: "from-cyan-500 to-blue-500",
  },
  {
    slug: "nonprofits",
    title: "Nonprofits & Associations",
    description: "Donor management, grant tracking, and secure volunteer coordination systems.",
    icon: Heart,
    compliance: "Data Privacy",
    color: "from-pink-500 to-rose-500",
  },
  {
    slug: "hospitality",
    title: "Restaurants & Hospitality",
    description: "POS, reservation systems, Wi-Fi for guests, and PCI-compliant payment processing.",
    icon: Utensils,
    compliance: "PCI DSS",
    color: "from-amber-500 to-orange-500",
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    description: "Document management, secure collaboration, and client portal solutions.",
    icon: Briefcase,
    compliance: "Data Privacy",
    color: "from-indigo-500 to-purple-500",
  },
  {
    slug: "property-management",
    title: "Property Management",
    description: "Tenant portals, maintenance tracking, and building access systems.",
    icon: Key,
    compliance: "Data Privacy",
    color: "from-slate-500 to-gray-500",
  },
];

const benefits = [
  {
    icon: CheckCircle,
    title: "Industry Expertise",
    description: "We understand your industry's unique workflows, compliance requirements, and technology challenges.",
  },
  {
    icon: Shield,
    title: "Compliance-Aligned",
    description: "Security measures and policies aligned with industry-specific regulations and standards.",
  },
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "Proactive monitoring and redundant systems keep your critical systems operational.",
  },
  {
    icon: Headset,
    title: "Specialized Support",
    description: "Support team with experience in your industry's specific applications and workflows.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Industry-Specific IT Solutions
            </h1>
            <p className="text-lg text-muted-foreground">
              Specialized IT services designed for the unique compliance, security, and operational requirements 
              of your industry.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="industries-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="industries-heading" className="text-3xl font-bold text-foreground mb-4">
              Industries We Serve
            </h2>
            <p className="text-muted-foreground">
              Choose your industry to see specialized solutions and compliance expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group p-8 rounded-xl border-2 border-border bg-background hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <industry.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{industry.description}</p>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      {industry.compliance}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">
              Why Choose Industry-Specific IT?
            </h2>
            <p className="text-muted-foreground">
              Generic IT support doesn&apos;t understand your industry&apos;s unique challenges.
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

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Don&apos;t See Your Industry?
            </h2>
            <p className="text-muted-foreground mb-8">
              We serve businesses across Tampa Bay. Contact us to discuss your industry-specific IT needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/contact">
                Contact Us About Your Industry
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


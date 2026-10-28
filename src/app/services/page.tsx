import { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { ServiceCard } from "@/components/services";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, serviceListSchema } from "@/lib/schemas";
import { Monitor } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services",
    description: "Managed IT, cybersecurity, cloud, network, IT support, backup & recovery for Tampa Bay businesses.",
  alternates: { canonical: "https://nesscotech.com/services" },
  openGraph: {
    title: "IT Services",
  description: "Managed IT, cybersecurity, cloud, network, IT support, backup & recovery for Tampa Bay businesses.",
    url: "https://nesscotech.com/services",
  },
};

const categories = [
  { id: "all", label: "All Services" },
  { id: "managed-it-services", label: "Managed IT Services" },
  { id: "it-security", label: "IT Security" },
  { id: "cloud-solutions", label: "Cloud Solutions" },
  { id: "network-server", label: "Network & Server" },
  { id: "it-support", label: "IT Support" },
  { id: "backup-disaster-recovery", label: "Backup & Disaster Recovery" },
  { id: "applications", label: "Applications" },
  { id: "communications", label: "Communications" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <JsonLd data={serviceListSchema(services)} />
      <section className="py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 id="services-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Our IT Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Each service has its own page with details, pricing, FAQs, and a direct link to start a service request.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Service categories">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={cat.id === "all" ? "#" : `#category-${cat.id}`}
                role="tab"
                aria-selected={cat.id === "all"}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat.id === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>

          {categories.slice(1).map((cat) => {
            const catServices = services.filter(
              (s) => s.slug === cat.id || s.slug.startsWith(`${cat.id}/`)
            );
            if (catServices.length === 0) return null;
            return (
              <div key={cat.id} id={`category-${cat.id}`} className="mb-16 scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">{cat.label}</h2>
                  <Link
                    href={`/services/category/${cat.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View {cat.label} overview →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catServices.map((service) => (
                    <ServiceCard key={service.slug} service={service} variant="grid" />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Prefer to fix it yourself first? We have 160+ free guides and 3-minute quick fixes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="outline" href="/guides">
                Browse Fix-It Guides
              </Button>
              <Button variant="outline" href="/fixes">
                Browse Quick Fixes
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Need something not listed? We handle custom projects too.
            </p>
            <Button variant="outline" href="/contact">
              Contact Us About a Custom Project
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="process-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="process-heading" className="text-3xl font-bold text-foreground mb-4">
              How Our IT Services Work
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to get your technology working again.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Monitor className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">1. Tell Us the Problem</h3>
              <p className="text-muted-foreground">
                Select a category, answer a few questions, and share your contact info. Takes under 2 minutes.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Monitor className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">2. We Diagnose & Quote</h3>
              <p className="text-muted-foreground">
                We contact you within 2 business hours, confirm the issue, and provide a clear estimate before any work.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Monitor className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">3. Fixed & Follow Up</h3>
              <p className="text-muted-foreground">
                We resolve the issue remotely or on-site. You approve the final invoice. We follow up to ensure everything works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-label="Schedule a call">
        <div className="container">
          <BookingEmbed
            title="Not sure which service you need? Book a 15-minute intro call"
            description="Tell us what's going on and we'll point you to the right service — or a free guide if you can fix it yourself."
          />
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/services";
import { getRelatedServices } from "@/lib/services";
import { getServiceHelpCategory } from "@/lib/services";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceQuoteSidebar } from "@/components/services/ServiceQuoteSidebar";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Co-Managed IT Services",
  description: "Partner with your in-house IT team for enterprise-level expertise, 24/7 monitoring, and strategic planning without replacing your staff.",
  alternates: { canonical: "https://nesscotech.com/services/managed-it-services/co-managed" },
  openGraph: {
    title: "Co-Managed IT Services | Nessco Tech Services",
    description: "Partner with your in-house IT team for enterprise-level expertise, 24/7 monitoring, and strategic planning without replacing your staff.",
    url: "https://nesscotech.com/services/managed-it-services/co-managed",
    type: "website",
  },
};

export default function CoManagedPage() {
  const service = getService("managed-it-services/co-managed");
  
  if (!service) {
    notFound();
  }
  
  const relatedServices = getRelatedServices(service.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Managed IT Services", path: "/services/managed-it-services" },
        { name: "Co-Managed IT Services", path: "/services/managed-it-services/co-managed" },
      ])} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqPageSchema(service.faqs)} />
      
      <ServiceHero service={service} />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-foreground mb-6">Co-Managed IT — The Problem</h2>
              <p className="text-lg text-muted-foreground mb-8">{service.problem}</p>

              <h3 className="text-xl font-semibold text-foreground mb-4">What We Do</h3>
              <ul className="space-y-3 text-muted-foreground mb-8">
                {service.whatWeDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-4">Who It&apos;s For</h3>
              <p className="text-muted-foreground mb-8">{service.whoItsFor}</p>

              <Button href={`/get-help?category=${getServiceHelpCategory(service.slug)}`} size="lg">
                Get Help with {service.title}
              </Button>
            </div>

            <ServiceQuoteSidebar service={service} />
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={service.faqs} />

      {relatedServices.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Often bundled with Co-Managed IT</h2>
              <p className="text-muted-foreground">Services commonly paired with Co-Managed IT</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <ServiceCard key={related.slug} service={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Let us partner with your in-house team to extend your capabilities without replacing your staff.
            </p>
            <Button size="lg" href={`/get-help?category=${getServiceHelpCategory(service.slug)}`}>
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

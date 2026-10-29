import { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { blogArticles } from "@/lib/blog";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { Briefcase, Shield, Database, Cable, Headset, HardDrive, Monitor, Mail } from "lucide-react";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, localBusinessSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { FAQItem } from "@/lib/types";

const managedFaqs: FAQItem[] = [
  {
    q: "What is included in managed IT services in Tampa?",
    a: "Proactive monitoring, patching, endpoint security, backup verification, helpdesk support, and IT strategy for Tampa businesses with 5-500 employees.",
  },
  {
    q: "How much do managed IT services cost in Tampa?",
    a: "Remote support starts at $75/hr and on-site support at $125/hr. Managed IT plans are quoted based on users, devices, and scope.",
  },
  {
    q: "Do you offer co-managed IT in Tampa?",
    a: "Yes. We partner with in-house IT teams to provide 24/7 coverage, security, and project support.",
  },
];

export const metadata: Metadata = {
  title: pageTitle("Managed IT Services in Tampa, FL"),
  description: metaDescription(
    "Managed IT services in Tampa, FL for businesses with 5-500 employees. 24/7 monitoring, cybersecurity, Microsoft 365, backups, and helpdesk. Remote from $75/hr."
  ),
  alternates: { canonical: "/managed-it-services-tampa" },
  openGraph: {
    title: pageTitle("Managed IT Services in Tampa, FL"),
    description: metaDescription(
      "Managed IT services in Tampa, FL. 24/7 monitoring, cybersecurity, Microsoft 365, backups, and helpdesk for growing businesses."
    ),
    url: "https://nesscotech.com/managed-it-services-tampa",
    type: "website",
  },
};

export default function ManagedItServicesTampaPage() {
  const tampaPosts = blogArticles.filter((a) =>
    [
      "it-support-tampa-bay-small-business",
      "it-helpdesk-tampa-bay",
      "it-consulting-tampa-bay",
      "microsoft-365-security-tampa",
      "cybersecurity-audit-tampa-bay",
    ].includes(a.slug)
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Managed IT Services in Tampa, FL", path: "/managed-it-services-tampa" }])} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqPageSchema(managedFaqs)} />
      <section className="py-16 lg:py-24" aria-labelledby="managed-heading">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
              Managed IT Services · Tampa, FL
            </p>
            <h1 id="managed-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Managed IT Services in Tampa, FL
            </h1>
            <p className="text-lg text-muted-foreground">
              Proactive IT management for Tampa businesses with 5-500 employees. Monitoring, security, backups, Microsoft 365, and helpdesk without the jargon.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button size="lg" href="/get-help">
              Get Help in Tampa
            </Button>
            <Button size="lg" variant="outline" href="/pricing">
              See Pricing
            </Button>
          </div>

          <div className="mx-auto mb-16 max-w-3xl rounded-xl border border-border bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">What we manage</h2>
            <ul className="space-y-2 text-muted-foreground" role="list">
              <li>24/7 monitoring and alert response</li>
              <li>Patching and proactive maintenance</li>
              <li>Endpoint security and email security</li>
              <li>Backup verification and disaster recovery</li>
              <li>Microsoft 365 management and support</li>
              <li>Virtual CIO and IT strategy</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Pricing: </span>
              Remote support from $75/hr, on-site from $125/hr. Managed plans quoted by scope.
            </p>
          </div>

          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">IT Services for Tampa Businesses</h2>
              <p className="text-muted-foreground">
                Every service below is available to Tampa businesses remotely or on-site.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { key: "managed-it-services", label: "Managed IT Services", icon: Briefcase },
                { key: "it-security", label: "IT Security", icon: Shield },
                { key: "cloud-solutions", label: "Cloud Solutions", icon: Database },
                { key: "network-server", label: "Network & Server", icon: Cable },
                { key: "it-support", label: "IT Support & Helpdesk", icon: Headset },
                { key: "backup-disaster-recovery", label: "Backup & Disaster Recovery", icon: HardDrive },
                { key: "applications", label: "Business Applications", icon: Monitor },
                { key: "communications", label: "Business Communications", icon: Mail },
              ].map((group) => {
                const groupServices = services.filter((s) => s.slug.split("/")[0] === group.key);
                if (groupServices.length === 0) return null;
                const Icon = group.icon;
                return (
                  <details key={group.key} className="group rounded-lg border border-border bg-background">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-foreground marker:content-none">
                      <span className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        {group.label} ({groupServices.length})
                      </span>
                      <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="grid grid-cols-1 gap-2 border-t border-border p-4 md:grid-cols-2 lg:grid-cols-3" role="list">
                      {groupServices.map((service) => (
                        <li key={service.slug}>
                          <Link href={`/services/${service.slug}`} className="block rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50 transition-colors">
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-background p-6 lg:p-8">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Tampa IT resources</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tampaPosts.map((a) => (
                  <a key={a.slug} href={`/blog/${a.slug}`} className="block rounded-lg border border-border p-3 hover:border-primary/50 transition-colors">
                    <span className="block text-sm font-medium text-foreground">{a.title}</span>
                    <span className="text-xs text-muted-foreground">{a.readTime}</span>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/it-support-tampa" className="font-medium text-primary hover:underline">IT support in Tampa</Link>
                {" · "}
                <Link href="/services/managed-it-services" className="font-medium text-primary hover:underline">Managed IT services</Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">
              Tampa Managed IT FAQ
            </h2>
          </div>
          <FAQAccordion items={managedFaqs} className="max-w-3xl mx-auto" />
          <div className="mt-10 text-center">
            <Button variant="outline" href="/contact">
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

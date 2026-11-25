import { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { getPublishedBySlugs } from "@/lib/blog-db";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { TrustSignalBarClient, LiveStatsClient } from "@/components/ui/TrustSignalsClient";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Briefcase, Shield, Database, Cable, Headset, HardDrive, Monitor, Mail } from "lucide-react";
import { Star, BadgeCheck, Users, Award } from "lucide-react";
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
    a: "Remote support starts at $75/hr and on-site support at $125/hr. Monthly managed plans are $89/user/mo (Essentials), $139/user/mo (Managed), and $189/user/mo (Complete), billed per user with device allowances.",
  },
  {
    q: "Do you offer co-managed IT in Tampa?",
    a: "Yes. We partner with in-house IT teams to provide 24/7 coverage, security, and project support.",
  },
  {
    q: "What is the difference between managed IT and break-fix?",
    a: "Managed IT is a flat monthly fee per user that includes monitoring, patching, security, and help desk support so problems are caught before they interrupt your business. Break-fix is hourly ($75/hr remote, $125/hr on-site) and only applies when something breaks.",
  },
  {
    q: "How quickly do you respond in Tampa?",
    a: "During business hours (Mon–Fri, 8am–6pm) we typically respond within 2 hours. Remote issues are often resolved the same day; on-site visits are scheduled at your convenience, typically next business day across Tampa and Hillsborough County.",
  },
  {
    q: "Do you serve small businesses with 5–500 employees?",
    a: "Yes. Our managed IT plans are built for Tampa businesses with 5–500 employees, from small professional offices to multi-location operations.",
  },
  {
    q: "Is there a long-term contract for managed IT?",
    a: "Managed plans are monthly with no long-term lock-in. Hourly break-fix support requires no commitment at all — you only pay for the time used.",
  },
];

export const metadata: Metadata = {
  title: pageTitle("Managed IT Services in Tampa, FL"),
  description: metaDescription(
    "Managed IT services in Tampa, FL for businesses with 5-500 employees. 24/7 monitoring, cybersecurity, Microsoft 365, backups, and helpdesk. Remote from $75/hr."
  ),
  alternates: { canonical: "https://nesscotech.com/managed-it-services-tampa" },
  openGraph: {
    title: pageTitle("Managed IT Services in Tampa, FL"),
    description: metaDescription(
      "Managed IT services in Tampa, FL. 24/7 monitoring, cybersecurity, Microsoft 365, backups, and helpdesk for growing businesses."
    ),
    url: "https://nesscotech.com/managed-it-services-tampa",
    type: "website",
  },
};

// Rendered per request: the page reads published posts from Postgres, which is
// not reachable during the Docker build.
export const dynamic = "force-dynamic";

export default async function ManagedItServicesTampaPage() {
  const tampaPosts = await getPublishedBySlugs([
    "it-support-tampa-bay-small-business",
    "it-helpdesk-tampa-bay",
    "it-consulting-tampa-bay",
    "microsoft-365-security-tampa",
    "cybersecurity-audit-tampa-bay",
  ]);

  return (
    <>
      <section className="relative hero-navy pt-0 sm:pt-0 lg:pt-0 pb-0 overflow-hidden" aria-hidden="true">
        <div className="relative w-full">
          <HeroBanner />
          <div className="absolute inset-0 bg-navy-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
        </div>
      </section>

      <LiveStatsClient />

      <TrustSignalBarClient />

      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <OpenStatus variant="inline" />
        <span aria-hidden="true">•</span>
        <span>Starting at $75</span>
        <span aria-hidden="true">•</span>
        <span>Remote & On-Site</span>
        <span aria-hidden="true">•</span>
        <span>Tampa Bay Area</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
          <span className="font-medium text-foreground">5.0★</span>
          <span>Google</span>
        </span>
        <span className="flex items-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Licensed & Insured</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>500+ Clients</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-warning" aria-hidden="true" />
          <span>Top Rated Tampa Bay</span>
        </span>
      </div>

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

          <div className="mx-auto mb-16 max-w-3xl rounded-xl border border-border bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Managed IT pricing for Tampa businesses</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Monthly plans are billed per user and include proactive monitoring, security, and
              help desk support. Hourly break-fix remains available for one-off needs.
            </p>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 font-medium text-foreground">Plan</th>
                  <th className="pb-3 font-medium text-foreground text-right">Price</th>
                  <th className="pb-3 font-medium text-foreground">Devices included</th>
                  <th className="pb-3 font-medium text-foreground">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 font-medium text-foreground">Essentials</td>
                  <td className="py-3 text-right text-foreground">$89/user/mo</td>
                  <td className="py-3 text-muted-foreground">Up to 10 devices</td>
                  <td className="py-3 text-muted-foreground">Small teams needing monitoring and help desk</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 font-medium text-foreground">Managed</td>
                  <td className="py-3 text-right text-foreground">$139/user/mo</td>
                  <td className="py-3 text-muted-foreground">Up to 25 devices</td>
                  <td className="py-3 text-muted-foreground">Growing businesses wanting full IT management</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 font-medium text-foreground">Complete</td>
                  <td className="py-3 text-right text-foreground">$189/user/mo</td>
                  <td className="py-3 text-muted-foreground">Unlimited devices</td>
                  <td className="py-3 text-muted-foreground">Businesses needing advanced security and vCIO</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-muted-foreground">
              Pay As You Go break-fix: remote support from $75/hr, on-site from $125/hr.
              {" "}
              <Link href="/pricing" className="text-primary hover:underline font-medium">
                See all pricing
              </Link>
            </p>
          </div>

          <div className="mx-auto mb-16 max-w-3xl rounded-xl border border-border bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Industries we serve in Tampa Bay</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We provide business IT support to Tampa companies across healthcare, legal, accounting,
              construction, real estate, retail, and professional services — with 5–500 employees.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground" role="list">
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Healthcare and medical offices — HIPAA-aware IT and backup</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Law firms — secure document and email management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Accounting and bookkeeping — reliable systems for tax season</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Construction and trades — field-office connectivity</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Real estate — transaction-ready networks and backups</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Retail — point-of-sale and guest Wi-Fi reliability</span>
              </li>
            </ul>
          </div>

          <div className="mx-auto mb-16 max-w-3xl rounded-xl border border-border bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Why Tampa businesses choose us</h2>
            <ul className="space-y-2 text-muted-foreground" role="list">
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Same-day remote support for Tampa businesses, Mon–Fri 8am–6pm</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Next-business-day on-site visits across Tampa and Hillsborough County</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Flat, per-user monthly pricing — no surprise invoices</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>No long-term lock-in on hourly break-fix support</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden="true">•</span>
                <span>Local Tampa team that understands your industry and your equipment</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Need cybersecurity, Microsoft 365 management, or backup and disaster recovery?
              {" "}
              <Link href="/services/it-security" className="text-primary hover:underline font-medium">
                IT security
              </Link>{" "}
              ·{" "}
              <Link href="/services/cloud-solutions/microsoft-365" className="text-primary hover:underline font-medium">
                Microsoft 365
              </Link>{" "}
              ·{" "}
              <Link href="/services/backup-disaster-recovery" className="text-primary hover:underline font-medium">
                Backup and DR
              </Link>
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

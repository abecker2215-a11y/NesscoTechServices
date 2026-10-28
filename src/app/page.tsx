import { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { HeroBanner } from "@/components/home/HeroBanner";
import { services } from "@/lib/services";
import { TrustSignalBarClient, LiveStatsClient } from "@/components/ui/TrustSignalsClient";
import { Testimonials } from "@/components/home/SocialProof";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { JsonLd } from "@/components/layout/JsonLd";
import { faqPageSchema } from "@/lib/schemas";
import { Monitor, Shield, Database, Briefcase, Check, Truck, MousePointer, CloudLightning, ArrowRight, Mail, Cable, Star, BadgeCheck, Users, Award, Headset, HardDrive, LayoutDashboard, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud for Tampa Bay Business",
  description: "Managed IT, cybersecurity, cloud, network and backup/disaster recovery services for Tampa Bay businesses. Proactive monitoring, 24/7 support, and IT strategy.",
  metadataBase: new URL("https://nesscotech.com"),
  alternates: {
    canonical: "https://nesscotech.com/",
  },
  openGraph: {
    url: "https://nesscotech.com/",
    siteName: "Nessco Tech Services",
    title: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud for Tampa Bay Business",
    description: "Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses. Proactive monitoring and 24/7 support.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud",
    description: "Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses.",
  },
  robots: { index: true, follow: true },
};

const serviceCategories = [
  { id: "managed-it-services", label: "Managed IT Services", icon: Briefcase, description: "Complete IT management, monitoring, and strategy." },
  { id: "it-security", label: "IT Security", icon: Shield, description: "Protect your business from cyber threats." },
  { id: "cloud-solutions", label: "Cloud Solutions", icon: CloudLightning, description: "Migrate and manage workloads in the cloud." },
  { id: "network-server", label: "Network & Server", icon: Cable, description: "Design, build, and manage your infrastructure." },
  { id: "it-support", label: "IT Support & Helpdesk", icon: Headset, description: "Responsive helpdesk and on-site support." },
  { id: "backup-disaster-recovery", label: "Backup & Disaster Recovery", icon: HardDrive, description: "Protect data and keep the business running." },
  { id: "applications", label: "Applications", icon: LayoutDashboard, description: "Host, migrate, and manage business applications." },
  { id: "communications", label: "Communications", icon: Mail, description: "Unified voice, video, and team messaging." },
].map((c) => ({
  ...c,
  count: services.filter((s) => s.slug === c.id || s.slug.startsWith(`${c.id}/`)).length,
}));

const whyChooseUs = [
  {
    title: "No Jargon, No Upsells",
    description: "We explain problems in plain English. You approve the work before we start. No surprise charges.",
  },
  {
    title: "Remote & On-Site Options",
      description: "Software issues? Remote from $75/hr. Hardware or cabling? We come to you from $125/hr.",
  },
  {
    title: "Business IT Expertise",
    description: "We support companies with 5-100 employees. Microsoft 365, networking, security, backups, and strategy.",
  },
  {
    title: "Transparent Pricing",
    description: "Hourly rates published online. Business plans with fixed monthly pricing. No long-term contracts required.",
  },
  {
    title: "Security-First Approach",
    description: "Every service includes basic security hygiene. We use encrypted connections and follow data-handling best practices.",
  },
];

const faqs = [
  {
    q: "What areas do you serve?",
    a: "We serve the Tampa Bay area including Tampa, St. Petersburg, Clearwater, Brandon, Riverview, and Lakeland. Remote support is available anywhere with an internet connection.",
  },
  {
    q: "Do you support both Windows and Mac?",
    a: "Yes. We support Windows 10/11, macOS, and Linux for most services. Some Microsoft 365 features are Windows-specific.",
  },
  {
    q: "How quickly can you respond?",
    a: "During business hours (Mon-Fri, 8am-6pm), we typically respond within 2 hours. Emergency after-hours support is available for managed clients.",
  },
  {
    q: "Do I need to sign a contract?",
    a: "No. Pay-as-you-go hourly work requires no contract. Monthly managed plans are month-to-month with 30-day cancellation.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit cards, ACH, and checks. Invoices are due on receipt for hourly work; monthly plans auto-bill.",
  },
  {
    q: "Can you help with compliance (HIPAA, PCI, SOC 2, etc.)?",
    a: "We implement technical controls for common frameworks (HIPAA, PCI DSS, SOC 2, CMMC). For formal attestation, we partner with specialized auditors.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />
<section className="relative hero-navy pt-0 sm:pt-0 lg:pt-0 pb-0 overflow-hidden" aria-labelledby="hero-heading">
            <div className="relative h-auto sm:h-[400px] lg:h-[600px] min-h-[160px] max-h-[60dvh] w-full rounded-2xl overflow-hidden">
            <HeroBanner />
            <div className="absolute inset-0 bg-navy-950/20 z-5" />
            <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center px-4 z-10" style={{ pointerEvents: 'none' }}>
              <div className="hero-copy px-4 sm:px-8 text-center max-w-3xl mx-auto z-10" style={{ pointerEvents: 'auto' }}>
                <div className="hidden sm:flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-none">
                  <a
                    href="/get-help"
                    className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white whitespace-nowrap w-full sm:w-auto sm:flex-shrink-0"
                    style={{ backgroundColor: 'rgba(10, 21, 48, 0.85)', borderColor: '#123378', borderStyle: 'solid', borderWidth: '1px' }}
                  >
                    Get Help
                  </a>
                  <a
                    href="/quote"
                    className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white whitespace-nowrap w-full sm:w-auto sm:flex-shrink-0"
                    style={{ backgroundColor: 'rgba(10, 21, 48, 0.85)', borderColor: '#123378', borderStyle: 'solid', borderWidth: '1px' }}
                  >
                    Request a Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      <section className="border-b border-border bg-primary/5" aria-label="Storm readiness check">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="flex items-center gap-3 text-sm text-foreground">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CloudLightning className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <strong>Hurricane season doesn&apos;t negotiate.</strong>{" "}
                <span className="text-muted-foreground">60-second check: would your files survive an outage?</span>
              </span>
            </p>
            <Button variant="outline" size="sm" href="/storm-ready" className="shrink-0">
              Check my score
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
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

          {/* Trust badges below stats */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
              <span className="font-medium text-foreground">4.9★</span>
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

      <section className="py-16 lg:py-24" aria-labelledby="how-it-works-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="how-it-works-heading" className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to get your technology working again.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MousePointer className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">1. Tell Us the Problem</h3>
              <p className="text-muted-foreground">
                Select a category, answer a few questions, and share your contact info. Takes under 2 minutes.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">2. We Diagnose & Quote</h3>
              <p className="text-muted-foreground">
                We contact you within 2 business hours, confirm the issue, and provide a clear estimate before any work.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">3. Fixed & Follow Up</h3>
              <p className="text-muted-foreground">
                We resolve the issue remotely or on-site. You approve the final invoice. We follow up to ensure everything works.
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="services-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="services-heading" className="fluid-3xl font-bold text-foreground mb-4">
              What Can We Help With?
            </h2>
            <p className="fluid-base text-muted-foreground">
              Browse our core service areas. Each area has its own page with details, pricing, and FAQs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8" role="list">
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <article key={cat.id} className="group">
                  <a
                    href={`/services/category/${cat.id}`}
                    className="block p-4 rounded-lg lift-hover border border-border bg-background hover:border-primary/50 hover:bg-muted/50 transition-colors h-full"
                  >
                    <div className="text-center">
                      <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{cat.label}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
          <div className="text-center">
            <Button variant="outline" href="/services">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="remote-onsite-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="remote-onsite-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Remote vs. On-Site Support
            </h2>
            <p className="fluid-lg text-muted-foreground">
              Choose the right option for your situation. Both include clear communication and upfront pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <article className="p-6 rounded-lg lift-hover border border-border bg-background">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MousePointer className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Remote Support</h3>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">Starting at $75/hr</div>
              <p className="text-muted-foreground mb-6">
                Secure remote desktop session. Ideal for software issues, configuration, and quick fixes.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6" role="list">
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> No travel time or trip charge</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Available same day in most cases</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> You watch everything we do</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Works anywhere with internet</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">Best for: email issues, software errors, browser problems, tune-ups, Microsoft 365 config, printer setup</p>
              <Button variant="outline" className="w-full" href="/get-help">
                Request Remote Help
              </Button>
            </article>
            <article className="p-6 rounded-lg lift-hover border border-border bg-background relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Truck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">On-Site Support</h3>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">Starting at $125/hr</div>
              <p className="text-muted-foreground mb-6">
                We come to your business in the Tampa Bay area. Required for hardware and cabling work.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6" role="list">
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Hardware repair & replacement</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Network cabling & Wi-Fi installation</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Device setup & data migration</li>
                <li className="flex items-center gap-2"><Check className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Server & rack work</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">Best for: broken screens, dead computers, network installs, new office setup, hardware upgrades</p>
              <Button className="w-full" href="/get-help">
                Schedule On-Site Visit
              </Button>
            </article>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="business-it-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="business-it-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Need IT Support for Your Business?
            </h2>
            <p className="fluid-lg text-muted-foreground">
              We manage technology for small businesses across Tampa Bay — so you can focus on your work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-lg lift-hover border border-border bg-background text-center">
              <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                <Briefcase className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Pay As You Go</h3>
              <p className="text-sm text-muted-foreground">Occasional help when something breaks. Hourly rates, no commitment.</p>
            </div>
            <div className="p-6 rounded-lg lift-hover border border-border bg-background text-center">
              <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                <Shield className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Essentials</h3>
              <p className="text-sm text-muted-foreground">Basic monitoring, patching, and help desk for small teams.</p>
            </div>
            <div className="p-6 rounded-lg lift-hover border border-border bg-background text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                <Monitor className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Managed</h3>
              <p className="text-sm text-muted-foreground">Full IT management: monitoring, security, backups, strategy.</p>
            </div>
            <div className="p-6 rounded-lg lift-hover border border-border bg-background text-center">
              <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                <Database className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Complete</h3>
              <p className="text-sm text-muted-foreground">Managed IT + advanced security, compliance, and vCIO guidance.</p>
            </div>
          </div>
          <div className="text-center">
            <Button variant="outline" href="/services/managed-it-services">
              Learn About Business IT Plans
            </Button>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="why-choose-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="why-choose-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Why Choose Nessco Tech Services?
            </h2>
            <p className="fluid-lg text-muted-foreground">
              We&apos;re a local team focused on honest, competent IT support for Tampa Bay businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <article key={index} className="p-6 rounded-lg lift-hover border border-border bg-background">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      <Testimonials />

      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="pricing-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="pricing-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="fluid-base text-muted-foreground">
              No hidden fees. No long-term contracts unless you want one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-6 rounded-lg lift-hover border border-border bg-background">
              <h3 className="text-xl font-semibold text-foreground mb-2">Remote IT Help</h3>
              <div className="text-4xl font-bold text-foreground mb-2">$75</div>
              <p className="text-muted-foreground mb-4">/ hour</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6" role="list">
                <li>• Secure remote desktop session</li>
                <li>• Software troubleshooting</li>
                <li>• Email & browser issues</li>
                <li>• Quick fixes & tune-ups</li>
              </ul>
              <Button variant="outline" className="w-full" href="/get-help">
                Request Remote Help
              </Button>
            </div>
            <div className="p-6 rounded-lg lift-hover border border-border bg-background relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">On-Site IT Help</h3>
              <div className="text-4xl font-bold text-foreground mb-2">$125</div>
              <p className="text-muted-foreground mb-4">/ hour</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6" role="list">
                <li>• We come to your business or office</li>
                <li>• Hardware repair & installation</li>
                <li>• Network cabling & Wi-Fi setup</li>
                <li>• Device setup & configuration</li>
              </ul>
              <Button className="w-full" href="/get-help">
                Schedule On-Site
              </Button>
            </div>
          </div>
          <div className="text-center">
            <Button variant="outline" href="/pricing">
              View Business Plans
            </Button>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <Reveal>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="faq-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="fluid-base text-muted-foreground">
              Quick answers to common questions. Can&apos;t find yours? <Link href="/contact" className="text-primary underline hover:text-primary/80">Contact us</Link>.
            </p>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
        </Reveal>
      </section>

      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="cta-heading">
        <Reveal>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="cta-heading" className="fluid-3xl font-bold text-foreground mb-4">
              Need IT Help Right Now?
            </h2>
            <p className="fluid-lg text-muted-foreground mb-8">
              Start a service request in under 2 minutes. We&apos;ll contact you within 2 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto min-h-[48px]" href="/get-help">
                Get Help Now
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px]" href="/contact">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        </Reveal>
      </section>
    </>
  );
}
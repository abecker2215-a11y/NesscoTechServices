import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { HeroBanner } from "@/components/home/HeroBanner";
import { services } from "@/lib/services";
import { TrustSignalBarClient, LiveStatsClient } from "@/components/ui/TrustSignalsClient";
import { Testimonials } from "@/components/home/SocialProof";
import { JsonLd } from "@/components/layout/JsonLd";
import { faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Shield, Monitor, Briefcase, DollarSign, Lock } from "lucide-react";

export const metadata: Metadata = {
    title: pageTitle("Managed IT Services & Cybersecurity for Tampa Bay Businesses"),
  description: metaDescription("Managed IT services, cybersecurity, Microsoft 365, network support, and helpdesk for Tampa Bay businesses. Proactive monitoring, 24/7 support."),
  metadataBase: new URL("https://nesscotech.com"),
  alternates: {
    canonical: "https://nesscotech.com/",
  },
  openGraph: {
    url: "https://nesscotech.com/",
    siteName: "Nessco Tech Services",
    title: pageTitle("Managed IT Services & Cybersecurity for Tampa Bay Businesses"),
    description: metaDescription("Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses. Proactive monitoring and 24/7 support."),
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://nesscotech.com/hero/homepage-hero.webp",
        width: 1200,
        height: 630,
        alt: "Nessco Tech Services — Managed IT Services & Cybersecurity Tampa Bay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle("Managed IT Services & Cybersecurity for Tampa Bay Businesses"),
    description: metaDescription("Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses."),
  },
  robots: { index: true, follow: true },
};

const serviceCategories = [
  {
    id: "managed-it-services",
    label: "Managed IT Services",
    image: "/services-images/managed-it-services.webp",
    description: "Complete IT management, monitoring, and strategy.",
  },
  {
    id: "it-security",
    label: "IT Security",
    image: "/services-images/it-security.webp",
    description: "Protect your business from cyber threats.",
  },
  {
    id: "cloud-solutions",
    label: "Cloud Solutions",
    image: "/services-images/cloud-solutions.webp",
    description: "Migrate and manage workloads in the cloud.",
  },
  {
    id: "network-server",
    label: "Network & Server",
    image: "/services-images/network-server.webp",
    description: "Design, build, and manage your infrastructure.",
  },
  {
    id: "it-support",
    label: "IT Support & Helpdesk",
    image: "/services-images/it-support.webp",
    description: "Responsive helpdesk and on-site support.",
  },
  {
    id: "backup-disaster-recovery",
    label: "Backup & Disaster Recovery",
    image: "/services-images/backup-disaster-recovery.webp",
    description: "Protect data and keep the business running.",
  },
  {
    id: "applications",
    label: "Applications",
    image: "/services-images/applications.webp",
    description: "Host, migrate, and manage business applications.",
  },
  {
    id: "communications",
    label: "Communications",
    image: "/services-images/communications.webp",
    description: "Unified voice, video, and team messaging.",
  },
].map((c) => ({
  ...c,
  count: services.filter((s) => s.slug === c.id || s.slug.startsWith(`${c.id}/`)).length,
}));

const whyChooseUs = [
  {
    icon: Shield,
    title: "No Jargon, No Upsells",
    description: "We explain problems in plain English. You approve the work before we start. No surprise charges.",
  },
  {
    icon: Monitor,
    title: "Remote & On-Site Options",
      description: "Software issues? Remote from $75/hr. Hardware or cabling? We come to you from $125/hr.",
  },
  {
    icon: Briefcase,
    title: "Business IT Expertise",
    description: "We support companies with 5-100 employees. Microsoft 365, networking, security, backups, and strategy.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Hourly rates published online. Business plans with fixed monthly pricing. No long-term contracts required.",
  },
  {
    icon: Lock,
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
        <div className="relative w-full">
          <HeroBanner />
          <div className="absolute inset-0 bg-navy-950/20" />
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-center px-4 z-10" style={{ pointerEvents: 'none' }}>
            <div className="hero-copy px-4 sm:px-8 text-center max-w-3xl mx-auto z-10" style={{ pointerEvents: 'auto' }}>
              <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6 sr-only">
                Managed IT Services & Cybersecurity for Tampa Bay Businesses
              </h1>
              <div className="hidden sm:flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-none">
                <Link
                  href="/quote"
                  className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white whitespace-nowrap w-full sm:w-auto sm:flex-shrink-0"
                  style={{ backgroundColor: 'rgba(10, 21, 48, 0.85)', borderColor: '#123378', borderStyle: 'solid', borderWidth: '1px' }}
                >
                  Get a Managed IT Quote
                </Link>
                <Link
                  href="/get-help"
                  className="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white whitespace-nowrap w-full sm:w-auto sm:flex-shrink-0"
                  style={{ backgroundColor: 'rgba(10, 21, 48, 0.6)', borderColor: '#123378', borderStyle: 'solid', borderWidth: '1px' }}
                >
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveStatsClient />

        <TrustSignalBarClient />

        <section className="py-16 lg:py-24">
        <Reveal>
        <div className="container">
          <div className="sr-only">
            <h2>How It Works: Get Help in 3 Steps</h2>
            <p>Three simple steps to get your technology working again.</p>
          </div>
          <Link
            href="/get-help/step-1"
            className="block relative aspect-[8/3] w-full overflow-hidden rounded-lg bg-background ring-1 ring-border transition-[box-shadow,border-color] duration-300 hover:ring-4 hover:ring-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label="Get Help - Step 1: Tell Us the Problem"
          >
            <Image
              src="/services-images/how-it-works.webp"
              alt="How It Works: Get Help in 3 Steps — Three simple steps: Tell Us the Problem, We Diagnose & Quote, Fixed & Follow Up"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </Link>
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
            {serviceCategories.map((cat) => (
              <article key={cat.id} className="group overflow-hidden rounded-lg border border-border bg-background lift-hover transition-all hover:border-primary/50">
                <a
                  href={`/services/category/${cat.id}`}
                  className="block h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-semibold text-sm">{cat.label}</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-foreground mb-1">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                    {cat.count > 0 && (
                      <p className="text-xs text-primary font-medium mt-2">{cat.count} service{cat.count !== 1 ? "s" : ""}</p>
                    )}
                  </div>
                </a>
              </article>
            ))}
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
            <article className="relative group rounded-lg">
              <div className="sr-only">
                <h3>Remote IT Support</h3>
                <p>Secure remote desktop sessions starting at $75/hr for software issues, configuration, and quick fixes.</p>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
                <Image
                  src="/services-images/remote-support.webp"
                  alt="Remote Support — secure remote desktop sessions starting at $75/hr for software issues, configuration, and quick fixes"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Link
                  href="/get-help"
                  className="absolute left-[24%] right-[24%] bottom-[2.5%] h-[8%] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Request Remote Help"
                />
              </div>
            </article>
            <article className="relative group rounded-lg">
              <div className="sr-only">
                <h3>On-Site IT Support</h3>
                <p>Hardware repair, network cabling, and device setup starting at $125/hr in the Tampa Bay area.</p>
              </div>
              <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
                <Image
                  src="/services-images/on-site-support.webp"
                  alt="On-Site Support — hardware repair, network cabling, and device setup starting at $125/hr in the Tampa Bay area"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Link
                  href="/get-help"
                  className="absolute left-[24%] right-[24%] bottom-[2.5%] h-[8%] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Schedule On-Site Visit"
                />
              </div>
            </article>
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
                <div className="mx-auto mb-3 p-3 rounded-lg bg-primary/10 text-primary w-fit">
                  <item.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      <Testimonials />

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

      <section className="py-8" aria-label="Tampa IT support">
        <div className="container text-center">
          <Link href="/it-support-tampa" className="font-medium text-primary hover:underline mr-4">IT support in Tampa</Link>
          <Link href="/managed-it-services-tampa" className="font-medium text-primary hover:underline">Managed IT services in Tampa</Link>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="tampa-bay-services-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="tampa-bay-services-heading" className="fluid-3xl font-bold text-foreground mb-4">
              IT Services for Tampa Bay Businesses
            </h2>
              <p className="fluid-lg text-muted-foreground mb-8">
                Proactive managed IT, cybersecurity, Microsoft 365, network support, and helpdesk services for Tampa Bay businesses. Remote support from $75/hr, on-site from $125/hr.
              </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/services" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">All services</Link>
              <Link href="/services/it-support" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">IT support</Link>
              <Link href="/services/network-server" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">Network support</Link>
              <Link href="/services/cloud-solutions/microsoft-365" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">Microsoft 365</Link>
              <Link href="/it-support-tampa" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">IT support in Tampa</Link>
              <Link href="/managed-it-services-tampa" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">Managed IT in Tampa</Link>
            </div>
          </div>
        </div>
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
              <Button size="lg" className="w-full sm:w-auto min-h-[48px]" href="/quote">
                Get a Managed IT Quote
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px]" href="/get-help">
                Get Help
              </Button>
            </div>
          </div>
        </div>
        </Reveal>
      </section>
    </>
  );
}
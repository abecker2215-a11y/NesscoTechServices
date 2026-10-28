import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, Shield, TrendingUp, HardHat, Wifi, AlertTriangle, Network } from "lucide-react";

export const metadata: Metadata = {
    title: "Construction Company: Job-Site Network & Wi-Fi Case Study",
  description: "Standardized network and Wi-Fi across multiple construction job sites, enabling POS, inventory scanners, and mobile device management.",
  alternates: { canonical: "/case-studies/construction-job-site-network" },
  openGraph: {
  title: "Construction Company: Job-Site Network & Wi-Fi Case Study",
    description: "Standardized network and Wi-Fi across construction job sites.",
    url: "https://nesscotech.com/case-studies/construction-job-site-network",
  },
};

const faqs = [
  {
    q: "Can you install network cabling at active construction sites?",
    a: "Yes. We run CAT6/CAT6a cabling, configure access points, and set up temporary network infrastructure that can be relocated as the job site evolves.",
  },
  {
    q: "Do you support mobile devices and tablets for field crews?",
    a: "Yes. We configure mobile device management, secure Wi-Fi access, and VPN connectivity so field staff can access plans, specs, and project management tools from the site.",
  },
  {
    q: "What about temporary internet for the construction office?",
    a: "We arrange business-class internet, failover connections (4G/5G backup), and router/firewall setup so the trailer office stays online even if the primary circuit drops.",
  },
];

export default function ConstructionCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "Construction Company: Job-Site Network & Wi-Fi",
        description: "Standardized network and Wi-Fi across multiple construction job sites, enabling POS, inventory scanners, and mobile device management.",
        about: "Construction",
        location: "Tampa, FL",
        datePublished: "2025-04-03",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "Standardized network across active job sites",
          "POS and inventory scanners connected reliably",
          "Mobile device management for field crews",
          "Centralized visibility across all locations",
        ],
      }} />

      <section className="py-16 lg:py-24">
        <div className="container">
          <Reveal>
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/case-studies" className="hover:text-foreground">Case Studies</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground" aria-current="page">Construction Job-Site Network</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 text-orange-600 px-4 py-1.5 text-sm font-medium mb-6">
                <HardHat className="h-4 w-4" aria-hidden="true" />
                Construction &middot; Tampa, FL &middot; Job-Site Connectivity
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Job-Site Network &amp; Wi-Fi Overhaul
              </h1>
              <p className="text-lg text-muted-foreground">
                A growing construction company needed reliable network connectivity across active job sites — for POS systems, inventory scanners, and mobile device management for field crews.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Phased</p>
                <p className="text-muted-foreground">Deployment per site</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Wifi className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Enterprise</p>
                <p className="text-muted-foreground">Wi-Fi &amp; cabling standard</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Field &amp; Office</p>
                <p className="text-muted-foreground">Staff connected</p>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="max-w-3xl mx-auto space-y-10 mb-16">
              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-600" aria-hidden="true" />
                  The Challenge
                </h2>
                <p className="text-muted-foreground mb-4">
                  A Tampa-area construction company was expanding across multiple active job sites. Each site had a different consumer-grade router setup, no consistent Wi-Fi coverage, and no way to connect inventory scanners or mobile devices to project management tools.
                </p>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Consumer routers at each site with no central management</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Dead zones in trailers, back offices, and material storage areas</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> POS and inventory scanners dropped connection during busy periods</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Field crews couldn&rsquo;t access project plans or specs from tablets on site</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No visibility into network health — problems found only when crews reported them</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Each new job site meant re-solving the same networking problems from scratch. They needed a standardized, repeatable approach that could be deployed quickly as they took on new projects.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Network className="h-6 w-6 text-primary" aria-hidden="true" />
                  Our Solution
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                    <div>
                      <p className="font-medium text-foreground">Site Survey &amp; Design</p>
                      <p>Surveyed each active job site and trailer office. Spec&apos;d enterprise access points, PoE switches, and CAT6a cabling for temporary and semi-permanent installations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">Standardized Build Template</p>
                      <p>Created one network template applied to every site: Management, POS/Inventory, Staff, and Guest VLANs with role-based access and bandwidth limits.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">Rapid Deployment</p>
                      <p>Ran cabling, mounted access points, and configured each site in hours rather than days. Used failover 4G/5G backup so trailer offices stayed online if the primary circuit dropped.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">Mobile Device &amp; Training</p>
                      <p>Configured tablets and phones for secure Wi-Fi and MDM access. Trained foremen and office staff on connecting devices and troubleshooting common issues.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  Outcomes
                </h2>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Reliable job-site connectivity</p>
                      <p className="text-sm">POS systems, inventory scanners, and mobile devices stay connected across active work zones.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Centralized visibility</p>
                      <p className="text-sm">One dashboard shows network health across all job sites — issues caught before crews report them.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Faster site setup</p>
                      <p className="text-sm">New job sites deploy using the same template, cutting network setup time significantly.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Mobile access to project data</p>
                      <p className="text-sm">Field crews access plans, specs, and project management tools from tablets and phones on site.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Construction Network FAQ</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Multiple job sites? Let&apos;s standardize.</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll survey your sites and give you a fixed-price proposal with centralized network management.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/get-help?category=wifi">Request Site Survey</Button>
                <Button size="lg" variant="outline" href="/case-studies">View All Case Studies</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

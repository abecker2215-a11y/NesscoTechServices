import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, Shield, TrendingUp, Calculator, Lock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "CPA Firm: QuickBooks Hosting & Data Security Case Study",
  description: "Migrated a CPA firm to hosted QuickBooks with secure remote access, tax-season uptime, and client data protection.",
  alternates: { canonical: "/case-studies/cpa-firm-quickbooks-hosting" },
  openGraph: {
  title: "CPA Firm: QuickBooks Hosting & Data Security Case Study",
    description: "CPA firm migrated to hosted QuickBooks with secure remote access and client data protection.",
    url: "https://nesscotech.com/case-studies/cpa-firm-quickbooks-hosting",
  },
};

const faqs = [
  {
    q: "Is hosted QuickBooks secure for client financial data?",
    a: "Hosted QuickBooks is secure when configured with encrypted storage, access controls, MFA, and regular backups. We also support compliance with IRS Publication 4557 safeguarding requirements.",
  },
  {
    q: "Can multiple users access QuickBooks at the same time?",
    a: "Yes. Hosted QuickBooks supports concurrent multi-user access with role-based permissions, so accountants and staff can work simultaneously from any location.",
  },
  {
    q: "What happens during tax season if the system goes down?",
    a: "We provision redundant capacity, monitored backups, and priority support during tax season so the firm stays online when it matters most.",
  },
];

export default function CpaFirmCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "CPA Firm: QuickBooks Hosting & Data Security",
        description: "Migrated a CPA firm to hosted QuickBooks with secure remote access, tax-season uptime, and client data protection.",
        about: "Financial Services",
        location: "Lakeland, FL",
        datePublished: "2025-02-14",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "Migrated to hosted QuickBooks with secure remote access",
          "Tax-season uptime with monitored backups",
          "Client financial data protected with encryption and MFA",
          "IRS Publication 4557-aligned safeguards in place",
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
              <span className="text-foreground" aria-current="page">CPA Firm QuickBooks Hosting</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-600 px-4 py-1.5 text-sm font-medium mb-6">
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Accounting &middot; Lakeland, FL &middot; Tax Season Ready
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                QuickBooks Hosting &amp; Data Security
              </h1>
              <p className="text-lg text-muted-foreground">
                A CPA firm needed secure, always-on access to QuickBooks during tax season — with client financial data protected and remote access for accountants working off-site.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Tax-Season</p>
                <p className="text-muted-foreground">Uptime Monitored</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Lock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Encrypted</p>
                <p className="text-muted-foreground">Client data at rest &amp; in transit</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Remote &amp; Office</p>
                <p className="text-muted-foreground">Staff access QuickBooks anywhere</p>
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
                  A Lakeland CPA firm ran QuickBooks on a single office computer. During tax season, that became a bottleneck — only one person could work at a time, remote access was unreliable, and client financial data sat on an unsecured desktop with no tested backups.
                </p>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Single-user QuickBooks on one office PC — bottleneck during tax season</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No reliable remote access for accountants working off-site</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Client financial data on an unencrypted desktop with no tested restore process</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No MFA or role-based access controls on financial data</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Risk of missing IRS Publication 4557 safeguarding expectations</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  With tax season approaching, they needed a solution that let multiple accountants work securely from anywhere — without risking client data.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                  Our Solution
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                    <div>
                      <p className="font-medium text-foreground">Hosted QuickBooks Migration</p>
                      <p>Migrated company files to a hosted QuickBooks environment with encrypted storage, daily automated backups, and tested restore procedures.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">Secure Remote Access</p>
                      <p>Configured VPN with MFA so accountants could access QuickBooks securely from home, client sites, or while traveling.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">Access Controls &amp; MFA</p>
                      <p>Applied role-based permissions and multi-factor authentication so only authorized staff could view or edit client financial data.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">Tax-Season Readiness</p>
                      <p>Provisioned redundant capacity, monitored system health, and established priority support windows ahead of the filing deadline.</p>
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
                      <p className="font-medium text-foreground">Multi-user QuickBooks access</p>
                      <p className="text-sm">Accountants work concurrently from office, home, or client sites — no more single-user bottleneck.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Client data protected</p>
                      <p className="text-sm">Encrypted storage, MFA, and role-based access align with IRS Publication 4557 safeguarding expectations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Tax-season confidence</p>
                      <p className="text-sm">Monitored backups and priority support kept the firm online through peak filing season.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Tested restore process</p>
                      <p className="text-sm">Automated backups verified with periodic test restores — data loss exposure reduced to hours, not days.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Accounting IT FAQ</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Getting ready for tax season?</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll assess your QuickBooks setup, remote access, and data security — and give you a fixed-price plan.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/get-help?category=business">Schedule Accounting IT Assessment</Button>
                <Button size="lg" variant="outline" href="/case-studies">View All Case Studies</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

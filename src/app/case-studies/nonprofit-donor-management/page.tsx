import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, Shield, TrendingUp, Heart, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Nonprofit: Donor Management & Data Security Case Study",
  description: "Helped a nonprofit secure donor data, improve grant tracking reliability, and protect volunteer coordination systems.",
  alternates: { canonical: "/case-studies/nonprofit-donor-management" },
  openGraph: {
  title: "Nonprofit: Donor Management & Data Security Case Study",
    description: "Nonprofit secured donor data and improved grant tracking reliability.",
    url: "https://nesscotech.com/case-studies/nonprofit-donor-management",
  },
};

const faqs = [
  {
    q: "How do you protect donor data?",
    a: "We use encrypted storage, role-based access controls, MFA, and audit logging — so donor records and payment information are protected at rest and in transit.",
  },
  {
    q: "Can volunteers access systems remotely?",
    a: "Yes. We configure secure remote access with least-privilege permissions so volunteers can coordinate events and update records without exposing sensitive data.",
  },
  {
    q: "What about grant reporting and audit trails?",
    a: "We implement logging and retention policies so the organization can demonstrate compliance with grant requirements and funder audits.",
  },
];

export default function NonprofitCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "Nonprofit: Donor Management & Data Security",
        description: "Helped a nonprofit secure donor data, improve grant tracking reliability, and protect volunteer coordination systems.",
        about: "Nonprofits",
        location: "St. Petersburg, FL",
        datePublished: "2025-05-19",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "Donor data secured with encryption and access controls",
          "Grant tracking system made more reliable",
          "Volunteer coordination systems protected",
          "Audit-ready logging and retention in place",
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
              <span className="text-foreground" aria-current="page">Nonprofit Donor Management</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 text-pink-600 px-4 py-1.5 text-sm font-medium mb-6">
                <Heart className="h-4 w-4" aria-hidden="true" />
                Nonprofits &middot; St. Petersburg, FL &middot; Donor Data Security
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Donor Management &amp; Data Security
              </h1>
              <p className="text-lg text-muted-foreground">
                A St. Petersburg nonprofit needed to protect donor records, improve grant tracking reliability, and give volunteers secure access to coordination systems.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Donor Data</p>
                <p className="text-muted-foreground">Encrypted &amp; Access-Controlled</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Grant Tracking</p>
                <p className="text-muted-foreground">More Reliable Reporting</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">Volunteers</p>
                <p className="text-muted-foreground">Secure Remote Coordination</p>
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
                  A St. Petersburg nonprofit stored donor records and grant information on shared spreadsheets and a single office computer. Volunteer coordination relied on email, and there was no clear process for who could access what — or what would happen if the office computer failed.
                </p>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Donor records on spreadsheets with no access controls or encryption</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Grant tracking in disconnected documents — easy to miss deadlines or duplicate entries</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Volunteers shared login credentials to access coordination systems</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No backups — a single hardware failure could lose years of donor history</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Uncertainty about meeting funder data-protection expectations</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  With a major fundraising campaign and several grant applications approaching, they needed dependable systems and clearer data governance.
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
                      <p className="font-medium text-foreground">Donor Management System</p>
                      <p>Moved donor records to a secure, access-controlled platform with encrypted storage and audit logging for every record view or edit.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">Grant Tracking &amp; Reporting</p>
                      <p>Centralized grant deadlines, requirements, and reporting in one system with reminders and status tracking so nothing falls through the cracks.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">Volunteer Access &amp; Coordination</p>
                      <p>Configured individual volunteer accounts with least-privilege permissions and MFA — no more shared logins.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">Backups &amp; Continuity</p>
                      <p>Automated daily backups with tested restores, so donor history and grant records survive any hardware failure.</p>
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
                      <p className="font-medium text-foreground">Donor data protected</p>
                      <p className="text-sm">Encrypted storage, role-based access, and audit logs safeguard donor records and payment information.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Reliable grant tracking</p>
                      <p className="text-sm">Centralized deadlines and status tracking help the team submit applications on time and meet funder expectations.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Secure volunteer coordination</p>
                      <p className="text-sm">Individual accounts with MFA let volunteers contribute safely without sharing credentials.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Audit-ready records</p>
                      <p className="text-sm">Logging and retention policies make it easier to demonstrate compliance with grant and funder requirements.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Nonprofit IT FAQ</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Protecting your mission&apos;s data?</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll review your donor management, grant tracking, and volunteer systems — and recommend practical, budget-conscious improvements.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/get-help?category=business">Schedule Nonprofit IT Review</Button>
                <Button size="lg" variant="outline" href="/case-studies">View All Case Studies</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

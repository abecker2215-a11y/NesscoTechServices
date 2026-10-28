import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, Shield, CloudLightning, TrendingUp, Laptop } from "lucide-react";

export const metadata: Metadata = {
    title: "Law Firm Microsoft 365 Migration Case Study",
  description: "Law firm migrated from GoDaddy to Microsoft 365 with zero downtime, 30% cost savings, and MFA security.",
  alternates: { canonical: "/case-studies/law-firm-m365-migration" },
  openGraph: {
  title: "Law Firm Microsoft 365 Migration Case Study",
    description: "Law firm migrated from GoDaddy to Microsoft 365 with zero downtime.",
    url: "https://nesscotech.com/case-studies/law-firm-m365-migration",
  },
};

const faqs = [
  {
    q: "How long does a typical Microsoft 365 migration take?",
    a: "For firms up to 50 users, we typically complete migrations over a weekend. Larger organizations may need phased approaches. We always provide a detailed timeline before starting.",
  },
  {
    q: "What happens to our old emails and contacts?",
    a: "Everything migrates — emails, folders, contacts, calendars, and shared mailboxes. We verify 100% data integrity before cutting over.",
  },
  {
    q: "Do you provide training after the migration?",
    a: "Yes. We include a 1-hour team training session covering Outlook, Teams, OneDrive, and SharePoint best practices. We also provide quick-reference guides.",
  },
];

export default function LawFirmCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "12-Person Law Firm: Zero-Downtime Microsoft 365 Migration",
        description: "Migrated from GoDaddy Workspace to Microsoft 365 with zero downtime, MFA enforcement, and 30% license cost reduction.",
        about: "Legal Services",
        location: "Tampa, FL",
        datePublished: "2025-03-15",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "Zero downtime — Monday morning business as usual",
          "Email reliability improved from 85% to 99.9%",
          "MFA blocked 3 breach attempts in first month",
          "Monthly IT costs reduced 30% after license cleanup",
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
              <span className="text-foreground" aria-current="page">Law Firm M365 Migration</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Legal · Tampa, FL
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Zero-Downtime Microsoft 365 Migration for 12-Person Law Firm
              </h1>
              <p className="text-lg text-muted-foreground">
                Migrated from legacy GoDaddy Workspace to Microsoft 365 over a weekend — no lost emails, no disrupted billable hours, MFA enforced day one.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center lift-hover">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">2 Days</p>
                <p className="text-muted-foreground">Total project time</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center lift-hover">
                <DollarSign className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">$2,400/yr</p>
                <p className="text-muted-foreground">License cost savings</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center lift-hover">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-muted-foreground">Attorneys & staff migrated</p>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Before & After Metrics</h2>
              <div className="rounded-xl border-2 border-border bg-background p-6 lg:p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Email Reliability</span>
                      <span className="text-sm font-bold text-success">85% → 99.9%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full" style={{ width: '99.9%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Monthly Outages</span>
                      <span className="text-sm font-bold text-success">3-4 → 0</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Security Level</span>
                      <span className="text-sm font-bold text-success">No MFA → MFA Enforced</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Monthly IT Cost</span>
                      <span className="text-sm font-bold text-success">$800 → $560</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto space-y-10 mb-16">
              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Laptop className="h-6 w-6 text-primary" aria-hidden="true" />
                  The Challenge
                </h2>
                <p className="text-muted-foreground mb-4">
                  A 12-attorney law firm in downtown Tampa was running on GoDaddy&apos;s legacy Workspace email. They faced daily frustrations:
                </p>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Frequent email outages (3-4 per month)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> File sync failures — attorneys couldn&apos;t access client docs remotely</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No multi-factor authentication — security liability for client data</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Paying for unused licenses on a confusing billing plan</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  The firm couldn&apos;t afford downtime — every hour of email outage meant lost billable hours and potential client confidentiality issues. They needed a weekend migration with zero Monday morning disruption.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CloudLightning className="h-6 w-6 text-primary" aria-hidden="true" />
                  Our Solution
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                    <div>
                      <p className="font-medium text-foreground">Discovery & Planning (Week 1)</p>
                      <p>Audited all 12 mailboxes, identified 3 unused licenses, mapped folder structures, and scheduled the cutover for a low-activity weekend.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">Pre-Staging (Thursday-Friday)</p>
                      <p>Provisioned Microsoft 365 Business Premium, configured DNS, set up MFA policies, created SharePoint sites for each practice area, and pre-populated user profiles.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">Weekend Migration (Saturday-Sunday)</p>
                      <p>Used Microsoft&apos;s migration API to sync all mailboxes (18GB total). Verified 100% data integrity. Switched DNS at 6am Sunday. Tested every account before Monday 8am.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">Monday Morning Launch</p>
                      <p>All 12 attorneys logged in successfully. Conducted 1-hour Teams training session. Decommissioned GoDaddy. Provided 30-day hypercare support.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  Measurable Results
                </h2>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Zero downtime</p>
                      <p className="text-sm">Monday morning was business as usual — no missed emails, no confused clients.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Email reliability: 85% → 99.9%</p>
                      <p className="text-sm">Outages dropped from 3-4/month to zero in the first 90 days.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">MFA blocked 3 breach attempts</p>
                      <p className="text-sm">Within the first month, Conditional Access policies stopped 3 credential-stuffing attacks.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">30% monthly cost reduction</p>
                      <p className="text-sm">Removed 3 unused licenses, right-sized plans, eliminated redundant backup add-ons.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">SharePoint adoption</p>
                      <p className="text-sm">Attorneys now collaborate on case files in real-time — no more emailing versions back and forth.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-muted-foreground bg-background rounded-r-xl">
                &ldquo;They made it look easy. We didn&apos;t lose a single email and our attorneys actually like the new system. Best IT decision we&apos;ve made in years.&rdquo;
                <footer className="mt-2 text-sm font-medium text-foreground not-italic">— Managing Partner</footer>
              </blockquote>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Common Questions About M365 Migrations</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Planning a migration?</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll assess your current setup and give you a fixed-price quote with a guaranteed timeline.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button size="lg" href="/get-help?category=m365">Start Migration Assessment</Button>
                <Button size="lg" variant="outline" href="/case-studies">View All Case Studies</Button>
              </div>
              <div className="max-w-md mx-auto p-6 rounded-xl border border-border bg-muted/30">
                <h3 className="font-semibold text-foreground mb-2">Download This Case Study</h3>
                <p className="text-sm text-muted-foreground mb-4">Share with stakeholders or keep for reference.</p>
                <Button variant="outline" size="sm" className="w-full">
                  Download PDF
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
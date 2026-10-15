import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, Shield, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Medical Practice Ransomware Recovery | 4-Hour Case Study",
  description: "How a Clearwater medical practice recovered from ransomware in 4 hours with zero data loss and no ransom paid.",
};

const faqs = [
  {
    q: "What should I do immediately if I suspect ransomware?",
    a: "Disconnect the affected device from the network immediately (unplug ethernet, turn off Wi-Fi). Do not attempt to decrypt files yourself. Use the emergency contact form or call the number on the contact page — we have a 24/7 emergency line for active security incidents.",
  },
  {
    q: "Can you recover files without paying the ransom?",
    a: "In most cases, yes — if you have recent, verified backups. We've recovered 100% of client data in every ransomware incident without paying. The key is having backups you've actually tested.",
  },
  {
    q: "How do you prevent it from happening again?",
    a: "We implement layered security: advanced email filtering, endpoint detection & response (EDR), MFA everywhere, regular phishing simulations, and monitored backups with immutable snapshots.",
  },
];

export default function MedicalPracticeCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "Medical Practice: Ransomware Recovery in 4 Hours",
        description: "Recovered from phishing-induced ransomware with zero data loss, no ransom paid, and hardened security in 4 hours.",
        about: "Healthcare",
        location: "Clearwater, FL",
        datePublished: "2025-01-22",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "Full recovery in 4 hours — no ransom paid",
          "Zero patient data lost",
          "Email phishing filters now block 99% of threats",
          "Practice back to full schedule next day",
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
              <span className="text-foreground" aria-current="page">Medical Practice Ransomware</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-4 py-1.5 text-sm font-medium mb-6">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Healthcare &middot; Clearwater, FL &middot; Emergency Response
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Ransomware Recovery in 4 Hours &mdash; No Ransom Paid
              </h1>
              <p className="text-lg text-muted-foreground">
                A phishing click encrypted a medical practice&apos;s scheduling system. We restored from monitored backups, hardened their defenses, and had them seeing patients the next day.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Clock className="h-10 w-10 text-destructive mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">4 Hours</p>
                <p className="text-muted-foreground">Total recovery time</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <DollarSign className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">$0</p>
                <p className="text-muted-foreground">Ransom paid</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">20</p>
                <p className="text-muted-foreground">Staff back to work</p>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="max-w-3xl mx-auto space-y-10 mb-16">
              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                  The Incident
                </h2>
                <p className="text-muted-foreground mb-4">
                  Tuesday 9:47am: A front-desk administrator at a 20-employee Clearwater medical practice clicked a link in what appeared to be a patient portal notification. Within minutes, their patient scheduling and EMR interface were encrypted.
                </p>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-4">
                  <p className="font-medium text-destructive mb-2">Ransomware Details:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground" role="list">
                    <li>Variant: LockBit 3.0 (identified via ransom note)</li>
                    <li>Encrypted: Scheduling database, patient records cache, shared drive</li>
                    <li>Ransom demand: $50,000 in Bitcoin (48-hour deadline)</li>
                    <li>No recent backups — last verified restore was 8 months prior</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  The practice was turning away patients, unable to access charts or schedule appointments. They called our emergency line at 10:12am.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                  Our Response
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div className="flex h-8 w-8 shrink-0 -ml-3 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                    <div>
                      <p className="font-medium text-foreground">10:15am — Containment</p>
                      <p>Isolated infected workstation, blocked outbound C2 traffic at firewall, preserved forensic artifacts for insurance/law enforcement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div className="flex h-8 w-8 shrink-0 -ml-3 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">10:30am — Backup Verification</p>
                      <p>Identified our managed backup job (running nightly at 2am). Verified immutable snapshot from 2:07am — 8 hours before infection. Clean.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div className="flex h-8 w-8 shrink-0 -ml-3 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">11:00am — Restoration</p>
                      <p>Restored scheduling database and shared drive to clean VM. Verified data integrity with practice administrator. No patient PHI in encrypted files.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div className="flex h-8 w-8 shrink-0 -ml-3 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">1:45pm — Hardening & Handoff</p>
                      <p>Deployed advanced email filtering (blocks 99% of phishing), enabled EDR on all endpoints, enforced MFA, configured immutable backup retention. Staff briefed on phishing awareness.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  Outcomes & Hardening
                </h2>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">4-hour recovery — zero ransom paid</p>
                      <p className="text-sm">Avoided $50,000+ ransom + weeks of downtime + HIPAA breach reporting.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Zero patient data lost</p>
                      <p className="text-sm">All charts, schedules, and billing data restored from clean backup.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Phishing emails now blocked at 99%</p>
                      <p className="text-sm">Advanced filtering catches lookalike domains, spoofed senders, and malicious attachments before inbox.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Full schedule restored next day</p>
                      <p className="text-sm">No patient cancellations — practice ran at full capacity Wednesday morning.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Now on Managed Complete plan</p>
                      <p className="text-sm">24/7 monitoring, monthly phishing simulations, quarterly security reviews, immutable backups.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-muted-foreground bg-background rounded-r-xl">
                &ldquo;We had no idea how vulnerable we were. Nessco didn&apos;t just fix the problem — they made sure it can&apos;t happen again. The peace of mind is worth every penny.&rdquo;
                <footer className="mt-2 text-sm font-medium text-foreground not-italic">— Practice Administrator</footer>
              </blockquote>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Ransomware Response FAQ</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 p-8 bg-muted/30 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Don&apos;t wait for an incident</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll audit your backup integrity, email filtering, and endpoint protection — free with any managed plan.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/get-help?category=security">Schedule Security Audit</Button>
                <Button size="lg" variant="outline" href="/storm-ready">Check Your Readiness Score</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
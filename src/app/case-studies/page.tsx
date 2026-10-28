import type { Metadata } from "next";
import { Button, Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { ArrowRight, Clock, DollarSign, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real IT problems we've solved for Tampa Bay businesses. See how we cut downtime, reduced costs, and improved security.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies",
    description: "Real IT problems we've solved for Tampa Bay businesses. See how we cut downtime, reduced costs, and improved security.",
    url: "https://nesscotech.com/case-studies",
  },
};

const caseStudies = [
  {
    slug: "law-firm-m365-migration",
    title: "Law Firm Microsoft 365 Migration Case Study",
    industry: "Legal",
    location: "Tampa",
    challenge: "A 12-attorney law firm was losing billable hours to email outages and file sync issues on their legacy GoDaddy workspace. They needed to migrate to Microsoft 365 without losing a single email or disrupting client work.",
    solution: "We planned a weekend migration: exported all mailboxes, set up Microsoft 365 with proper licensing, configured MFA for all users, and migrated SharePoint document libraries. We trained staff on Monday morning.",
    results: [
      "Zero downtime — Monday morning was business as usual",
      "Email reliability went from ~85% to 99.9%",
      "MFA blocked 3 attempted breaches in the first month",
      "Monthly IT costs dropped 30% after license cleanup",
    ],
    stats: { time: "2 days", savings: "$2,400/yr", users: 12 },
    quote: "They made it look easy. We didn't lose a single email and our attorneys actually like the new system.",
    quoteName: "Managing Partner",
  },
  {
    slug: "medical-practice-backup-recovery",
    title: "Medical Practice: Ransomware Recovery in 4 Hours",
    industry: "Healthcare",
    location: "Clearwater",
    challenge: "A 20-employee medical practice clicked a phishing link and had their patient scheduling system encrypted by ransomware. They had no recent backups and were turning away patients.",
    solution: "We isolated the infected machine, identified the ransomware variant, restored from a cloud backup we had implemented 6 months prior, and hardened their email security with advanced phishing filters.",
    results: [
      "Full recovery in 4 hours — no ransom paid",
      "Zero patient data lost",
      "Email phishing filters now block 99% of threats",
      "Practice was back to full schedule the next day",
    ],
    stats: { time: "4 hours", savings: "$50,000+ ransom", users: 20 },
    quote: "We had no idea how vulnerable we were. Nessco didn't just fix the problem — they made sure it can't happen again.",
    quoteName: "Practice Administrator",
  },
  {
    slug: "retail-chain-wifi-overhaul",
    title: "Retail Chain: Wi-Fi Overhaul for 5 Locations",
    industry: "Retail",
    location: "St. Petersburg",
    challenge: "A 5-location retail chain had spotty Wi-Fi that was hurting their POS systems, inventory scanners, and customer experience. Each store had a different router setup with no central management.",
    solution: "We standardized all 5 locations with enterprise-grade access points, set up a cloud-managed network, separated POS traffic from guest Wi-Fi, and implemented monitoring to catch issues before they affect sales.",
    results: [
      "POS downtime went from 3-4 incidents/month to zero",
      "Network issues now detected and fixed remotely before stores notice",
      "Guest Wi-Fi now a marketing tool (email capture)",
      "One dashboard manages all 5 locations",
    ],
    stats: { time: "1 week", savings: "$8,000/yr lost sales", users: 45 },
    quote: "Our registers don't go down anymore. That alone was worth the investment.",
    quoteName: "Operations Director",
  },
  {
    slug: "construction-job-site-network",
    title: "Construction Company: Job-Site Network & Wi-Fi",
    industry: "Construction",
    location: "Tampa",
    challenge: "A Tampa construction company needed reliable network connectivity across active job sites — for POS systems, inventory scanners, and mobile device management for field crews.",
    solution: "We standardized network and Wi-Fi across job sites with enterprise access points, VLANs, failover internet, and mobile device management — deployed via a repeatable template for each new site.",
    results: [
      "Reliable job-site connectivity for POS and inventory scanners",
      "Centralized network visibility across all sites",
      "Mobile access to project plans and specs from tablets",
      "Faster setup for each new job site",
    ],
    stats: { time: "Phased", savings: "Standardized", users: "Field & Office" },
    quote: "",
    quoteName: "",
  },
  {
    slug: "cpa-firm-quickbooks-hosting",
    title: "CPA Firm: QuickBooks Hosting & Data Security",
    industry: "Financial Services",
    location: "Lakeland",
    challenge: "A Lakeland CPA firm ran QuickBooks on one office PC — a tax-season bottleneck with no remote access and client data on an unsecured desktop.",
    solution: "We migrated QuickBooks to a hosted environment with encrypted storage, MFA, role-based access, remote access via VPN, and tax-season monitoring.",
    results: [
      "Multi-user QuickBooks access from any location",
      "Client financial data encrypted and access-controlled",
      "Tax-season uptime with monitored backups",
      "IRS Publication 4557-aligned safeguards",
    ],
    stats: { time: "Tax-Season", savings: "Secure", users: "Remote & Office" },
    quote: "",
    quoteName: "",
  },
  {
    slug: "nonprofit-donor-management",
    title: "Nonprofit: Donor Management & Data Security",
    industry: "Nonprofits",
    location: "St. Petersburg",
    challenge: "A St. Petersburg nonprofit stored donor records on spreadsheets with no access controls, shared volunteer logins, and no tested backups.",
    solution: "We moved donor records to a secure platform with encryption and audit logging, centralized grant tracking, gave volunteers individual MFA-protected accounts, and set up daily tested backups.",
    results: [
      "Donor data encrypted and access-controlled",
      "Grant tracking centralized and more reliable",
      "Volunteer coordination with individual MFA accounts",
      "Daily tested backups for continuity",
    ],
    stats: { time: "Donor Data", savings: "Protected", users: "Volunteers" },
    quote: "",
    quoteName: "",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Case Studies",
        description: "Real IT problems solved for Tampa Bay businesses",
      }} />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Real Problems. Real Fixes.
            </h1>
            <p className="text-lg text-muted-foreground">
              A few recent jobs across Tampa Bay. Names shared with permission — details anonymized where needed.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {caseStudies.map((cs) => (
              <Reveal key={cs.slug}>
                <article className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b border-border">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-primary">{cs.industry}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cs.location}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{cs.title}</h2>
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                        <Clock className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-muted-foreground">Resolution Time</p>
                          <p className="font-semibold text-foreground">{cs.stats.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                        <DollarSign className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-muted-foreground">Savings / Impact</p>
                          <p className="font-semibold text-foreground">{cs.stats.savings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                        <Users className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-muted-foreground">Users Affected</p>
                          <p className="font-semibold text-foreground">{cs.stats.users}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">The Problem</h3>
                        <p className="text-muted-foreground">{cs.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">What We Did</h3>
                        <p className="text-muted-foreground">{cs.solution}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">The Results</h3>
                        <ul className="space-y-2" role="list">
                          {cs.results.map((r) => (
                            <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <blockquote className="mt-8 border-l-4 border-primary pl-4 italic text-muted-foreground">
                      &ldquo;{cs.quote}&rdquo;
                      <footer className="mt-1 text-sm font-medium text-foreground not-italic">— {cs.quoteName}</footer>
                    </blockquote>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Have a problem like these?</h2>
              <p className="text-muted-foreground mb-8">Start a 2-minute service request — we&apos;ll give you an honest assessment.</p>
              <Button size="lg" href="/get-help">
                Get Help Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Check, X, Users, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "Nessco vs Big-Box Tech Support | Local vs National Comparison",
  description: "Compare Nessco Tech Services with Geek Squad, Asurion, and national remote-only providers. Local expertise, transparent pricing, and no upsells.",
  alternates: { canonical: "/compare/big-box-tech-support" },
};

const comparisons = [
  {
    category: "Response & Availability",
    rows: [
      { label: "Typical response time", nessco: "2 hours (Mon–Fri 8am–6pm)", bigBox: "24-48 hours or next available", winner: "nessco" },
      { label: "After-hours emergency", nessco: "Managed clients get priority", bigBox: "Rarely available, premium pricing", winner: "nessco" },
      { label: "On-site in Tampa Bay", nessco: "56 cities, same-day possible", bigBox: "Limited zip codes, scheduled days out", winner: "nessco" },
      { label: "Remote support availability", nessco: "Same-day, $75/hr", bigBox: "Often waitlisted, $99-149/hr", winner: "nessco" },
    ],
  },
  {
    category: "Pricing Transparency",
    rows: [
      { label: "Hourly rate published", nessco: "Yes — $75 remote / $125 on-site", bigBox: "Hidden until after diagnostic", winner: "nessco" },
      { label: "Diagnostic fee", nessco: "Free (included in first hour)", bigBox: "$50-99 upfront", winner: "nessco" },
      { label: "Upsells during service", nessco: "Never — you approve everything", bigBox: "Common (warranties, software, plans)", winner: "nessco" },
      { label: "Business plan pricing", nessco: "Published: $149/$349/$599", bigBox: "Quote-only, often 2-3x higher", winner: "nessco" },
    ],
  },
  {
    category: "Expertise & Accountability",
    rows: [
      { label: "Same technician relationship", nessco: "Yes — you know your tech", bigBox: "Rotating contractors", winner: "nessco" },
      { label: "Local business knowledge", nessco: "Tampa Bay since 2018", bigBox: "National call center", winner: "nessco" },
      { label: "Compliance awareness (HIPAA, PCI)", nessco: "Technical controls implemented", bigBox: "Rarely offered", winner: "nessco" },
      { label: "Vendor relationships", nessco: "Microsoft, Dell, Ubiquiti partners", bigBox: "Generic only", winner: "nessco" },
    ],
  },
{
    category: "Service Scope",
    rows: [
      { label: "Computer repair", nessco: "✓ Hardware & software", bigBox: "✓ Hardware & software", winner: "both" },
      { label: "Wi-Fi & networking", nessco: "✓ Mesh, cabling, enterprise gear", bigBox: "Basic router setup only", winner: "nessco" },
      { label: "Microsoft 365 & Google Workspace", nessco: "✓ Migration, MFA, security", bigBox: "Basic setup only", winner: "nessco" },
      { label: "Security & compliance", nessco: "✓ EDR, backups, audits, HIPAA/PCI", bigBox: "Antivirus install only", winner: "nessco" },
      { label: "Cabling & fiber", nessco: "✓ CAT5e-CAT8, fiber, structured", bigBox: "Not offered", winner: "nessco" },
      { label: "Surveillance & door access", nessco: "✓ Cameras, access control", bigBox: "Not offered", winner: "nessco" },
      { label: "Business phone systems", nessco: "✓ VoIP, Teams, auto-attendant", bigBox: "Not offered", winner: "nessco" },
      { label: "Server & cloud management", nessco: "✓ Azure, AWS, hybrid, on-prem", bigBox: "Not offered", winner: "nessco" },
      { label: "Compliance (HIPAA, PCI, SOC 2)", nessco: "✓ Technical controls, audits", bigBox: "Rarely offered", winner: "nessco" },
      { label: "Strategic IT planning (vCIO)", nessco: "✓ Roadmap, budgeting, vendor mgmt", bigBox: "Not offered", winner: "nessco" },
    ],
  },
];

const faqs = [
  {
    q: "Is Geek Squad cheaper for simple fixes?",
    a: "For a single virus cleanup, Geek Squad runs $149-199 plus $99 diagnostic. Nessco is $75/hr remote with no diagnostic fee — usually under $150 total. We're often less expensive and faster.",
  },
  {
    q: "What if I have a warranty through Best Buy / Asurion?",
    a: "We honor manufacturer warranties. If your device is under warranty, we'll guide you through the manufacturer process. If it's out of warranty or the issue isn't covered, we're typically faster and cheaper than Geek Squad.",
  },
  {
    q: "Can you handle my business if I have multiple locations?",
    a: "Yes. We manage IT for businesses with offices across Tampa Bay and remote employees everywhere. One point of contact, consistent documentation, and centralized monitoring.",
  },
  {
    q: "What happens if you can't fix it remotely?",
    a: "No fix, no fee on remote work we can't resolve. We'll schedule an on-site visit at $125/hr or help you explore other options — your call.",
  },
];

export default function BigBoxComparisonPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/compare/big-box-tech-support" },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }} />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Nessco vs. Big-Box Tech Support
              </h1>
              <p className="text-lg text-muted-foreground">
                Geek Squad, Asurion, and national remote-only providers compared to local Tampa Bay IT.
                No marketing fluff — just the differences that matter.
              </p>
            </Reveal>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {comparisons.map((section) => (
              <Reveal key={section.category}>
                <section className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">{section.category}</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {section.rows.map((row) => (
                      <div
                        key={`${section.category}-${row.label}`}
                        className={`grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 items-center ${row.winner === "nessco" ? "bg-primary/5" : row.winner === "bigBox" ? "bg-destructive/5" : ""}`}
                      >
                        <div className="font-medium text-foreground">{row.label}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4 text-primary" aria-hidden="true" />
                          <span className="text-foreground">{row.nessco}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>{row.bigBox}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          {row.winner === "nessco" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                              <Check className="h-3 w-3" aria-hidden="true" />
                              Nessco wins
                            </span>
                          )}
                          {row.winner === "bigBox" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2.5 py-0.5 text-xs font-medium">
                              <X className="h-3 w-3" aria-hidden="true" />
                              Big-box wins
                            </span>
                          )}
                          {row.winner === "both" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 text-warning px-2.5 py-0.5 text-xs font-medium">
                              <Users className="h-3 w-3" aria-hidden="true" />
                              Tie
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Common Questions</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <section className="mt-16 py-16 bg-muted/30 rounded-2xl text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4">See the difference yourself</h2>
                <p className="text-muted-foreground mb-8">
                  Start a 2-minute service request. No diagnostic fee, no upsells, no pressure.
                  We&apos;ll give you an honest recommendation — even if that means telling you to DIY.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" href="/get-help">Get Help Now</Button>
                  <Button size="lg" variant="outline" href="/compare/diy-vs-pro">DIY vs Pro Comparison</Button>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </section>
    </>
  );
}
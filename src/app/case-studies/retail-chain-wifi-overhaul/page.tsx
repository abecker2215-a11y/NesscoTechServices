import type { Metadata } from "next";
import Link from "next/link";
import { Button, Reveal, FAQAccordion, Card } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { CheckCircle, Clock, DollarSign, Users, TrendingUp, Wifi, Building2, Network } from "lucide-react";

export const metadata: Metadata = {
  title: "Retail Chain Wi-Fi Overhaul | 5 Locations Case Study",
  description: "How a St. Petersburg retail chain standardized Wi-Fi across 5 locations, eliminated POS downtime, and gained centralized network management.",
};

const faqs = [
  {
    q: "How long does a multi-location Wi-Fi project take?",
    a: "For 3-10 locations, we typically complete the project in 1-2 weeks. We stage deployments to minimize disruption — often working after hours or during slow periods. Each location takes 4-6 hours.",
  },
  {
    q: "Can you work with our existing internet providers?",
    a: "Yes. We coordinate with Spectrum, Frontier, Verizon, and others. We'll handle the circuit upgrades, modem swaps, and static IP requests so you don't have to.",
  },
  {
    q: "What if one location has unique requirements?",
    a: "Our cloud-managed platform supports per-site policies. One location can have different VLANs, SSIDs, or bandwidth limits while still being managed from the same dashboard.",
  },
];

export default function RetailChainCaseStudy() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CaseStudy",
        name: "Retail Chain: Wi-Fi Overhaul for 5 Locations",
        description: "Standardized enterprise Wi-Fi across 5 Tampa Bay retail locations, eliminated POS downtime, and implemented centralized cloud management.",
        about: "Retail",
        location: "St. Petersburg, FL",
        datePublished: "2025-06-10",
        author: { "@type": "Organization", name: "Nessco Tech Services" },
        result: [
          "POS downtime reduced from 3-4 incidents/month to zero",
          "Network issues detected and fixed remotely before stores notice",
          "Guest Wi-Fi converted to email capture marketing tool",
          "Single dashboard manages all 5 locations",
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
              <span className="text-foreground" aria-current="page">Retail Chain Wi-Fi</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Retail &middot; St. Petersburg, FL &middot; 5 Locations
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
                Enterprise Wi-Fi Overhaul for 5-Location Retail Chain
              </h1>
              <p className="text-lg text-muted-foreground">
                Replaced 5 different consumer router setups with cloud-managed enterprise access points. POS downtime eliminated, guest Wi-Fi now captures customer emails, one dashboard manages everything.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">1 Week</p>
                <p className="text-muted-foreground">Full deployment time</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <DollarSign className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">$8,000/yr</p>
                <p className="text-muted-foreground">Recovered lost sales</p>
              </Card>
            </Reveal>
            <Reveal>
              <Card variant="outlined" padding="lg" className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" aria-hidden="true" />
                <p className="text-3xl font-bold text-foreground">45</p>
                <p className="text-muted-foreground">Staff & devices connected</p>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="max-w-3xl mx-auto space-y-10 mb-16">
              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Wifi className="h-6 w-6 text-primary" aria-hidden="true" />
                  The Challenge
                </h2>
                <p className="text-muted-foreground mb-4">
                  A growing retail chain with 5 locations across Pinellas County had outgrown their patchwork network:
                </p>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Each store had a different consumer router (Netgear, Asus, TP-Link, Eero, Spectrum gateway)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> POS systems randomly lost connection — 3-4 incidents per month per location</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Inventory scanners dropped Wi-Fi in back rooms and loading docks</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No guest Wi-Fi for customers — missed marketing opportunity</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> No central visibility — issues discovered only when store managers called</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> Firmware updates never applied — security vulnerabilities</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  The Operations Director estimated $8,000/year in lost sales from POS downtime alone. They needed a standardized, enterprise-grade solution with central management.
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
                      <p className="font-medium text-foreground">Site Surveys & Design (Week 1)</p>
                      <p>Performed RF surveys at all 5 locations. Designed AP placement for full coverage including back rooms, loading docks, and outdoor curbside pickup areas. Spec&apos;d Ubiquiti UniFi Enterprise APs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                    <div>
                      <p className="font-medium text-foreground">Core Infrastructure (Days 2-3)</p>
                      <p>Installed PoE+ switches at each location, ran CAT6a to AP mounting points, configured VLANs: Management (VLAN 10), POS (VLAN 20), Staff (VLAN 30), Guest (VLAN 40). Connected to UniFi Cloud Gateway.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                    <div>
                      <p className="font-medium text-foreground">AP Deployment & Tuning (Days 4-5)</p>
                      <p>Mounted 22 access points (4-5 per location). Tuned transmit power, enabled band steering, airtime fairness, and minimum RSSI. Configured fast roaming (802.11r) for seamless handoff between APs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
                    <div>
                      <p className="font-medium text-foreground">SSID & Policy Configuration</p>
                      <p>POS: WPA3-Enterprise with RADIUS, VLAN 20, bandwidth priority. Staff: WPA3-Personal, VLAN 30. Guest: Captive portal with email capture, VLAN 40, rate-limited, content-filtered. All managed from single UniFi Cloud dashboard.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">5</div>
                    <div>
                      <p className="font-medium text-foreground">Testing, Training & Handoff</p>
                      <p>Validated POS transactions, scanner roaming, guest portal flow. Trained store managers on dashboard basics. Configured alerts: AP offline, high client count, channel interference, firmware available.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  Business Impact
                </h2>
                <ul className="space-y-3 text-muted-foreground" role="list">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">POS downtime: 3-4/month → 0</p>
                      <p className="text-sm">Zero register outages in 8 months since deployment. Peak holiday season ran flawlessly.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Proactive issue detection</p>
                      <p className="text-sm">Dashboard alerts caught 2 failing PoE ports and 1 ISP outage before stores noticed. Remote fixes in minutes, not hours.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Guest Wi-Fi = 340 emails/month</p>
                      <p className="text-sm">Captive portal captures customer emails for marketing. 18% open rate on promotional campaigns.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Single pane of glass</p>
                      <p className="text-sm">Operations Director sees all 5 locations&apos; health, client counts, and firmware status in one view.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground">Future-ready for expansion</p>
                      <p className="text-sm">Adding a 6th location? Same template, deployed in 4 hours. Consistent config, consistent security.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-muted-foreground bg-background rounded-r-xl">
                &ldquo;Our registers don&apos;t go down anymore. That alone was worth the investment. Now I can see the whole network from my phone and fix things before the store managers even call me.&rdquo;
                <footer className="mt-2 text-sm font-medium text-foreground not-italic">— Operations Director</footer>
              </blockquote>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Multi-Location Network FAQ</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Multiple locations? Let&apos;s standardize.</h2>
              <p className="text-muted-foreground mb-8">We&apos;ll survey your sites and give you a fixed-price proposal with a single dashboard for everything.</p>
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
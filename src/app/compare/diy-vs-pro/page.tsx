import type { Metadata } from "next";
import { Button, Reveal, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { Check, Clock, DollarSign, Shield, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "DIY IT vs Professional IT Support",
  description: "Should you fix it yourself or call a pro? Compare time, cost, risk, and when to DIY vs when to call Nessco Tech Services.",
  alternates: { canonical: "/compare/diy-vs-pro" },
};

const comparisons = [
  {
    title: "Slow workstations",
    diy: { time: "2-4 hours", cost: "$0", risk: "Medium - might miss root cause", verdict: "Try our free guide first" },
    pro: { time: "30-60 min", cost: "$75", risk: "Low - diagnosed correctly", verdict: "Worth it if guide doesn't fix it" },
  },
  {
    title: "Office Wi-Fi dead zones",
    diy: { time: "1-3 hours", cost: "$0-200 (mesh)", risk: "High - placement/interference tricky", verdict: "DIY if you enjoy tinkering" },
    pro: { time: "2-3 hours", cost: "$125/hr + equipment", risk: "Low - done right, guaranteed", verdict: "Worth it for whole-office coverage" },
  },
  {
    title: "Email not syncing",
    diy: { time: "30-90 min", cost: "$0", risk: "Low - usually config", verdict: "Try webmail first" },
    pro: { time: "30 min", cost: "$75", risk: "Low", verdict: "Call if webmail doesn't work" },
  },
  {
    title: "Virus / malware",
    diy: { time: "3-8 hours", cost: "$0-100 (tools)", risk: "Very high - might not fully remove", verdict: "Don't DIY - call us" },
    pro: { time: "1-2 hours", cost: "$75-150", risk: "Low - full removal + hardening", verdict: "Always worth it" },
  },
  {
    title: "Backup setup",
    diy: { time: "2-4 hours", cost: "$0-50/mo", risk: "High - easy to get wrong", verdict: "DIY if tech-savvy" },
    pro: { time: "1-2 hours", cost: "$125 + $10/mo", risk: "Low - verified + monitored", verdict: "Worth it for peace of mind" },
  },
  {
    title: "Microsoft 365 migration",
    diy: { time: "8-20 hours", cost: "$0", risk: "Very high - data loss possible", verdict: "Don't DIY" },
    pro: { time: "4-8 hours", cost: "$300-600", risk: "Low - zero-downtime migration", verdict: "Always worth it" },
  },
];

const faqs = [
  { q: "When should I definitely NOT DIY?", a: "Security incidents (ransomware, breaches), migrations (email, data), and anything involving backups or compliance. The risk of making it worse is too high." },
  { q: "What if I try DIY and can't fix it?", a: "No judgment — we see it all the time. Start a service request and tell us what you tried. You'll only pay for the time we spend, not your DIY attempts." },
  { q: "Do you charge for advice?", a: "No. Call or chat with us — if it's a quick fix, we'll tell you how to do it free. If it needs a pro, we'll give you an honest quote." },
];

export default function DiyVsProPage() {
  return (
    <>
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
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              DIY IT vs Professional IT Support
            </h1>
            <p className="text-lg text-muted-foreground">
              Honest comparison — we&apos;ll tell you when to DIY and when to call a pro. No upsells, no fear tactics.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {comparisons.map((item) => (
              <Reveal key={item.title}>
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Wrench className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <h3 className="font-semibold text-foreground">DIY</h3>
                      </div>
                      <dl className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span>Time: {item.diy.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" aria-hidden="true" />
                          <span>Cost: {item.diy.cost}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Shield className="h-4 w-4" aria-hidden="true" />
                          <span>Risk: {item.diy.risk}</span>
                        </div>
                      </dl>
                      <p className="text-sm font-medium text-foreground">{item.diy.verdict}</p>
                    </div>
                    <div className="p-6 bg-primary/5">
                      <div className="flex items-center gap-2 mb-4">
                        <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                        <h3 className="font-semibold text-foreground">Professional</h3>
                      </div>
                      <dl className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span>Time: {item.pro.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" aria-hidden="true" />
                          <span>Cost: {item.pro.cost}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Shield className="h-4 w-4" aria-hidden="true" />
                          <span>Risk: {item.pro.risk}</span>
                        </div>
                      </dl>
                      <p className="text-sm font-medium text-primary">{item.pro.verdict}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Common Questions: DIY vs Professional IT</h2>
              <FAQAccordion items={faqs} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Still not sure?</h2>
              <p className="text-muted-foreground mb-8">Start a 2-minute service request — we&apos;ll give you an honest recommendation.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/get-help">Get Help</Button>
                <Button size="lg" variant="outline" href="/guides">Browse Free Guides</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

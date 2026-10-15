import { Metadata } from "next";
import Link from "next/link";
import { MigrationChecklist } from "@/components/switch/MigrationChecklist";
import { Button, Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { ArrowRightLeft, ShieldCheck, FileCheck, PhoneCall, BadgeCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Switch MSPs Without the Risk — Free Migration",
  description:
    "Firing your IT company shouldn't feel risky. Free audit, parallel run, scheduled cutover, 90-day fit guarantee. We migrate you off ConnectWise, Autotask, HaloPSA, or chaos.",
};

const faqs = [
  {
    q: "Will there be downtime during the switch?",
    a: "No. We run parallel for 2–3 weeks — our monitoring goes on first, cutover happens in one scheduled window (usually Friday 5pm) with a rollback snapshot taken first.",
  },
  {
    q: "What happens to our tickets and history?",
    a: "We export open tickets, 90-day history, priorities, and SLAs from your current PSA and import them. Nothing falls through — the queue looks the same on Monday, just answered faster.",
  },
  {
    q: "Do we have to cancel our current contract first?",
    a: "No — don't cancel anything until the audit is done. Most contracts need 30 days' notice; we run parallel during it and draft the breakup email for you.",
  },
  {
    q: "What does migration cost?",
    a: "The audit and migration plan are free. The switch itself is included when you start any monthly plan — Essentials $149/mo, Managed $349/mo, Complete $599/mo, all month-to-month.",
  },
  {
    q: "What if we're not happier?",
    a: "90-day fit guarantee: not happier in 90 days and we hand everything back documented — passwords, maps, runbooks — and help you leave. We've never had to use it.",
  },
];

const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

export default function SwitchPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Switch MSPs", path: "/switch" }])} />
      <JsonLd data={faqPageSchema(faqs)} />
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="switch-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Free migration · 90-day fit guarantee
            </p>
            <h1 id="switch-heading" className="fluid-4xl font-bold tracking-tight text-foreground mb-4">
              Firing your MSP shouldn&apos;t feel risky
            </h1>
            <p className="fluid-lg text-muted-foreground">
              Slow responses, surprise bills, tickets into a black hole? We&apos;ve absorbed dozens of
              frustrated clients. Audit&apos;s free, cutover&apos;s scheduled, and billing never skips a month.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" href="#migration-plan" className="w-full sm:w-auto min-h-[48px]">
                Build my switch plan
              </Button>
              <Button size="lg" variant="outline" href={telHref} className="w-full sm:w-auto min-h-[48px]">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                {siteConfig.phone}
              </Button>
            </div>
          </div>

          <div className="mx-auto mb-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: FileCheck, title: "No downtime", body: "2–3 week parallel run, Friday-5pm cutover, rollback snapshot first." },
              { icon: ShieldCheck, title: "No lost history", body: "Tickets, SLAs, billing rules, and docs imported — Monday looks familiar." },
              { icon: BadgeCheck, title: "No lock-in", body: "Month-to-month plans. 90-day fit guarantee with documented handoff." },
            ].map((c) => (
              <Reveal key={c.title}>
                <div className="h-full rounded-xl border border-border bg-background p-5 text-center">
                  <c.icon className="mx-auto mb-2 h-7 w-7 text-primary" aria-hidden="true" />
                  <h2 className="font-bold text-foreground">{c.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div id="migration-plan" className="mx-auto max-w-3xl scroll-mt-24">
            <div className="mb-6 text-center">
              <h2 className="fluid-3xl font-bold text-foreground">Your switch, step by step</h2>
              <p className="fluid-base text-muted-foreground mt-2">
                Pick who handles IT today — the checklist adapts. Check things off, then email yourself the plan.
              </p>
            </div>
            <MigrationChecklist />
          </div>

          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="text-muted-foreground">
              Prefer to talk it through?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact us
              </Link>{" "}
              or start with the{" "}
              <Link href="/compare/diy-vs-pro" className="font-medium text-primary hover:underline">
                break-fix vs managed breakdown
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

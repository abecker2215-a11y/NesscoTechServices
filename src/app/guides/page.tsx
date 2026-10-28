import { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { fixes } from "@/lib/fixes";
import { Button } from "@/components/ui";
import { GuidesExplorer } from "@/components/guides/GuidesExplorer";
import { GuideFinder } from "@/components/guides/GuideFinder";
import { GuideRequestForm } from "@/components/guides/GuideRequestForm";
import { PopularStrip, GuideSubscribe } from "@/components/guides/GuidePromo";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { FAQAccordion } from "@/components/ui";
import { Wrench, ArrowRight, Zap, Clock } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Fix-It Guides — Plain-English IT How-Tos"),
  description:
    metaDescription("Free step-by-step IT guides for Tampa Bay businesses. Try it yourself first — no jargon, honest advice on when to call us."),
  alternates: { canonical: "/guides" },
  openGraph: {
    title: pageTitle("Fix-It Guides — Plain-English IT How-Tos"),
    description: metaDescription("Free step-by-step IT guides for Tampa Bay businesses. Try it yourself first."),
    url: "https://nesscotech.com/guides",
  },
};

const guidesFaqs = [
  {
    q: "Are these guides really free?",
    a: "Yes — no email wall, no signup. We'd rather you fix it yourself in 10 minutes than pay us $75 for something simple. When you do need us, you'll remember who told you the truth.",
  },
  {
    q: "What if I break something following a guide?",
    a: "Every guide sticks to safe, reversible steps and flags the risky ones. If anything looks different on your screen than described, stop and start a service request — tell us where you got stuck and we'll pick it up from there.",
  },
  {
    q: "Do you use these guides on real jobs?",
    a: "Yes. They're the same checklists our techs run through, written for non-technical humans. If a step ever goes stale (looking at you, Microsoft admin menus), tell us and we'll update it.",
  },
  {
    q: "My problem isn't listed. Now what?",
    a: "Check the Quick Fixes library for shorter answers, ask the site chat, or request the guide below — most-requested topics get written first. Urgent? Skip straight to a service request.",
  },
];

export default function GuidesPage() {
  const quickFixes = fixes.slice(0, 3);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />
      <JsonLd data={faqPageSchema(guidesFaqs)} />
      <section className="py-16 lg:py-24" aria-labelledby="guides-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wrench className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="guides-heading" className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Fix-It Guides
            </h1>
            <p className="text-lg text-muted-foreground">
              Try it yourself first — we&apos;ll tell you honestly when you don&apos;t need us.
              Every guide ends with exactly when it&apos;s time to call.
            </p>
          </div>

          <GuideFinder />

          <PopularStrip />

          <GuidesExplorer guides={guides} />

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Need it faster?
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">Quick Fixes — 3 minutes or less</h2>
              </div>
              <Link href="/fixes" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                All {fixes.length} quick fixes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickFixes.map((fix) => (
                <Link
                  key={fix.slug}
                  href={`/fixes/${fix.slug}`}
                  className="block rounded-lg border border-border bg-background p-5 lift-hover hover:border-primary/50 transition-colors"
                >
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {fix.readMinutes} min fix
                  </p>
                  <span className="block font-semibold text-foreground">{fix.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">{fix.excerpt}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="mb-6 text-center text-2xl font-bold text-foreground">Guide questions, answered</h2>
            <FAQAccordion items={guidesFaqs} />
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:max-w-5xl lg:mx-auto">
            <GuideRequestForm />
            <GuideSubscribe />
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-muted-foreground">
              Tried the guide and still stuck? We pick up where it leaves off.
              Confused by a term?{" "}
              <Link href="/glossary" className="font-medium text-primary hover:underline">
                Look it up in plain English →
              </Link>
            </p>
            <Button size="lg" href="/get-help">
              Get Help
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

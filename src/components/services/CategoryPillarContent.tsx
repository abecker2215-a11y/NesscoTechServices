import Link from "next/link";
import {
  ClipboardList,
  Compass,
  Wrench,
  LifeBuoy,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Zap,
  DollarSign,
} from "lucide-react";
import type { ServiceDef } from "@/lib/types";
import { guides as allGuides, type Guide } from "@/lib/guides";
import { fixes as allFixes, type QuickFix } from "@/lib/fixes";
import { getServiceHelpCategory } from "@/lib/services";
import { Button } from "@/components/ui";

const approachSteps = [
  {
    icon: ClipboardList,
    title: "Assess",
    body: "We start by inventorying what you actually have — devices, accounts, network gear, subscriptions, and the workarounds holding things together. No assumptions, no upselling.",
  },
  {
    icon: Compass,
    title: "Plan",
    body: "You get a plain-English recommendation that ranks every fix by risk and cost, so you can decide what to do now, what to schedule, and what to skip entirely.",
  },
  {
    icon: Wrench,
    title: "Implement",
    body: "We make the changes during low-impact windows, keep you informed at each step, and verify the work before we call it done.",
  },
  {
    icon: LifeBuoy,
    title: "Support & Document",
    body: "Everything we touch gets documented so the next person (or the next issue) starts from a known-good baseline — not a guess.",
  },
];

function uniqueBySlug<T extends { slug: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
  }
  return out;
}

interface Props {
  parent: ServiceDef;
  items: ServiceDef[];
}

export function CategoryPillarContent({ parent, items }: Props) {
  const helpCategory = getServiceHelpCategory(parent.slug);

  const challenges = items
    .map((s) => ({ slug: s.slug, title: s.title, problem: s.problem }))
    .slice(0, 6);

  const capabilities = uniqueBySlug(
    items.flatMap((s) => s.whatWeDo.map((text, i) => ({ slug: `${s.slug}-${i}`, text })))
  ).slice(0, 10);

  const pricedItems = items
    .filter((s) => s.remoteAvailable || s.onsiteAvailable)
    .sort((a, b) => a.pricing.remote - b.pricing.remote);

  const inCategory = (serviceSlug: string) =>
    serviceSlug === parent.slug || serviceSlug.startsWith(`${parent.slug}/`);

  const guides: Guide[] = allGuides.filter((g) => inCategory(g.serviceSlug)).slice(0, 6);

  const fixes: QuickFix[] = allFixes.filter((f) => inCategory(f.serviceSlug)).slice(0, 8);

  const lowestRemote = pricedItems.length
    ? Math.min(...pricedItems.filter((s) => s.remoteAvailable).map((s) => s.pricing.remote))
    : undefined;
  const lowestOnsite = pricedItems.length
    ? Math.min(...pricedItems.filter((s) => s.onsiteAvailable).map((s) => s.pricing.onsite))
    : undefined;

  const starterStep = parent.whatWeDo[0];

  return (
    <>
      <section className="py-16 lg:py-24" aria-labelledby="pillar-overview-heading">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl">
              <h2 id="pillar-overview-heading" className="text-3xl font-bold text-foreground mb-6">
                {parent.title}, explained
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{parent.problem}</p>
              <p className="text-muted-foreground mb-8">
                {parent.title} is one layer of a complete business IT stack. On its own it solves a
                specific, expensive set of problems — but the real payoff comes from how it fits with
                your network, security, backups, and day-to-day support. This page explains what this
                area covers, who it is for, what it typically costs in Tampa Bay, and how to tell
                whether you need it now or can safely wait.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-4">What we do</h3>
              <ul className="space-y-3 text-muted-foreground mb-8" role="list">
                {parent.whatWeDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-4">Who it&apos;s for</h3>
              <p className="text-muted-foreground">{parent.whoItsFor}</p>
            </div>

            <aside className="rounded-xl border border-border bg-muted/30 p-6 lg:sticky lg:top-24" aria-label="Category at a glance">
              <p className="text-sm font-semibold text-foreground mb-4">At a glance</p>
              <dl className="space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Specialist services</dt>
                  <dd className="font-semibold text-foreground">{items.length}</dd>
                </div>
                {lowestRemote !== undefined && lowestRemote > 0 && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Remote from</dt>
                    <dd className="font-semibold text-foreground">${lowestRemote}/hr</dd>
                  </div>
                )}
                {lowestOnsite !== undefined && lowestOnsite > 0 && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">On-site from</dt>
                    <dd className="font-semibold text-foreground">${lowestOnsite}/hr</dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Free guides</dt>
                  <dd className="font-semibold text-foreground">{guides.length > 0 ? `${guides.length}+` : "—"}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Service area</dt>
                  <dd className="font-semibold text-foreground">Tampa Bay</dd>
                </div>
              </dl>
              <Button href={`/get-help?category=${helpCategory}`} className="w-full mt-6">
                Get a recommendation
              </Button>
              <Link
                href="/pricing"
                className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                See full pricing <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {challenges.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="pillar-challenges-heading">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <h2 id="pillar-challenges-heading" className="text-3xl font-bold text-foreground mb-4">
                Problems this solves
              </h2>
              <p className="text-muted-foreground">
                These are the real-world symptoms that bring Tampa Bay businesses to us for{" "}
                {parent.title.toLowerCase()}. Each one links to the specialist service that handles it.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((c) => (
                <Link
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-background p-6 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold text-foreground mb-3">{c.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{c.problem}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    See how we fix it
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24" aria-labelledby="pillar-approach-heading">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 id="pillar-approach-heading" className="text-3xl font-bold text-foreground mb-4">
              How we work
            </h2>
            <p className="text-muted-foreground">
              A repeatable four-step approach, whether you need a single fix or a full rollout.
            </p>
          </div>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" role="list">
            {approachSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <li key={step.title} className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <StepIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {capabilities.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="pillar-capabilities-heading">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <h2 id="pillar-capabilities-heading" className="text-3xl font-bold text-foreground mb-4">
                What&apos;s typically involved
              </h2>
              <p className="text-muted-foreground">
                A representative sample of the tasks covered across {parent.title.toLowerCase()}.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2" role="list">
              {capabilities.map((c) => (
                <li key={c.slug} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {pricedItems.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="pillar-pricing-heading">
          <div className="container">
            <div className="max-w-2xl mb-12">
              <h2 id="pillar-pricing-heading" className="text-3xl font-bold text-foreground mb-4">
                {parent.title} pricing snapshot
              </h2>
              <p className="text-muted-foreground">
                Transparent starting rates. Remote work is billed hourly with a one-hour minimum;
                on-site adds travel time within Tampa Bay. Larger projects are quoted up front.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <caption className="sr-only">Starting hourly rates by service</caption>
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">Service</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">Remote</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">On-site</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody>
                  {pricedItems.map((s) => (
                    <tr key={s.slug} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">{s.title}</th>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.remoteAvailable && s.pricing.remote > 0 ? `$${s.pricing.remote}/hr` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {s.onsiteAvailable && s.pricing.onsite > 0 ? `$${s.pricing.onsite}/hr` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/services/${s.slug}`} className="font-medium text-primary hover:underline">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
              Not sure what applies to you?{" "}
              <Link href={`/get-help?category=${helpCategory}`} className="font-medium text-primary hover:underline">
                Tell us the problem
              </Link>{" "}
              and we&apos;ll quote it honestly.
            </p>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="pillar-guides-heading">
          <div className="container">
            <div className="max-w-2xl mb-8">
              <h2 id="pillar-guides-heading" className="text-3xl font-bold text-foreground mb-4">
                Free guides in this area
              </h2>
              <p className="text-muted-foreground">
                Step-by-step walkthroughs written for the same problems — including honest guidance on
                when you can fix it yourself.
              </p>
            </div>
            {guides.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-background p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {guide.readMinutes} min read
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{guide.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="max-w-2xl text-muted-foreground">
                We&apos;re still writing free walkthroughs for {parent.title.toLowerCase()}. In the
                meantime, the full library covers the adjacent problems that usually come up alongside it.
              </p>
            )}
            {fixes.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                  In a hurry? Quick answers (3 min or less):
                </p>
                <div className="flex flex-wrap gap-2">
                  {fixes.map((fix) => (
                    <Link
                      key={fix.slug}
                      href={`/fixes/${fix.slug}`}
                      className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                      {fix.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-8 text-sm text-muted-foreground">
              Browse the full library:{" "}
              <Link href="/guides" className="font-medium text-primary hover:underline">Guides</Link>{" · "}
              <Link href="/fixes" className="font-medium text-primary hover:underline">Quick Fixes</Link>{" · "}
              <Link href="/glossary" className="font-medium text-primary hover:underline">Glossary</Link>
            </p>
          </div>
        </section>

      <section className="py-16 lg:py-24" aria-labelledby="pillar-start-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 id="pillar-start-heading" className="text-3xl font-bold text-foreground mb-6">
              Where to start
            </h2>
            <p className="text-muted-foreground mb-6">
              If {parent.title.toLowerCase()} is on your radar, this is the shortest path from
              &quot;something&apos;s wrong&quot; to &quot;handled&quot;:
            </p>
            <ol className="space-y-4" role="list">
              {[
                starterStep,
                "Write down what is actually happening — error messages, who is affected, and when it started.",
                "Pick a remote or on-site visit, or send a request and let us recommend the right option.",
                "Get a plain-English summary of what we found and what it will take to fix.",
              ]
                .filter((step): step is string => Boolean(step))
                .map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" href={`/get-help?category=${helpCategory}`}>
                Start a {parent.title} request
              </Button>
              <Button size="lg" variant="outline" href="/contact">
                Ask a question
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

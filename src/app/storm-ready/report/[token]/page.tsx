import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { stormQuestions, stormVerdict, fixFor, type StormAnswer } from "@/lib/storm-report";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const lead = await prisma.stormLead.findUnique({ where: { reportToken: token } });
  if (!lead) return { title: "Report Not Found" };
  return {
    title: `Storm-Readiness Report — ${lead.score}/100`,
    description: `Storm-readiness score ${lead.score}/100 with per-question gaps and fixes.`,
    robots: "noindex, nofollow",
  };
}

export default async function StormReportPage({ params }: Props) {
  const { token } = await params;
  const lead = await prisma.stormLead.findUnique({ where: { reportToken: token } });
  if (!lead) notFound();

  const answers = ((lead.answers ?? {}) as unknown as Record<string, StormAnswer>);
  const v = stormVerdict(lead.score);
  const Icon = v.key === "ready" ? CheckCircle2 : v.key === "gaps" ? AlertTriangle : XCircle;
  const tone = v.key === "ready" ? "text-success" : v.key === "gaps" ? "text-warning" : "text-destructive";

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Storm-Ready Check", path: "/storm-ready" },
        { name: `Report ${lead.score}/100`, path: `/storm-ready/report/${token}` },
      ])} />
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="report-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Icon className={cn("h-7 w-7", tone)} aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Storm-readiness report{lead.name ? ` for ${lead.name}` : ""} ·{" "}
                {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <h1 id="report-heading" className="fluid-4xl font-bold text-foreground mt-2">
                {lead.score}<span className="text-2xl text-muted-foreground">/100 — {v.title}</span>
              </h1>
              <p className="fluid-base text-muted-foreground mt-3 max-w-xl mx-auto">{v.body}</p>
            </div>

            <div className="space-y-4">
              {stormQuestions.map((q, i) => {
                const a = answers[q.id];
                const s = a?.score ?? 0;
                const mark = s >= 20 ? "OK" : s > 0 ? "Partial" : "Gap";
                const markClass = s >= 20 ? "bg-success/10 text-success" : s > 0 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
                return (
                  <article key={q.id} className="rounded-xl border border-border bg-background p-5 print-hidden-none">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-foreground">{i + 1}. {q.q}</h2>
                      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", markClass)}>{mark}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Your answer: {a?.label ?? "Not answered"}</p>
                    <p className="mt-2 text-sm text-foreground">
                      <strong>Fix:</strong> {fixFor(q.id, s)}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 lg:p-8 text-center print-hidden">
              <h2 className="text-xl font-bold text-foreground">Want it handled?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                2-minute request, reply within 2 business hours. No charges until we agree on scope.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" href="/get-help?category=other" className="w-full sm:w-auto">
                  Fix my gaps
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="w-full sm:w-auto">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.phone}
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground print-hidden">
              Getting our follow-ups? <Link href={`/storm-ready/unsubscribe?token=${token}`} className="underline hover:text-foreground">Unsubscribe</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

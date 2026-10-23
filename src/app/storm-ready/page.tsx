import { Metadata } from "next";
import { StormQuiz } from "@/components/storm/StormQuiz";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { CloudLightning } from "lucide-react";

export const metadata: Metadata = {
  title: "Storm-Ready Check — Would Your Files Survive a Tampa Outage?",
  description:
    "60-second quiz: would your files and business survive a surge, flood, or week without power? Get your storm-readiness score and close the gaps before hurricane season.",
  alternates: { canonical: "/storm-ready" },
  openGraph: {
    title: "Storm-Ready Check — Would Your Files Survive a Tampa Outage?",
    description: "60-second storm-readiness quiz for Tampa Bay businesses.",
    url: "https://nesscotech.com/storm-ready",
  },
};

export default function StormReadyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Storm-Ready Check", path: "/storm-ready" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="storm-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CloudLightning className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="storm-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Would your files survive a Tampa storm?
            </h1>
            <p className="text-lg text-muted-foreground">
              Surges, floods, week-long outages — 5 questions, 60 seconds, and you&apos;ll know exactly
              where you stand before hurricane season.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <StormQuiz />
          </div>
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="mb-4 text-muted-foreground">Want the full monthly routine behind question 3?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="outline" href="/guides/backup-checklist-small-business">
                Read the 10-minute backup checklist
              </Button>
              <Button variant="outline" href="/offers">
                See all seasonal offers
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

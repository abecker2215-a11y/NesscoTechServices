"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight, PlayCircle, ListChecks } from "lucide-react";
import { guideLevel, guideUpdated, type Guide } from "@/lib/guides";
import { cn } from "@/lib/utils";

type Difficulty = "All" | "Beginner" | "Intermediate";

export function GuidesExplorer({ guides }: { guides: Guide[] }) {
  const [q, setQ] = useState("");
  const [service, setService] = useState("All");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");

  const services = useMemo(() => ["All", ...[...new Set(guides.map((g) => g.serviceLabel))]], [guides]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guides.filter((g) => {
      if (service !== "All" && g.serviceLabel !== service) return false;
      if (difficulty !== "All" && guideLevel(g) !== difficulty) return false;
      if (!needle) return true;
      return (
        g.title.toLowerCase().includes(needle) ||
        g.excerpt.toLowerCase().includes(needle) ||
        g.serviceLabel.toLowerCase().includes(needle) ||
        g.steps.some((s) => s.heading.toLowerCase().includes(needle) || s.body.toLowerCase().includes(needle))
      );
    });
  }, [q, service, difficulty, guides]);

  return (
    <div id="all-guides" className="scroll-mt-24">
      <div className="mx-auto mb-8 max-w-3xl space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="guides-search" className="sr-only">Search guides</label>
          <input
            id="guides-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guides: e.g. printer, MFA, slow…"
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by service">
            {services.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setService(s)}
                aria-pressed={service === s}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  service === s
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
          <div className="flex gap-1.5" role="group" aria-label="Filter by difficulty">
            {(["All", "Beginner", "Intermediate"] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  difficulty === d
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {d === "All" ? "Any level" : d}
              </button>
            ))}
          </div>
        </div>
        {(q.trim() || service !== "All" || difficulty !== "All") && (
          <p className="text-center text-sm text-muted-foreground" role="status">
            {filtered.length} {filtered.length === 1 ? "guide" : "guides"}{" "}
            <button type="button" onClick={() => { setQ(""); setService("All"); setDifficulty("All"); }} className="font-medium text-primary hover:underline">
              Clear filters
            </button>
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-background p-8 text-center">
          <p className="font-semibold text-foreground">No guide matches that — yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us what you need below and we&apos;ll write it, or{" "}
            <Link href="/get-help" className="font-medium text-primary hover:underline">get help now</Link>.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <article key={guide.slug} className="flex h-full flex-col rounded-lg border border-border bg-background p-6 lift-hover">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {guide.readMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                  {guide.steps.length} steps · {guideLevel(guide)}
                </span>
                {guide.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Video
                  </span>
                )}
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{guide.serviceLabel}</p>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                <Link href={`/guides/${guide.slug}`} className="hover:text-primary hover:underline">
                  {guide.title}
                </Link>
              </h2>
              <p className="mb-3 flex-1 text-sm text-muted-foreground">{guide.excerpt}</p>
              <p className="mb-3 text-xs text-muted-foreground">Updated {guideUpdated(guide)}</p>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  Read the guide
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={`/get-help?category=${guide.helpCategory}`}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                  title="Skip the DIY — get $25 off your first remote fix"
                >
                  Stuck? $25 off fix →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

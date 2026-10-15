"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, Filter, BookOpen, TrendingUp, Tag } from "lucide-react";
import { Reveal, Button } from "@/components/ui";
import type { GlossaryTerm, GlossaryCategory } from "@/lib/glossary";
import { getGuidesForService } from "@/lib/guides";
import { getServiceHelpCategory } from "@/lib/services";
import { getCategoryCounts, getPopularTerms } from "@/lib/glossary";

interface GlossarySearchProps {
  terms: GlossaryTerm[];
}

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  Security: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  Networking: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  Backup: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Microsoft 365": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Cloud: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
  Hardware: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Support: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  General: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

export function GlossarySearch({ terms }: GlossarySearchProps) {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [showPopular, setShowPopular] = useState(true);

  const categoryCounts = useMemo(() => getCategoryCounts(terms), [terms]);
  const popularTerms = useMemo(() => getPopularTerms(terms, 6), [terms]);

  const filtered = useMemo(() => {
    let result = terms;
    const needle = q.trim().toLowerCase();

    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (needle) {
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(needle) ||
          t.plain.toLowerCase().includes(needle) ||
          t.whyItMatters.toLowerCase().includes(needle) ||
          t.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    }

    return result;
  }, [q, terms, selectedCategory]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const handleCategoryClick = (category: GlossaryCategory | "all") => {
    setSelectedCategory(category);
    setShowPopular(false);
  };

  const clearFilters = () => {
    setQ("");
    setSelectedCategory("all");
    setShowPopular(true);
  };

  const hasActiveFilters = q.trim() !== "" || selectedCategory !== "all";

  return (
    <div>
      <div className="mx-auto mb-10 max-w-xl">
        <label htmlFor="glossary-search" className="sr-only">
          Search tech terms
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="glossary-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: e.g. MFA, mesh, ransomware…"
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {q.trim() && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {q.trim() && (
          <p className="mt-2 text-center text-sm text-muted-foreground" role="status">
            {filtered.length} {filtered.length === 1 ? "match" : "matches"} for &ldquo;{q.trim()}&rdquo;
            <button type="button" onClick={() => setQ("")} className="ml-2 font-medium text-primary hover:underline">
              Clear
            </button>
          </p>
        )}
      </div>

      <div className="mx-auto mb-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label="Filter by category">
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          <button
            type="button"
            onClick={() => handleCategoryClick("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
            aria-pressed={selectedCategory === "all"}
          >
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            All ({terms.length})
          </button>
          {categoryCounts
            .filter((c) => c.count > 0)
            .map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryClick(cat.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : `border-border hover:bg-muted ${CATEGORY_COLORS[cat.value]}`
                }`}
                aria-pressed={selectedCategory === cat.value}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all filters
          </button>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{filtered.length} term{filtered.length !== 1 ? "s" : ""}</span>
            {selectedCategory !== "all" && (
              <span className="text-sm text-muted-foreground">in {selectedCategory}</span>
            )}
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/50"}`}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/50"}`}
              aria-pressed={viewMode === "cards"}
              aria-label="Card view"
            >
              <div className="grid grid-cols-2 gap-1">
                <div className="h-2 w-full bg-current rounded" />
                <div className="h-2 w-full bg-current rounded" />
                <div className="h-2 w-full bg-current rounded" />
                <div className="h-2 w-full bg-current rounded" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {showPopular && selectedCategory === "all" && q.trim() === "" && (
        <section className="mx-auto mb-12 max-w-3xl" aria-labelledby="popular-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="popular-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
              Most Searched
            </h2>
            <button
              type="button"
              onClick={() => setShowPopular(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Hide popular terms"
            >
              Hide
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTerms.map((term) => (
              <Link
                key={term.slug}
                href={`#${term.slug}`}
                className="group rounded-xl border border-border bg-background p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${CATEGORY_COLORS[term.category]}`}>
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {term.term}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{term.plain}</p>
                    <span className="mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {term.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {groups.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-background p-8 text-center animate-fade-in-up">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <BookOpen className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="font-semibold text-foreground">No jargon matches that — good sign.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe it in your own words and we&apos;ll translate it for free.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button href="/get-help">Get Help</Button>
            <Button variant="outline" href="/contact">
              Ask a Question
            </Button>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["MFA", "mesh network", "ransomware", "VPN", "DNS", "phishing", "SSD", "RAID", "firewall", "encryption"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQ(term)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors tap-feedback"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-10">
          {viewMode === "list" ? (
            <>
              {groups.map(([letter, entries]) => (
                <Reveal key={letter}>
                  <section id={`letter-${letter}`} aria-labelledby={`heading-${letter}`} className="scroll-mt-24">
                    <h2 id={`heading-${letter}`} className="text-2xl font-bold text-primary border-b border-border pb-2 mb-6">
                      {letter}
                    </h2>
                    <dl className="space-y-6">
                      {entries.map((entry) => (
                        <GlossaryTermEntry key={entry.slug} entry={entry} />
                      ))}
                    </dl>
                  </section>
                </Reveal>
              ))}
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <GlossaryTermCard key={entry.slug} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GlossaryTermEntry({ entry }: { entry: GlossaryTerm }) {
  const relatedTerms = entry.relatedTerms
    ?.map((slug) => {
      const term = entry.relatedTerms?.find((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
      return term;
    })
    .filter(Boolean) as GlossaryTerm[] | undefined;

  return (
    <div id={entry.slug} className="scroll-mt-24">
      <dt className="text-lg font-semibold text-foreground flex items-center gap-2">
        {entry.term}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[entry.category]}`}>
          {entry.category}
        </span>
      </dt>
      <dd className="mt-2 space-y-3 ml-4">
        <p className="text-muted-foreground">{entry.plain}</p>
        <div className="text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg p-3">
          <span className="font-medium text-foreground">Why it matters: </span>
          {entry.whyItMatters}
        </div>
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Tags">
            {entry.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground bg-muted">
                <Tag className="h-3 w-3" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        )}
        {entry.relatedService && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <Link
              href={`/services/${entry.relatedService.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              → {entry.relatedService.label}
            </Link>
            {getGuidesForService(entry.relatedService.slug).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Guide: {guide.title.split(/[—:(]/)[0].trim()}
              </Link>
            ))}
            <Link
              href={`/get-help?category=${getServiceHelpCategory(entry.relatedService.slug)}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Get help →
            </Link>
          </div>
        )}
        {relatedTerms && relatedTerms.length > 0 && (
          <div className="pt-2 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground mr-2">Related:</span>
            <div className="inline-flex flex-wrap gap-1.5">
              {relatedTerms.map((related) => (
                <Link
                  key={related.slug}
                  href={`#${related.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {related.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </dd>
    </div>
  );
}

function GlossaryTermCard({ entry }: { entry: GlossaryTerm }) {
  const relatedTerms = entry.relatedTerms
    ?.map((slug) => {
      const term = entry.relatedTerms?.find((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
      return term;
    })
    .filter(Boolean) as GlossaryTerm[] | undefined;

  return (
    <article className="group rounded-xl border border-border bg-background p-5 hover:border-primary/50 hover:shadow-lg transition-all h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${CATEGORY_COLORS[entry.category]}`}>
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            <Link href={`#${entry.slug}`} className="hover:underline">
              {entry.term}
            </Link>
          </h3>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {entry.category}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground flex-1 mb-3 line-clamp-3">{entry.plain}</p>
      <div className="pt-3 border-t border-border space-y-2">
        <div className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg p-2">
          <span className="font-medium text-foreground">Why it matters: </span>
          <span className="line-clamp-2">{entry.whyItMatters}</span>
        </div>
        {entry.relatedService && (
          <Link
            href={`/services/${entry.relatedService.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            → {entry.relatedService.label}
          </Link>
        )}
        {relatedTerms && relatedTerms.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Related:</span>{" "}
            {relatedTerms.slice(0, 2).map((r) => (
              <Link key={r.slug} href={`#${r.slug}`} className="text-primary hover:underline mx-0.5">
                {r.term}
              </Link>
            ))}
            {relatedTerms.length > 2 && <span className="mx-0.5">+{relatedTerms.length - 2} more</span>}
          </div>
        )}
      </div>
    </article>
  );
}
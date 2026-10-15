"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, HelpCircle, Zap } from "lucide-react";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { glossaryTerms } from "@/lib/glossary";

interface Entry {
  kind: "Service" | "Guide" | "Term";
  title: string;
  detail: string;
  href: string;
}

const index: Entry[] = [
  ...services.map((s) => ({
    kind: "Service" as const,
    title: s.title,
    detail: s.shortDescription,
    href: `/services/${s.slug}`,
  })),
  ...guides.map((g) => ({
    kind: "Guide" as const,
    title: g.title,
    detail: g.excerpt,
    href: `/guides/${g.slug}`,
  })),
  ...glossaryTerms.map((t) => ({
    kind: "Term" as const,
    title: t.term,
    detail: t.plain,
    href: `/glossary#${t.slug}`,
  })),
];

const searchSuggestions = [
  { query: "wifi slow", label: "Fix slow Wi-Fi" },
  { query: "email not syncing", label: "Email sync issues" },
  { query: "virus removal", label: "Virus & malware cleanup" },
  { query: "backup not working", label: "Backup & recovery" },
  { query: "microsoft 365 setup", label: "M365 migration & MFA" },
  { query: "computer won't start", label: "Computer repair" },
];

export function SiteSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index
      .filter(
        (e) => e.title.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  const showPopular = query.trim().length < 2;

  return (
    <div className="w-full">
      <label htmlFor="site-search" className="sr-only">
        Search services, guides, and terms
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="site-search"
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "wifi", "email", or "backup"...'
          className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring form-field"
        />
      </div>

      {showPopular && (
        <div className="mt-3 animate-fade-in-up">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Popular searches</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
            {searchSuggestions.map((s) => (
              <li key={s.query}>
                <button
                  type="button"
                  onClick={() => setQuery(s.query)}
                  className="w-full group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted/50 tap-feedback"
                >
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!showPopular && results.length > 0 && (
        <ul className="mt-3 space-y-2 text-left animate-fade-in" role="list">
          {results.map((r) => (
            <li key={`${r.kind}-${r.href}`}>
              <Link
                href={r.href}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {r.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.kind} \u00b7 {r.detail}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!showPopular && results.length === 0 && query.trim().length >= 2 && (
        <div className="mt-4 p-4 rounded-lg border border-border bg-muted/50 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">No matches for \u201c{query}\u201d</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try different words, or browse our most helpful resources:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchSuggestions.slice(0, 4).map((s) => (
                  <button
                    key={s.query}
                    type="button"
                    onClick={() => setQuery(s.query)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors tap-feedback"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <Link
                  href="/get-help"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors tap-feedback"
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Start a service request \u2192
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
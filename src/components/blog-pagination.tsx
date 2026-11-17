import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PageEntry = number | "gap";

/**
 * Builds a compact page list with gaps: 1 2 3 4 … 127
 * Kept short on purpose so the pager fits on a phone.
 */
export function pageWindow(current: number, total: number): PageEntry[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: PageEntry[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("gap");
    out.push(sorted[i]);
  }
  return out;
}

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Total matching items, shown next to the page count when supplied. */
  totalItems?: number;
  /** Noun for the item count, e.g. "articles". */
  itemLabel?: string;
  /** Builds the href for a given 1-based page number. */
  hrefForPage: (page: number) => string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = "articles",
  hrefForPage,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage > 1 ? hrefForPage(currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? hrefForPage(currentPage + 1) : null;

  const edgeClassName =
    "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors";
  const edgeDisabledClassName =
    "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground/50";

  return (
    <nav
      aria-label="Pagination"
      className="max-w-5xl mx-auto mt-4 flex flex-col items-center gap-4"
    >
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
        {typeof totalItems === "number" ? ` · ${totalItems} ${itemLabel}` : ""}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {prevHref ? (
          <Link href={prevHref} rel="prev" className={edgeClassName}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" className={edgeDisabledClassName}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </span>
        )}

        {pageWindow(currentPage, totalPages).map((entry, i) =>
          entry === "gap" ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={entry}
              href={hrefForPage(entry)}
              aria-current={entry === currentPage ? "page" : undefined}
              className={
                entry === currentPage
                  ? "rounded-lg border border-primary bg-primary text-primary-foreground px-3 py-2 text-sm font-medium"
                  : "rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
              }
            >
              {entry}
            </Link>
          )
        )}

        {nextHref ? (
          <Link href={nextHref} rel="next" className={edgeClassName}>
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <span aria-disabled="true" className={edgeDisabledClassName}>
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
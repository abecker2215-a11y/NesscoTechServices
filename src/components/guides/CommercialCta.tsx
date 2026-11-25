import Link from "next/link";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";

/**
 * Contextual internal-link block for informational pages (fixes, guides,
 * glossary). Passes ranking authority from high-traffic informational content
 * to the commercial Tampa landing pages.
 */
export function CommercialCta() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6 lg:p-8">
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Tampa Bay business IT support
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Running a business in Tampa Bay? We provide proactive managed IT,
        cybersecurity, and helpdesk support for companies with 5&ndash;500
        employees &mdash; remote from $75/hr, on-site from $125/hr.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/managed-it-services-tampa"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Briefcase className="h-4 w-4" aria-hidden="true" />
          Managed IT services in Tampa
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/it-support-tampa"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          IT support in Tampa
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
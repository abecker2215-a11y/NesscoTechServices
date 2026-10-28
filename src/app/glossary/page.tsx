import { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms, getCategoryCounts, getPopularTerms } from "@/lib/glossary";
import { Button } from "@/components/ui";
import { GlossarySearch } from "@/components/glossary/GlossarySearch";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { BookOpen, Shield, Wifi, Database, Monitor, HardDrive, Headphones, FileText, Users, TrendingUp, ArrowRight } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("IT Glossary — Plain-English Tech Terms"),
  description:
    metaDescription("Confused by IT jargon? Our glossary explains 36+ tech terms in plain English, from networking to Microsoft 365."),
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: pageTitle("IT Glossary — Plain-English Tech Terms"),
    description: metaDescription("36+ tech terms explained simply. Search, filter by category, and find related guides."),
    type: "website",
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Security: Shield,
  Networking: Wifi,
  Backup: Database,
  "Microsoft 365": Monitor,
  Cloud: Monitor,
  Hardware: HardDrive,
  Support: Headphones,
  General: FileText,
};

const CATEGORY_COLORS: Record<string, string> = {
  Security: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  Networking: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  Backup: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Microsoft 365": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Cloud: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
  Hardware: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Support: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  General: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

export default function GlossaryPage() {
  const categoryCounts = getCategoryCounts(glossaryTerms).filter((c) => c.count > 0);
  const popularTerms = getPopularTerms(glossaryTerms, 4);
  const totalTerms = glossaryTerms.length;
  const totalCategories = categoryCounts.length;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "IT Glossary", path: "/glossary" }])} />
      
      <section className="py-16 lg:py-24" aria-labelledby="glossary-heading">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 id="glossary-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              The IT Glossary
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Tech terms explained the way we&apos;d explain them over the phone — no jargon, no upsells.
              Every term links to the service that helps if it&apos;s your problem.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <StatCard value={totalTerms} label="Terms Defined" icon={<BookOpen className="h-5 w-5" />} />
              <StatCard value={totalCategories} label="Categories" icon={<FileText className="h-5 w-5" />} />
              <StatCard value={popularTerms[0]?.popularity || 0} label="Top Popularity" icon={<TrendingUp className="h-5 w-5" />} suffix="/100" />
              <StatCard value="100%" label="Plain English" icon={<Users className="h-5 w-5" />} />
            </div>
          </div>

          <GlossarySearch terms={glossaryTerms} />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="categories-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="categories-heading" className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Jump straight to the topic you need — each category covers the terms that matter most for that area.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {categoryCounts.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.value] || FileText;
              return (
                <Link
                  key={cat.value}
                  href={`/glossary?category=${cat.value}`}
                  className="group rounded-xl border border-border bg-background p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${CATEGORY_COLORS[cat.value]}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">{cat.count} term{cat.count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-primary group-hover:underline">View terms</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="popular-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="popular-heading" className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" aria-hidden="true" />
              Most Searched Terms
            </h2>
            <p className="text-muted-foreground">
              These are the terms our visitors look up most often — start here if you&apos;re not sure what you need.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {popularTerms.map((term) => (
              <Link
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="group rounded-xl border border-border bg-background p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${CATEGORY_COLORS[term.category]}`}>
                    <BookOpen className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {term.term}
                    </h3>
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {term.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{term.plain}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    Read about {term.term}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="glossary-cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="glossary-cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Still hearing IT-speak?
            </h2>
            <p className="text-muted-foreground mb-8">
              Tell us what&apos;s happening in your own words — we&apos;ll translate and fix it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/get-help">
                Get Help
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" href="/contact">
                Ask a Question
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label, icon, suffix = "" }: { value: number | string; label: string; icon: React.ReactNode; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-center">
      <div className="mx-auto mb-2 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-foreground">
        {value}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
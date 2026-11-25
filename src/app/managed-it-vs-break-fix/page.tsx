import { Metadata } from "next";
import Link from "next/link";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { FAQItem } from "@/lib/types";

const faqs: FAQItem[] = [
  {
    q: "What is the difference between managed IT and break-fix?",
    a: "Managed IT is a flat monthly fee per user that includes monitoring, patching, security, and help desk so problems are caught early. Break-fix is hourly work you buy only when something breaks, at $75/hr remote and $125/hr on-site.",
  },
  {
    q: "Which is cheaper for a small business?",
    a: "For one or two users with rare issues, break-fix can be cheaper because you only pay when something breaks. For ten or more users, managed IT usually costs less than repeated emergency visits and prevents costly downtime.",
  },
  {
    q: "Can I switch from break-fix to managed IT later?",
    a: "Yes. Many Tampa businesses start on break-fix and move to managed IT once downtime starts costing more than the monthly fee. That is a normal progression.",
  },
  {
    q: "Is there a contract for managed IT?",
    a: "Managed plans are monthly with no long-term lock-in. Hourly break-fix requires no commitment at all.",
  },
];

export const metadata: Metadata = {
  title: pageTitle("Managed IT vs Break-Fix Support (Tampa Guide)"),
  description: metaDescription(
    "Managed IT vs break-fix: how each is priced, what each includes, and which fits your Tampa Bay business. Managed from $89/user/mo, break-fix from $75/hr."
  ),
  alternates: { canonical: "https://nesscotech.com/managed-it-vs-break-fix" },
  openGraph: {
    title: pageTitle("Managed IT vs Break-Fix Support"),
    description: metaDescription(
      "Managed IT vs break-fix: how each is priced, what each includes, and which fits your Tampa Bay business."
    ),
    url: "https://nesscotech.com/managed-it-vs-break-fix",
    type: "article",
  },
};

export default function ManagedVsBreakFixPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Managed IT vs Break-Fix", path: "/managed-it-vs-break-fix" },
      ])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-16 lg:py-24" aria-labelledby="vs-heading">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>Managed IT vs Break-Fix</span>
          </nav>

          <h1 id="vs-heading" className="text-4xl font-bold tracking-tight text-foreground mb-6">
            Managed IT vs. Break-Fix IT Support
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Managed IT and break-fix are two ways to buy IT support. Managed IT is a flat monthly fee per user that covers monitoring, patching, security, and help desk. Break-fix is hourly work you buy only when something breaks. The right choice depends on how much downtime your business can absorb and how many users you have.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">What break-fix covers</h2>
          <p className="text-muted-foreground mb-8">
            Break-fix is reactive. Something stops working, you call, a technician fixes it, and you pay by the hour. Remote support is $75 per hour and on-site is $125 per hour. There is no monthly fee and no contract. You pay only for the time used. Break-fix works for occasional problems, one-off projects, and businesses with very few users. The risk is that nothing is monitored, so small issues sit until they become outages, and emergency work costs more than planned work.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">What managed IT covers</h2>
          <p className="text-muted-foreground mb-8">
            Managed IT is proactive. The provider monitors your systems around the clock, patches software, manages security, verifies backups, and runs a help desk. Problems get caught before they interrupt work. The fee is flat per user per month, so you know the cost in advance. Plans in Tampa Bay run from $89 to $189 per user per month depending on device count and scope. Essentials covers up to 10 devices, Managed up to 25, and Complete is unlimited.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">The cost comparison</h2>
          <p className="text-muted-foreground mb-8">
            For a business with one or two users and rare issues, break-fix can be cheaper because you only pay when something breaks. For a business with ten or more users, managed IT usually costs less than repeated emergency visits, and it prevents the downtime that makes break-fix expensive. A single unplanned outage that stops a team for a day often costs more than a month of managed coverage.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">When to choose each</h2>
          <p className="text-muted-foreground mb-8">
            Choose break-fix if you have a handful of users, simple needs, and no compliance requirements. Choose managed IT if you have a team that depends on technology to work, you cannot afford extended downtime, or you need security and backup handled for you. Many Tampa businesses start on break-fix and move to managed IT once downtime starts costing more than the monthly fee.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">What to check before you switch</h2>
          <p className="text-muted-foreground mb-10">
            Ask a managed provider what is included, how devices are counted, what the response time is, and what happens when you exceed the device allowance. A clear per-user price with a stated device cap is easier to budget than a vague monthly quote.
          </p>

          <div className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Frequently asked questions</h2>
            <FAQAccordion items={faqs} />
          </div>

          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Compare the two models side by side on the pricing page, then request a quote that shows both the managed monthly total and the break-fix hourly rate for your situation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button href="/pricing">Compare pricing</Button>
              <Button variant="outline" href="/contact">Request a quote</Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Related: <Link href="/managed-it-services-tampa" className="text-primary hover:underline">Managed IT services in Tampa</Link> · <Link href="/it-support-tampa" className="text-primary hover:underline">IT support in Tampa</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
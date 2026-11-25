import { Metadata } from "next";
import Link from "next/link";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { FAQItem } from "@/lib/types";

const faqs: FAQItem[] = [
  {
    q: "How much do managed IT services cost in Tampa?",
    a: "Plans run from $89 to $189 per user per month. Essentials is $89/user/mo (up to 10 devices), Managed is $139/user/mo (up to 25 devices), and Complete is $189/user/mo (unlimited devices). Hourly break-fix is $75/hr remote and $125/hr on-site.",
  },
  {
    q: "Is the monthly price per user or per device?",
    a: "The monthly price is per user. The device allowance is a separate cap: Essentials covers up to 10 total devices, Managed up to 25, and Complete is unlimited. If your device count exceeds the plan you picked, you move up a tier.",
  },
  {
    q: "What is not included in the monthly plans?",
    a: "Hardware, cabling projects, and new device purchases are quoted separately. On-site visits beyond the included scope are billed at the hourly rate.",
  },
  {
    q: "Do you offer a nonprofit discount?",
    a: "Yes. Registered 501(c)(3) nonprofits get 10 percent off the monthly total.",
  },
];

export const metadata: Metadata = {
  title: pageTitle("Managed IT Services Cost in Tampa (2026 Pricing)"),
  description: metaDescription(
    "What managed IT services cost in Tampa Bay: per-user plans from $89 to $189 per month, device allowances, and what affects your bill."
  ),
  alternates: { canonical: "https://nesscotech.com/managed-it-services-cost-tampa" },
  openGraph: {
    title: pageTitle("Managed IT Services Cost in Tampa"),
    description: metaDescription(
      "What managed IT services cost in Tampa Bay: per-user plans from $89 to $189 per month, device allowances, and what affects your bill."
    ),
    url: "https://nesscotech.com/managed-it-services-cost-tampa",
    type: "article",
  },
};

export default function ManagedItCostPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Managed IT Services Cost in Tampa", path: "/managed-it-services-cost-tampa" },
      ])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-16 lg:py-24" aria-labelledby="cost-heading">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>Managed IT Services Cost in Tampa</span>
          </nav>

          <h1 id="cost-heading" className="text-4xl font-bold tracking-tight text-foreground mb-6">
            How Much Do Managed IT Services Cost in Tampa?
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Managed IT pricing in Tampa Bay is quoted per user, per month. The three plans run from $89 to $189 per user each month, and each plan covers a set number of total devices across your whole business. Hourly break-fix support is separate and starts at $75 per hour remote and $125 per hour on-site.
          </p>

          <div className="mb-10 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Plan</th>
                  <th className="px-4 py-3 font-medium text-foreground">Per user/mo</th>
                  <th className="px-4 py-3 font-medium text-foreground">Devices</th>
                  <th className="px-4 py-3 font-medium text-foreground">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Essentials</td>
                  <td className="px-4 py-3 text-foreground">$89</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 10</td>
                  <td className="px-4 py-3 text-muted-foreground">Small teams needing monitoring and help desk</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Managed</td>
                  <td className="px-4 py-3 text-foreground">$139</td>
                  <td className="px-4 py-3 text-muted-foreground">Up to 25</td>
                  <td className="px-4 py-3 text-muted-foreground">Growing businesses wanting full IT management</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">Complete</td>
                  <td className="px-4 py-3 text-foreground">$189</td>
                  <td className="px-4 py-3 text-muted-foreground">Unlimited</td>
                  <td className="px-4 py-3 text-muted-foreground">Businesses needing advanced security and vCIO</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">How the math works</h2>
          <p className="text-muted-foreground mb-8">
            The monthly total is the per-user price multiplied by your headcount. A 15-person office on Essentials pays $1,335 per month. The device allowance is a separate ceiling: Essentials covers 10 total devices, Managed covers 25, and Complete is unlimited. If your device count exceeds the plan you picked, you move up a tier. A 15-person business with 30 devices needs Complete regardless of headcount. Nonprofits with 501(c)(3) status get 10 percent off the monthly total.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">What drives the price up or down</h2>
          <p className="text-muted-foreground mb-8">
            Three things move the bill. Headcount is the biggest, since the price is per user. Device count decides which tier you need. Scope adds or removes items like compliance work, after-hours coverage, or on-site projects. Two businesses with the same headcount can pay different amounts if one has twice the devices or needs HIPAA documentation.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Managed IT versus break-fix</h2>
          <p className="text-muted-foreground mb-8">
            Break-fix is $75 per hour remote and $125 per hour on-site, with no monthly commitment. You pay only when something breaks. Managed IT is a flat monthly fee that includes monitoring, patching, security, and help desk so problems get caught before they interrupt work. For a business with more than a handful of users, managed IT usually costs less than repeated emergency break-fix visits, and it prevents the downtime that makes break-fix expensive.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">What is not included</h2>
          <p className="text-muted-foreground mb-10">
            The monthly plans do not include hardware, cabling projects, or new device purchases. Those are quoted separately. On-site visits beyond the included scope are billed at the hourly rate.
          </p>

          <div className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Frequently asked questions</h2>
            <FAQAccordion items={faqs} />
          </div>

          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Use the pricing calculator to see your exact monthly total by user and device count, then request a quote for a firm number based on your environment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button href="/pricing">See pricing calculator</Button>
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
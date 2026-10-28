import { Metadata } from "next";
import { RoiCalculator } from "@/components/roi/RoiCalculator";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Downtime ROI — What Outages Really Cost",
  description:
    "Interactive calculator: what IT downtime costs your Tampa Bay business per year in idle staff time.",
  alternates: { canonical: "/roi" },
  openGraph: {
    title: "Downtime ROI — What Outages Really Cost",
    description: "What IT downtime costs your Tampa Bay business per year in idle staff time.",
    url: "https://nesscotech.com/roi",
  },
};

export default function RoiPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Downtime ROI", path: "/roi" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="roi-heading">
        <div className="container">
            <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 id="roi-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Every outage has a price tag
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Downtime Cost Calculator</h2>
            <p className="text-lg text-muted-foreground">
              Idle staff still get paid. Drag the sliders to your reality —
              then see which plan turns that cost into prevention.
            </p>
            <p className="text-lg text-muted-foreground mt-6">
              IT downtime costs Tampa Bay businesses more than just repair bills. When your network goes down,
              employees can&apos;t work, customers can&apos;t reach you, and revenue stops flowing. Our downtime
              calculator helps you quantify the real cost of outages — idle staff time, lost productivity, and
              missed opportunities — so you can make an informed decision about managed IT protection.
            </p>
            <p className="text-lg text-muted-foreground mt-6">
              Our managed IT plans start at $75/hr for remote support and include proactive monitoring, patching,
              helpdesk, and strategic planning. Preventing a single major outage often pays for an entire year of
              managed service. Use the calculator below to see your specific numbers.
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <RoiCalculator />
          </div>
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="mb-4 text-muted-foreground">Prefer the repair-bill math instead?</p>
            <Button variant="outline" href="/compare">
              Break-fix vs managed calculator
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

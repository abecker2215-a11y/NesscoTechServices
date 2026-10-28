import { Metadata } from "next";
import { EmergencyForm } from "@/components/emergency/EmergencyForm";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { getBusinessStatus } from "@/lib/hours";

export const metadata: Metadata = {
    title: "Emergency IT Pager | Tampa Bay MSP",
  description:
    "Active outage, ransomware, or emergency? Page the Nessco on-call technician now. Transparent 1.5x after-hours rate.",
  alternates: { canonical: "/emergency" },
  openGraph: {
  title: "Emergency IT Pager | Tampa Bay MSP",
    description: "Active outage, ransomware, or down-business emergency? Page the Nessco on-call technician now.",
    url: "https://nesscotech.com/emergency",
  },
};

export default function EmergencyPage() {
  const status = getBusinessStatus();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Emergency", path: "/emergency" }])} />
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="emergency-heading">
        <div className="container">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h1 id="emergency-heading" className="fluid-4xl font-bold tracking-tight text-foreground mb-4">
              Down right now?
            </h1>
            <p className="fluid-lg text-muted-foreground">
              {status.open
                ? "We're open — call for the fastest response, or page below and we'll jump."
                : "We're closed — page the on-call tech and get a live status page in seconds."}
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <EmergencyForm />
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Nessco Tech Services website and IT services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service",
    description: "Terms governing use of the Nessco Tech Services website and IT services.",
    url: "https://nesscotech.com/terms",
  },
};

export default function TermsPage() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="terms-heading">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 id="terms-heading" className="text-4xl font-bold text-foreground tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: October 2026</p>

          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Website use</h2>
              <p>
                This website provides general information about {siteConfig.name} and its services. You may
                browse it for personal or business reference. Do not attempt to interfere with or gain
                unauthorized access to the site or its systems.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Estimates and pricing</h2>
              <p>
                Prices listed on this site (including hourly rates and monthly plans) are current as of the
                posting date. Any estimate provided before work begins is an estimate — the final price is
                confirmed with your approval before work continues. No work is performed without your approval.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Monthly plans</h2>
              <p>
                Monthly plans are billed month-to-month with 30 days&apos; written cancellation. Device counts
                and included features are described on the pricing page. Upgrades and downgrades take effect
                at the next billing cycle.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Forms and communications</h2>
              <p>
                Information submitted through our forms is used solely to respond to your request and deliver
                requested services, as described in our <Link href="/privacy" className="text-primary underline hover:text-primary/80">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Disclaimer</h2>
              <p>
                Content on this site is provided &quot;as is&quot; for general information. Specific service
                commitments, warranties, and liability limits are defined in individual service agreements
                signed before work begins.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact Information</h2>
              <p>
                Questions? Email{" "}
                <Link href="/contact" className="text-primary underline hover:text-primary/80">
                  {siteConfig.email}
                </Link>{" "}
                or call{" "}
                <a href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="text-primary underline hover:text-primary/80">
                  {siteConfig.phone}
                </a>.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Button variant="outline" href="/contact">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Metadata } from "next";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nessco Tech Services collects, uses, and protects information you share through this website.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="privacy-heading">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 id="privacy-heading" className="text-4xl font-bold text-foreground tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: October 2026</p>

          <div className="prose-sm space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">What we collect</h2>
              <p>
                When you submit a contact form or service request, we collect the information you provide:
                your name, email, phone number, and a description of your issue. We use this solely to respond
                to your request and deliver services you ask for.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">What we don&apos;t do</h2>
              <p>
                We don&apos;t sell, rent, or share your personal information with third parties for marketing.
                We don&apos;t use advertising cookies or build profiles of visitors.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Analytics</h2>
              <p>
                We use privacy-friendly, cookie-free analytics (Plausible) to understand aggregate traffic —
                such as which pages are visited. We also measure anonymous milestones (like starting a service
                request) with no personal data attached. No personal data is collected and no cross-site tracking occurs.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Data retention</h2>
              <p>
                Form submissions are retained only as long as needed to handle your request and maintain business
                records. You may request deletion of your information at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact</h2>
              <p>
                Questions about this policy? Email{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-primary underline hover:text-primary/80">
                  {siteConfig.email}
                </a>{" "}
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

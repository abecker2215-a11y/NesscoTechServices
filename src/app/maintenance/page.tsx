import { Metadata } from "next";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { Phone, Mail, RefreshCw, AlertTriangle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Scheduled Maintenance",
  description: "We're currently performing scheduled maintenance. We'll be back shortly.",
  alternates: { canonical: "/maintenance" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Scheduled Maintenance",
    description: "We're currently performing scheduled maintenance. We'll be back shortly.",
    url: "https://nesscotech.com/maintenance",
  },
};

export default function MaintenancePage() {
  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  return (
    <section className="py-24 lg:py-32 min-h-screen flex items-center" aria-labelledby="maintenance-heading">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-warning/10 blur-3xl rounded-full" aria-hidden="true" />
            <RefreshCw className="relative mx-auto h-20 w-20 text-warning animate-spin" aria-hidden="true" />
          </div>
          
          <h1 id="maintenance-heading" className="mb-4 text-4xl lg:text-5xl font-bold text-foreground">
            Scheduled Maintenance
          </h1>
          <h2 className="text-xl font-semibold text-foreground mb-6">Maintenance Notice</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            We&apos;re currently performing scheduled maintenance to improve our services. We&apos;ll be back shortly.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Nessco Tech Services provides managed IT support, cybersecurity, cloud solutions, and backup/disaster
            recovery to Tampa Bay businesses. During maintenance windows we may temporarily take systems offline
            to apply updates, improve performance, or strengthen security. If you have an urgent IT issue, our
            on-call technician is available for emergency support.
          </p>

          <div className="mb-8 p-6 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="font-medium text-foreground">Expected Completion</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We expect to be back online within the next few hours. Thank you for your patience.
            </p>
          </div>

          <div className="mb-8 p-6 rounded-lg border border-border bg-background">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
              <p className="font-medium text-foreground">Need Immediate Help?</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              If you have an urgent IT issue, please contact us directly:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="outline" href={telHref}>
                <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                {siteConfig.phone}
              </Button>
              <Button size="lg" variant="outline" href="/contact">
                <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                {siteConfig.email}
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            We apologize for any inconvenience and appreciate your understanding.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { Phone, AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  return (
    <section className="py-24 lg:py-32 min-h-screen flex items-center" aria-labelledby="error-heading">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full" aria-hidden="true" />
            <AlertTriangle className="relative mx-auto h-20 w-20 text-destructive" aria-hidden="true" />
          </div>
          
          <h1 id="error-heading" className="mb-4 text-4xl lg:text-5xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            We&apos;re sorry, but something unexpected happened. Our team has been notified and is working to fix it.
          </p>

          <div className="mb-8 p-6 rounded-lg border border-border bg-muted/30 text-left">
            <p className="text-sm font-medium text-foreground mb-2">Error details:</p>
            <p className="text-sm text-muted-foreground font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
            <Button size="lg" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
            <Button size="lg" variant="outline" href="/">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to home
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
            <Button size="lg" variant="outline" href={telHref}>
              <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
              {siteConfig.phone}
            </Button>
            <Button size="lg" variant="outline" href="/contact">
              <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
              Contact support
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Need immediate help?{" "}
            <Link href="/emergency" className="font-medium text-destructive hover:underline">
              Report an emergency →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SuccessStep } from "@/components/get-help";
import { StepIndicator } from "@/components/forms";
import { useFormAnalytics } from "@/lib/form-analytics";

export const LAST_REFERENCE_KEY = "nessco-last-reference";

function Step5Content() {
  const searchParams = useSearchParams();
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Form analytics for drop-off tracking
  useFormAnalytics({ step: 5, stepName: "success" });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Prefer the server-issued reference (?ref= from step 4), then the last
    // stored one, and only generate a local fallback for direct visits.
    const fromQuery = searchParams.get("ref");
    let ref = fromQuery;
    if (!ref && typeof window !== "undefined") {
      ref = sessionStorage.getItem(LAST_REFERENCE_KEY);
    }
    if (!ref) {
      ref = `REQ-${Date.now().toString(36).toUpperCase()}`;
    }
    setReferenceNumber(ref);
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24" aria-labelledby="step5-heading">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
              <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24" aria-labelledby="step5-heading">
      <div className="container">
        <div className="max-w-md mx-auto">
          <StepIndicator steps={["Problem", "Details", "Contact", "Review", "Done"]} current={5} completed={[1, 2, 3, 4]} />

          <SuccessStep referenceNumber={referenceNumber || undefined} />
        </div>
      </div>
    </section>
  );
}

export default function Step5Page() {
  return (
    <Suspense
      fallback={
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
                <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              </div>
            </div>
          </div>
        </section>
      }
    >
      <Step5Content />
    </Suspense>
  );
}

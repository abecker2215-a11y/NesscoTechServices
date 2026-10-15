/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SummaryStep } from "@/components/get-help";
import { StepIndicator } from "@/components/forms";
import { getStoredData, clearStoredData, StoredHelpRequest } from "@/lib/help-workflow";
import { getStoredReferralCode } from "@/components/refer/ReferralCapture";
import { trackEvent } from "@/lib/analytics";
import { useFormAnalytics } from "@/lib/form-analytics";

export default function Step4Page() {
  const router = useRouter();
  const [data, setData] = useState<StoredHelpRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Form analytics for drop-off tracking
  useFormAnalytics({ step: 4, stepName: "review" });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const stored = getStoredData();
    if (!stored?.category || !stored.contact?.name) {
      router.push("/get-help/step-1");
      return;
    }
    setData(stored);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24" aria-labelledby="step4-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-40 bg-muted rounded mt-8" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!data) return null;

  const handleSubmit = async () => {
    if (!data) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/help-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: data.category,
          answers: data.answers,
          photos: data.photos ?? [],
          photoNames: data.photoNames ?? [],
          startedAt: data.startedAt,
          contact: { ...data.contact, referralCode: getStoredReferralCode() ?? undefined },
          submittedAt: new Date().toISOString(),
        }),
      });

      const payload = await response.json().catch(() => null);
      const reference =
        response.ok && payload?.reference ? String(payload.reference) : null;
      if (reference && typeof window !== "undefined") {
        sessionStorage.setItem("nessco-last-reference", reference);
      }
      trackEvent("get_help_submit", { category: data.category, reference });
      clearStoredData();
      router.push(reference ? `/get-help/step-5?ref=${encodeURIComponent(reference)}` : "/get-help/step-5");
    } catch {
      clearStoredData();
      router.push("/get-help/step-5");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/get-help/step-3");
  };

  const handleEdit = (step: number) => {
    const paths = { 1: "/get-help/step-1", 2: "/get-help/step-2", 3: "/get-help/step-3" };
    router.push(paths[step as keyof typeof paths]);
  };

  return (
    <section className="py-16 lg:py-24" aria-labelledby="step4-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <StepIndicator steps={["Problem", "Details", "Contact", "Review", "Done"]} current={4} completed={[1, 2, 3]} />
          
          <div className="mt-8">
            <h1 id="step4-heading" className="text-3xl font-bold text-foreground mb-2">
              Review Your Request
            </h1>
            <p className="text-muted-foreground mb-8">
              Please verify all information before submitting. You can edit any section.
            </p>
          </div>

          <SummaryStep
            data={{
              category: data.category || "",
              answers: data.answers,
              photos: data.photos,
              photoNames: data.photoNames,
              contact: data.contact,
            }}
            onSubmit={handleSubmit}
            onBack={handleBack}
            onEdit={handleEdit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </section>
  );
}
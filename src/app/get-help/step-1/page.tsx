/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { ProblemSelector } from "@/components/get-help";
import { ResumeLink } from "@/components/get-help/ResumeLink";
import { StepIndicator } from "@/components/forms";
import { getStoredData, saveStoredData, helpCategories } from "@/lib/help-workflow";
import { businessPlans } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";
import { useFormAnalytics } from "@/lib/form-analytics";
import { beaconDraft } from "@/lib/funnel-client";
import { Monitor, Wifi, Mail, Shield, Database, Briefcase, HelpCircle, Wrench } from "lucide-react";
import { ResponseTimeIndicator, ViewersCounter } from "@/components/ui/TrustSignals";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  computer: Monitor,
  wifi: Wifi,
  mail: Mail,
  shield: Shield,
  database: Database,
  briefcase: Briefcase,
  "help-circle": HelpCircle,
  hardware: Wrench,
};

function LoadingSkeleton() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="step1-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Form analytics for drop-off tracking
  useFormAnalytics({ step: 1, stepName: "problem_selection" });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const preSelected = searchParams.get("category");
    if (preSelected && helpCategories.some((c) => c.id === preSelected)) {
      setSelectedCategory(preSelected);
    }
    const stored = getStoredData();
    if (stored?.category && !preSelected) {
      setSelectedCategory(stored.category);
    }
    // Stamp the draft start time once (fill-time spam trap, checked server-side).
    const draft = getStoredData() || { answers: {}, contact: { name: "", email: "", phone: "", preferredContact: "call" as const, preference: "either" as const, description: "" }, currentStep: 1 };
    if (!draft.startedAt) {
      draft.startedAt = new Date().toISOString();
      saveStoredData(draft);
    }
    // Offer to resume an in-progress draft (survives closed tabs via localStorage).
    if (stored?.category && stored.currentStep > 1 && !preSelected) {
      setResumeStep(Math.min(stored.currentStep, 4));
    }
    // Honor estimator / prefill params (?type=remote&hours=2, ?plan=managed&devices=12).
    const preType = searchParams.get("type");
    const preHours = searchParams.get("hours");
    const prePlan = searchParams.get("plan");
    const preDevices = searchParams.get("devices");
    if ((preType || preHours || prePlan || preDevices) && typeof window !== "undefined") {
      const current = getStoredData() || { answers: {}, contact: { name: "", email: "", phone: "", preferredContact: "call" as const, preference: "either" as const, description: "" }, currentStep: 1 };
      if (preType === "remote" || preType === "onsite" || preType === "either") {
        current.contact = { ...current.contact, preference: preType };
      }
      if (preHours && !Number.isNaN(Number(preHours))) {
        current.answers = { ...current.answers, estimatedTime: `${preHours} hour(s)` };
      }
      if (prePlan) {
        const planName = businessPlans.find((p) => p.id === prePlan)?.name ?? prePlan;
        const deviceNote = preDevices && !Number.isNaN(Number(preDevices)) ? ` (~${preDevices} devices)` : "";
        current.answers = { ...current.answers, interestedPlan: `${planName}${deviceNote}` };
      }
      saveStoredData(current);
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    const stored = getStoredData() || { answers: {}, contact: { name: "", email: "", phone: "", preferredContact: "call" as const, preference: "either" as const, description: "" }, currentStep: 1 };
    // Preserve estimator context (?hours=, ?plan=) across category selection.
    const { estimatedTime, interestedPlan } = stored.answers ?? {};
    stored.category = category;
    stored.answers = {
      ...(estimatedTime ? { estimatedTime } : {}),
      ...(interestedPlan ? { interestedPlan } : {}),
    };
    stored.photos = [];
    stored.photoNames = [];
    stored.currentStep = 2;
    saveStoredData(stored);
    trackEvent("get_help_start", { category });
    beaconDraft({ step: 1, category });
    router.push("/get-help/step-2");
  };

  const handleStartOver = () => {
    try {
      localStorage.removeItem("nessco-help-request");
      sessionStorage.removeItem("nessco-help-request");
    } catch {
      // ignore
    }
    setSelectedCategory("");
    setResumeStep(null);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <section className="py-16 lg:py-24" aria-labelledby="step1-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <StepIndicator steps={["Problem", "Details", "Contact", "Review", "Done"]} current={1} completed={[]} />
          
          <div className="mt-8 text-center">
            <h1 id="step1-heading" className="fluid-3xl lg:text-4xl font-bold text-foreground mb-4">
              What do you need help with?
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Select Your Issue Category</h2>
            <p className="fluid-lg text-muted-foreground mb-10">
              Select the category that best matches your issue. We&apos;ll ask a few relevant questions next.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <ResponseTimeIndicator />
            <ViewersCounter />
          </div>

          {resumeStep && resumeStep > 1 && (
            <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-4 text-left sm:flex sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-foreground">
                <strong>Welcome back.</strong> You have an in-progress request (step {resumeStep} of 5).
                Your answers were saved on this device.
              </p>
              <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
                <button
                  type="button"
                  onClick={() => router.push(`/get-help/step-${resumeStep}`)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Start over
                </button>
              </div>
            </div>
          )}

          <ProblemSelector
            onSelect={handleSelect}
            selected={selectedCategory}
            categories={helpCategories}
            icons={categoryIcons}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure which category? Select <strong>Something Else</strong> and describe it in your own words.
            </p>
          </div>

          <div className="mt-6">
            <ResumeLink step={resumeStep ?? 1} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Step1Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Step1Content />
    </Suspense>
  );
}
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QuestionStep } from "@/components/get-help";
import { PhotoUpload } from "@/components/get-help";
import { EmergencyBanner } from "@/components/get-help";
import { StepIndicator } from "@/components/forms";
import { getCategoryQuestions, getCategoryLabel, getStoredData, saveStoredData, isEmergencyRequest, StoredHelpRequest } from "@/lib/help-workflow";
import { trackEvent } from "@/lib/analytics";
import { useFormAnalytics } from "@/lib/form-analytics";
import { beaconDraft } from "@/lib/funnel-client";

export default function Step2Page() {
  const router = useRouter();
  const [questions, setQuestions] = useState<{ id: string; label: string; type: "text" | "textarea" | "select" | "radio"; required: boolean; options?: { value: string; label: string }[]; placeholder?: string }[]>([]);
  const [category, setCategory] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Form analytics for drop-off tracking
  useFormAnalytics({ step: 2, stepName: "details", category });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const stored = getStoredData();
    if (!stored?.category) {
      router.push("/get-help/step-1");
      return;
    }
    const catQuestions = getCategoryQuestions(stored.category);
    setQuestions(catQuestions);
    setCategory(stored.category);
    setCategoryLabel(getCategoryLabel(stored.category));
    if (stored.answers) {
      setValues(stored.answers);
    }
    if (stored.photos) {
      setPhotos(stored.photos);
    }
    if (stored.photoNames) {
      setPhotoNames(stored.photoNames);
    }
    setIsLoading(false);
  }, [router]);

  const isEmergency = isEmergencyRequest(category, values);
  const emergencyTracked = useRef(false);

  useEffect(() => {
    if (isEmergency && !emergencyTracked.current) {
      emergencyTracked.current = true;
      trackEvent("emergency_flagged", { category });
    }
    if (!isEmergency) emergencyTracked.current = false;
  }, [isEmergency, category]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24" aria-labelledby="step2-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="space-y-4 mt-8">
                <div className="h-16 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => { const next = { ...prev }; delete next[id]; return next; });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.required && !values[q.id]?.trim()) {
        newErrors[q.id] = `${q.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const stored: StoredHelpRequest = getStoredData() || { category: "", answers: {}, contact: { name: "", email: "", phone: "", preferredContact: "call", preference: "either", description: "" }, currentStep: 2 };
    stored.answers = values;
    stored.photos = photos;
    stored.photoNames = photoNames;
    stored.currentStep = 3;
    saveStoredData(stored);
    trackEvent("get_help_details", { photoCount: photos.length });
    beaconDraft({ step: 2, category, payload: { answers: values, photoCount: photos.length } });
    router.push("/get-help/step-3");
  };

  const handleBack = () => {
    router.push("/get-help/step-1");
  };

  return (
    <section className="py-16 lg:py-24" aria-labelledby="step2-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <StepIndicator steps={["Problem", "Details", "Contact", "Review", "Done"]} current={2} completed={[1]} />

          <div className="mt-8">
            <h1 id="step2-heading" className="text-3xl font-bold text-foreground mb-2">
              {categoryLabel} — A Few Details
            </h1>
            <p className="text-muted-foreground mb-8">
              Help us understand the issue better. Only required fields are marked.
            </p>
          </div>

          {isEmergency && (
            <div className="mb-8">
              <EmergencyBanner />
            </div>
          )}

          <QuestionStep
            questions={questions}
            values={values}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
            errors={errors}
          />

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Got a photo? <span className="font-normal text-muted-foreground">(optional)</span>
            </h2>
            <p className="mb-3 text-sm text-muted-foreground">
              An error message, blinking router lights, or damage helps us diagnose faster.
            </p>
            <PhotoUpload photos={photos} photoNames={photoNames} onChange={(p, n) => { setPhotos(p); setPhotoNames(n); }} />
          </div>
        </div>
      </div>
    </section>
  );
}
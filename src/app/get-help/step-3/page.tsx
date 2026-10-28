/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ContactForm } from "@/components/get-help";
import { EmergencyBanner } from "@/components/get-help";
import { StepIndicator } from "@/components/forms";
import { getStoredData, saveStoredData, isEmergencyRequest, StoredHelpRequest } from "@/lib/help-workflow";
import { trackEvent } from "@/lib/analytics";
import { useFormAnalytics } from "@/lib/form-analytics";
import { beaconDraft } from "@/lib/funnel-client";

export default function Step3Page() {
  const router = useRouter();
  const [values, setValues] = useState<StoredHelpRequest["contact"]>({
    name: "",
    email: "",
    phone: "",
    preferredContact: "call",
    preference: "either",
    description: "",
    preferredTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // Form analytics for drop-off tracking
  useFormAnalytics({ step: 3, stepName: "contact" });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const stored = getStoredData();
    if (!stored?.category) {
      router.push("/get-help/step-1");
      return;
    }
    if (stored.contact) {
      setValues(stored.contact);
    }
    // Resumed emergencies (e.g. via the Step 1 resume banner) still get the
    // call-now treatment even though Step 2 was skipped.
    setIsEmergency(isEmergencyRequest(stored.category, stored.answers ?? {}));
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24" aria-labelledby="step3-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="space-y-4 mt-8">
                <div className="h-16 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
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

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!values.name?.trim()) newErrors.name = "Name is required";
    if (!values.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = "Invalid email address";
    if (!values.phone?.trim()) newErrors.phone = "Phone is required";
    else if (!/^\+?1?\d{10}$/.test(values.phone.replace(/\D/g, ""))) newErrors.phone = "Invalid phone number (10 digits)";
    if (!values.preferredContact) newErrors.preferredContact = "Preferred contact method is required";
    if (!values.preference) newErrors.preference = "Service preference is required";
    if (!values.description?.trim()) newErrors.description = "Problem description is required";
    else if (values.description.trim().length < 10) newErrors.description = "Please provide more detail (at least 10 characters)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const stored: StoredHelpRequest = getStoredData() || { category: "", answers: {}, contact: { name: "", email: "", phone: "", preferredContact: "call", preference: "either", description: "" }, currentStep: 3 };
    stored.contact = values;
    stored.currentStep = 4;
    saveStoredData(stored);
    trackEvent("get_help_contact", { preference: values.preference });
    beaconDraft({ step: 3, email: values.email, name: values.name, category: stored.category });
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/get-help/step-4");
    }, 500);
  };

  const handleBack = () => {
    router.push("/get-help/step-2");
  };

  return (
    <section className="py-16 lg:py-24" aria-labelledby="step3-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <StepIndicator steps={["Problem", "Details", "Contact", "Review", "Done"]} current={3} completed={[1, 2]} />
          
          <div className="mt-8">
            <h1 id="step3-heading" className="text-3xl font-bold text-foreground mb-2">
              Your Contact Information
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Contact Details</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;ll use this to reach out and discuss your issue. No marketing emails.
            </p>
          </div>

          {isEmergency && (
            <div className="mb-8">
              <EmergencyBanner compact />
            </div>
          )}

          <ContactForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </section>
  );
}
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { businessPlans, fitPlan } from "@/lib/plans";
import { siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Wrench,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  PartyPopper,
} from "lucide-react";

type HelpType = "managed" | "project" | "security" | "unsure";
type PreferredContact = "call" | "email" | "text";

interface Answers {
  helpType: HelpType | "";
  services: string[];
  devices: string;
  industry: string;
  urgency: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
}

const helpTypes: { id: HelpType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "managed", label: "Ongoing IT management", description: "Proactive monitoring, support, and strategy month to month.", icon: Briefcase },
  { id: "project", label: "One-off fix or project", description: "A specific problem or rollout — billed by the hour or quoted.", icon: Wrench },
  { id: "security", label: "Security / compliance review", description: "Harden your setup, meet a requirement, or plan for an audit.", icon: ShieldCheck },
  { id: "unsure", label: "Not sure yet", description: "Tell us what's going on and we'll recommend the right approach.", icon: HelpCircle },
];

const serviceOptions = [
  "Managed IT support",
  "Cybersecurity & compliance",
  "Cloud & Microsoft 365",
  "Network & Wi-Fi",
  "Backup & disaster recovery",
  "Applications & automation",
  "Business phones & email",
  "Server & infrastructure",
];

const deviceRanges = [
  { id: "1-5", label: "1–5", value: 5 },
  { id: "6-10", label: "6–10", value: 10 },
  { id: "11-25", label: "11–25", value: 25 },
  { id: "26-50", label: "26–50", value: 50 },
  { id: "51+", label: "51+", value: 100 },
];

const urgencyOptions = [
  { id: "emergency", label: "Emergency — it's down right now" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "planning", label: "Planning ahead / researching" },
];

const industryOptions = [
  "Law firm",
  "Medical / dental",
  "Accounting / tax",
  "Real estate",
  "Trades / contractors",
  "Retail / e-commerce",
  "Nonprofit",
  "Restaurant / hospitality",
  "Professional services",
  "Other",
];

const TOTAL_STEPS = 5;

const emptyAnswers: Answers = {
  helpType: "",
  services: [],
  devices: "",
  industry: "",
  urgency: "",
  details: "",
  name: "",
  email: "",
  phone: "",
  preferredContact: "call",
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [startedAt] = useState(() => new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const toggleService = (service: string) =>
    setAnswers((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));

  const deviceCount = deviceRanges.find((r) => r.id === answers.devices)?.value ?? 10;
  const recommendedPlan = useMemo(() => fitPlan(deviceCount), [deviceCount]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return answers.helpType !== "";
      case 1:
        return answers.services.length > 0;
      case 2:
        return answers.devices !== "" && answers.industry !== "";
      case 3:
        return answers.urgency !== "";
      case 4:
        return (
          answers.name.trim().length >= 2 &&
          isValidEmail(answers.email) &&
          digitsOnly(answers.phone).length === 10
        );
      default:
        return true;
    }
  }, [step, answers]);

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
  };

  const handleNext = () => {
    if (!canContinue) return;
    trackEvent("quote_step", { step: step + 1 });
    if (step === 0 && answers.helpType) {
      trackEvent("quote_start", { help_type: answers.helpType });
    }
    goTo(Math.min(step + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    if (step === 0) return;
    trackEvent("quote_back", { from_step: step + 1 });
    goTo(step - 1);
  };

  const handleSubmit = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setError(null);

    const helpTypeLabel = helpTypes.find((h) => h.id === answers.helpType)?.label ?? "Not sure";
    const deviceLabel = deviceRanges.find((r) => r.id === answers.devices)?.label ?? answers.devices;
    const urgencyLabel = urgencyOptions.find((u) => u.id === answers.urgency)?.label ?? answers.urgency;

    const message = [
      "Quote builder request",
      "",
      `Looking for: ${helpTypeLabel}`,
      `Focus areas: ${answers.services.join(", ") || "Not specified"}`,
      `Devices: ${deviceLabel}`,
      `Industry: ${answers.industry}`,
      `Timeline: ${urgencyLabel}`,
      `Likely fit: ${recommendedPlan.name} (${recommendedPlan.fitLabel})`,
      answers.details.trim() ? `\nDetails:\n${answers.details.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers.name.trim(),
          email: answers.email.trim(),
          phone: digitsOnly(answers.phone),
          subject: "sales",
          message,
          startedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(typeof data.message === "string" ? data.message : "Something went wrong. Please try again or call us.");
      }
      trackEvent("quote_submit", { help_type: answers.helpType || "unsure" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PartyPopper className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Request received</h2>
        <p className="mt-3 text-muted-foreground">
          Thanks {answers.name.split(" ")[0] || "there"} — we&apos;ll review your answers and reply within 2
          business hours (Mon–Fri 8am–6pm) with next steps and a clear estimate.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" href={`tel:${digitsOnly(siteConfig.phone)}`} className="flex-1">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone}
          </Button>
          <Button size="lg" variant="outline" href="/services" className="flex-1">
            Browse services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {Math.min(step + 1, TOTAL_STEPS)} of {TOTAL_STEPS}</span>
          <span>{Math.round((Math.min(step, TOTAL_STEPS - 1) / (TOTAL_STEPS - 1)) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={Math.min(step + 1, TOTAL_STEPS)}>
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(Math.min(step + 1, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="text-2xl font-bold text-foreground">What kind of help are you after?</legend>
            <p className="mt-2 text-muted-foreground">This helps us route you to the right options.</p>
            <div className="mt-6 grid gap-3">
              {helpTypes.map((h) => {
                const Icon = h.icon;
                const active = answers.helpType === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => update("helpType", h.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-semibold text-foreground">
                        {h.label}
                        {active && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{h.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-2xl font-bold text-foreground">Which areas do you need?</legend>
            <p className="mt-2 text-muted-foreground">Pick everything that applies — you can change this later.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {serviceOptions.map((service) => {
                const active = answers.services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    {service}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-2xl font-bold text-foreground">A bit about your business</legend>
            <p className="mt-2 text-muted-foreground">Rough numbers are fine — we&apos;ll confirm on the call.</p>
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-foreground">How many computers/devices?</p>
              <div className="flex flex-wrap gap-2">
                {deviceRanges.map((range) => {
                  const active = answers.devices === range.id;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => update("devices", range.id)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="quote-industry" className="mb-2 block text-sm font-semibold text-foreground">
                Industry
              </label>
              <select
                id="quote-industry"
                value={answers.industry}
                onChange={(e) => update("industry", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select an industry…</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-2xl font-bold text-foreground">How soon do you need this?</legend>
            <p className="mt-2 text-muted-foreground">So we can prioritise properly.</p>
            <div className="mt-6 grid gap-3">
              {urgencyOptions.map((option) => {
                const active = answers.urgency === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => update("urgency", option.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors",
                      active ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-primary bg-primary" : "border-border")}>
                      {active && <Check className="h-3 w-3 text-primary-foreground" aria-hidden="true" />}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-6">
              <label htmlFor="quote-details" className="mb-2 block text-sm font-semibold text-foreground">
                Anything else we should know? <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="quote-details"
                value={answers.details}
                onChange={(e) => update("details", e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="e.g. We're moving offices in March and the Wi-Fi keeps dropping."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-2xl font-bold text-foreground">Where should we send your estimate?</legend>
            <p className="mt-2 text-muted-foreground">No spam, ever. We reply within 2 business hours.</p>
            <div className="mt-6 grid gap-4">
              <div>
                <label htmlFor="quote-name" className="mb-2 block text-sm font-semibold text-foreground">Name</label>
                <input
                  id="quote-name"
                  value={answers.name}
                  onChange={(e) => update("name", e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="quote-email" className="mb-2 block text-sm font-semibold text-foreground">Email</label>
                  <input
                    id="quote-email"
                    type="email"
                    value={answers.email}
                    onChange={(e) => update("email", e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="mb-2 block text-sm font-semibold text-foreground">Phone</label>
                  <input
                    id="quote-phone"
                    type="tel"
                    value={answers.phone}
                    onChange={(e) => update("phone", digitsOnly(e.target.value))}
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Preferred contact</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: "call" as const, label: "Call", icon: Phone },
                    { id: "email" as const, label: "Email", icon: Mail },
                    { id: "text" as const, label: "Text", icon: MessageSquare },
                  ]).map((option) => {
                    const active = answers.preferredContact === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => update("preferredContact", option.id)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {step === TOTAL_STEPS && (
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your likely starting point</h2>
            <p className="mt-2 text-muted-foreground">
              Based on your answers, here&apos;s a ballpark. We&apos;ll confirm exact pricing after a short call —
              no surprises, ever.
            </p>

            {answers.helpType === "project" ? (
              <div className="mt-6 rounded-xl border border-primary/40 bg-primary/5 p-6">
                <p className="text-sm font-semibold text-primary">Hourly, pay-as-you-go</p>
                <p className="mt-1 text-3xl font-bold text-foreground">${businessPlans[0].price}/hr</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {businessPlans[0].description} On-site adds travel time. Larger jobs are quoted up front.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-primary/40 bg-primary/5 p-6">
                <p className="text-sm font-semibold text-primary">Recommended plan</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {recommendedPlan.name}
                  <span className="ml-2 text-lg font-medium text-muted-foreground">
                    ${recommendedPlan.price}/mo
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{recommendedPlan.fitLabel}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2" role="list">
                  {recommendedPlan.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              Prefer month-to-month or a different mix?{" "}
              <Link href="/pricing" className="font-medium text-primary hover:underline">
                Compare all plans
              </Link>{" "}
              or just tell us on the call.
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  "Send my request"
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleBack} disabled={submitting}>
                Back
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              By sending, you agree to be contacted about your request. No spam, no obligation.
            </p>
          </div>
        )}

        {step < TOTAL_STEPS && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
            <Button size="lg" onClick={handleNext} disabled={!canContinue}>
              Continue
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

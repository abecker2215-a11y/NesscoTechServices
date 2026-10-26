"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";
import { AlertTriangle, CheckCircle, X, Zap, Shield, Wifi, Database, Monitor, Phone, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TriageStep {
  id: string;
  question: string;
  description: string;
  options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }>; nextStep?: string; isEmergency?: boolean }[];
}

interface EmergencyTriageWidgetProps {
  inline?: boolean;
}

const triageFlow: Record<string, TriageStep> = {
  start: {
    id: "start",
    question: "What type of issue are you experiencing?",
    description: "Select the category that best matches your situation",
    options: [
      { label: "Security / Hacked / Ransomware", value: "security", icon: Shield, isEmergency: true },
      { label: "Computer won't start / Hardware issue", value: "hardware", icon: Monitor },
      { label: "Wi-Fi / Internet / Network", value: "wifi", icon: Wifi },
      { label: "Email / Microsoft 365 / Cloud", value: "email", icon: Database },
      { label: "Backup / Data recovery", value: "backup", icon: Database },
      { label: "Something else", value: "other", icon: AlertTriangle },
    ],
  },
  security: {
    id: "security",
    question: "Is this an active security emergency?",
    description: "Ransomware, active breach, data theft, or encrypted files right now",
    options: [
      { label: "YES — Active emergency", value: "emergency_yes", isEmergency: true },
      { label: "No — Suspicious activity / prevention", value: "security_prevention" },
    ],
  },
  hardware: {
    id: "hardware",
    question: "What's happening with the device?",
    description: "Help us understand the hardware issue",
    options: [
      { label: "Won't power on at all", value: "hw_power" },
      { label: "Screen cracked / broken display", value: "hw_screen" },
      { label: "Making strange noises / overheating", value: "hw_noise" },
      { label: "Peripheral issue (keyboard, mouse, printer)", value: "hw_peripheral" },
    ],
  },
  wifi: {
    id: "wifi",
    question: "What's the Wi-Fi issue?",
    description: "Narrow down the network problem",
    options: [
      { label: "Slow speeds / buffering", value: "wifi_slow" },
      { label: "Dead zones / no signal in rooms", value: "wifi_deadzone" },
      { label: "Keeps disconnecting / dropping", value: "wifi_drops" },
      { label: "Can't connect new device", value: "wifi_connect" },
      { label: "Router / modem lights look wrong", value: "wifi_router" },
    ],
  },
  email: {
    id: "email",
    question: "What's the email / cloud issue?",
    description: "Microsoft 365, Google Workspace, or other email problems",
    options: [
      { label: "Can't send or receive email", value: "email_sync" },
      { label: "MFA / login / password problems", value: "email_mfa" },
      { label: "Migration / setup needed", value: "email_migration" },
      { label: "Spam / phishing / security", value: "email_security" },
    ],
  },
  backup: {
    id: "backup",
    question: "What's the backup situation?",
    description: "Data loss, backup failure, or setting up protection",
    options: [
      { label: "Files lost / deleted / corrupted", value: "backup_recovery" },
      { label: "Backup failing / not running", value: "backup_failing" },
      { label: "Need to set up backup from scratch", value: "backup_setup" },
      { label: "Ransomware encrypted backups", value: "backup_ransomware", isEmergency: true },
    ],
  },
  other: {
    id: "other",
    question: "Tell us in your own words",
    description: "We'll route you to the right help",
    options: [
      { label: "Start a service request", value: "get_help" },
      { label: "Browse Fix-It Guides", value: "guides" },
      { label: "Call us directly", value: "call", isEmergency: false },
    ],
  },
};

const emergencyResult: TriageStep = {
  id: "emergency",
  question: "Active Security Emergency Detected",
  description: "Don't use the affected device. Page the on-call tech for the fastest response — live status included.",
  options: [
    { label: `Call Emergency Line: ${siteConfig.phone}`, value: "call_emergency", icon: Phone, isEmergency: true },
    { label: "Page the on-call tech online", value: "emergency_page" },
    { label: "Start Emergency Request Form", value: "emergency_form" },
  ],
};

const standardResult: TriageStep = {
  id: "standard",
  question: "Ready to get help?",
  description: "We'll route your request to the right technician",
  options: [
    { label: "Start Service Request", value: "get_help" },
    { label: "Try a Fix-It Guide First", value: "guides" },
    { label: `Call ${siteConfig.phone}`, value: "call" },
  ],
};

export function EmergencyTriageWidget({ inline = false }: EmergencyTriageWidgetProps) {
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<"emergency" | "standard" | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOptionSelect = (optionValue: string) => {
    trackEvent("triage_select", { step: currentStep, choice: optionValue });

    if (optionValue === "emergency_yes" || optionValue === "backup_ransomware") {
      setResult("emergency");
      setCurrentStep("emergency");
      return;
    }

    if (optionValue === "get_help" || optionValue === "emergency_form") {
      router.push("/get-help?category=" + (currentStep === "security" ? "security" : currentStep));
      return;
    }

    if (optionValue === "emergency_page") {
      router.push("/emergency");
      return;
    }

    if (optionValue === "guides") {
      router.push("/guides");
      return;
    }

    if (optionValue === "call" || optionValue === "call_emergency") {
      window.location.assign(`tel:${siteConfig.phone.replace(/\D/g, "")}`);
      return;
    }

    const nextStep = triageFlow[optionValue];
    if (nextStep) {
      setCurrentStep(optionValue);
    } else {
      setResult("standard");
      setCurrentStep("standard");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep("start");
    setResult(null);
  };

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent("triage_open");
  };

  useEffect(() => {
    if (isOpen) {
      containerRef.current?.focus();
    }
  }, [isOpen]);

  const step = result ? (result === "emergency" ? emergencyResult : standardResult) : triageFlow[currentStep];

  // Inline mode: just render the trigger button (for header)
  if (inline) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="whitespace-nowrap gap-1.5 bg-gradient-to-r from-orange-500 to-pink-500 border-none hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-sm hover:shadow-md transition-all"
        aria-label="Emergency IT triage"
        aria-expanded={isOpen}
      >
        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Emergency Help</span>
      </Button>
    );
  }

  // Default mode: fixed button + modal
  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-lg animate-pulse-ring hover:bg-destructive/90 transition-all hover:scale-105 tap-feedback lg:top-20 lg:right-20 print:hidden"
          aria-label="Emergency IT triage"
          aria-expanded="false"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Emergency IT Help</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="triage-title"
        >
          <div
            ref={containerRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-fade-in-up"
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <h2 id="triage-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="h-4 w-4 text-destructive" aria-hidden="true" />
                Emergency IT Triage
              </h2>
              <button
                onClick={handleClose}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close triage"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                  <span className="text-muted-foreground">Analyzing...</span>
                </div>
              )}

              {!loading && (
                <>
                  <div className="text-center">
                    <div className={cn(
                      "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
                      result === "emergency" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                      {result === "emergency" ? (
                        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <CheckCircle className="h-6 w-6" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{step.question}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  <div className="space-y-2" role="list">
                    {step.options.map((opt, i) => (
                      <button
                        key={`${opt.value}-${i}`}
                        type="button"
                        onClick={() => {
                          if (opt.isEmergency) setLoading(true);
                          handleOptionSelect(opt.value);
                        }}
                        disabled={loading}
                        className={cn(
                          "w-full group flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-all tap-feedback",
                          opt.isEmergency
                            ? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
                            : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {opt.icon && <opt.icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                          <span className="font-medium">{opt.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                      </button>
                    ))}
                  </div>

                  {!result && (
                    <button
                      onClick={handleClose}
                      className="w-full mt-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
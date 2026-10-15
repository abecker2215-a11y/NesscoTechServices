"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Settings, Shield } from "lucide-react";
import { useIsMounted } from "@/lib/use-is-mounted";
import {
  acceptAnalyticsOnly,
  rejectAllConsent,
} from "@/lib/consent";

const CONSENT_VERSION = 1;

const DEFAULT_CONSENT: Record<string, "granted" | "denied"> = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

type ConsentCategory = {
  key: keyof import("@/lib/consent").ConsentState;
  label: string;
  description: string;
  required: boolean;
};

const CATEGORIES: ConsentCategory[] = [
  {
    key: "analytics_storage",
    label: "Analytics",
    description: "Helps us understand how visitors interact with our website",
    required: false,
  },
  {
    key: "ad_storage",
    label: "Advertising",
    description: "Allows personalized ads and ad performance measurement",
    required: false,
  },
  {
    key: "ad_user_data",
    label: "Ad User Data",
    description: "Allows sending user data to Google for advertising purposes",
    required: false,
  },
  {
    key: "ad_personalization",
    label: "Ad Personalization",
    description: "Enables personalized advertising based on your activity",
    required: false,
  },
];

function getStoredConsent(): Record<string, "granted" | "denied"> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("nessco-consent");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed.consent;
  } catch {
    return null;
  }
}

function setStoredConsent(consent: Record<string, "granted" | "denied">) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "nessco-consent",
    JSON.stringify({ version: CONSENT_VERSION, consent, timestamp: Date.now() })
  );
}

function applyStoredConsent() {
  const stored = getStoredConsent();
  if (stored && typeof window !== "undefined" && window.gtag) {
    const consent: Record<string, "granted" | "denied"> = {};
    for (const [key, value] of Object.entries(stored)) {
      if (value === "granted") {
        consent[key] = "granted";
      }
    }
    if (Object.keys(consent).length > 0) {
      window.gtag("consent", "update", consent);
    }
  }
}

export function ConsentBanner() {
  const mounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(() => getStoredConsent() === null);
  const [_showCustomize, setShowCustomize] = useState(false);
  const [consent, setConsent] = useState<Record<string, "granted" | "denied">>(
    () => getStoredConsent() ?? DEFAULT_CONSENT
  );
  const [_hasInteracted, setHasInteracted] = useState(false);

  // Apply any previously stored consent to the ad/analytics stack once on mount.
  useEffect(() => {
    if (mounted && getStoredConsent()) {
      applyStoredConsent();
    }
  }, [mounted]);

  const handleRejectAll = useCallback(() => {
    const newConsent = {
      analytics_storage: "denied" as const,
      ad_storage: "denied" as const,
      ad_user_data: "denied" as const,
      ad_personalization: "denied" as const,
    };
    setConsent(newConsent);
    setStoredConsent(newConsent);
    rejectAllConsent();
    setIsOpen(false);
    setHasInteracted(true);
  }, []);

  const handleAcceptAnalytics = useCallback(() => {
    const newConsent = {
      analytics_storage: "granted" as const,
      ad_storage: "denied" as const,
      ad_user_data: "denied" as const,
      ad_personalization: "denied" as const,
    };
    setConsent(newConsent);
    setStoredConsent(newConsent);
    acceptAnalyticsOnly();
    setIsOpen(false);
    setHasInteracted(true);
  }, []);

  const handleCategoryToggle = useCallback(
    (key: string, value: "granted" | "denied") => {
      const newConsent = { ...consent, [key]: value };
      setConsent(newConsent);
    },
    [consent]
  );

  // Avoid rendering until mounted so the stored-consent lookup can't cause a hydration mismatch.
  if (!mounted) return null;

  if (!isOpen) {
    // Floating "Privacy" button to reopen banner
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-lg bg-muted/95 backdrop-blur-sm px-3 py-2 text-sm text-muted-foreground shadow-lg border border-border hover:bg-muted transition-all duration-200"
        aria-label="Cookie preferences"
      >
        <span className="hidden sm:inline">Cookie Preferences</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 id="consent-title" className="text-lg font-semibold text-foreground">
                  Cookie Preferences
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                We use cookies to improve your experience, analyze traffic, and personalize content.
                You can customize your preferences below.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="rounded-lg border border-border bg-background p-4">
              <h3 className="font-medium text-foreground mb-3">Cookie Categories</h3>
              <div className="space-y-3">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        id={category.key}
                        checked={consent[category.key] === "granted"}
                        onChange={(e) =>
                          handleCategoryToggle(category.key, e.target.checked ? "granted" : "denied")
                        }
                        disabled={category.required}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-required={category.required}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={category.key}
                          className="font-medium text-sm text-foreground cursor-pointer"
                        >
                          {category.label}
                          {category.required && (
                            <span className="text-xs text-muted-foreground">(Required)</span>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border bg-background hover:bg-muted transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={() => {
                  setShowCustomize(false);
                  handleAcceptAnalytics();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border bg-background hover:bg-muted transition-colors"
              >
                Analytics Only
              </button>
              <button
                onClick={() => {
                  setShowCustomize(true);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground border border-border bg-background hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4 mr-1" />
                Customize
              </button>
              <button
                onClick={() => {
                  // Accept all and close
                  const newConsent = {
                    analytics_storage: "granted" as const,
                    ad_storage: "granted" as const,
                    ad_user_data: "granted" as const,
                    ad_personalization: "granted" as const,
                  };
                  setConsent(newConsent);
                  if (typeof window !== "undefined") {
                    localStorage.setItem(
                      "nessco-consent",
                      JSON.stringify({
                        version: 1,
                        consent: newConsent,
                        timestamp: Date.now(),
                      })
                    );
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag("consent", "update", newConsent);
                    }
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm shadow-sm hover:bg-primary/90 transition-colors"
              >
                Accept All
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You can change your preferences at any time by clicking the{" "}
              <span className="text-primary underline">Cookie Preferences</span>{" "}
              button in the bottom corner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initialize consent on app load
export function useConsentInit() {
  useEffect(() => {
    // Apply stored consent on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nessco-consent");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.version === 1 && parsed.consent && window.gtag) {
            const consent = parsed.consent;
            const granted: Record<string, "granted"> = {};
            for (const [key, value] of Object.entries(consent)) {
              if (value === "granted") {
                granted[key] = "granted";
              }
            }
            if (Object.keys(granted).length > 0 && window.gtag) {
              window.gtag("consent", "update", granted);
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);
}

export default ConsentBanner;
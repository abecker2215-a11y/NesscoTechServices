"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface FormAnalyticsOptions {
  step: number;
  stepName: string;
  category?: string;
}

export function useFormAnalytics({ step, stepName, category }: FormAnalyticsOptions) {
  const hasTrackedView = useRef(false);
  const hasTrackedBack = useRef(false);
  const startTime = useRef<number>(0);

  // Initialize startTime on mount
  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  // Track page view / step entry
  useEffect(() => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      startTime.current = Date.now();
      trackEvent("get_help_step_view", { step, stepName, category });
    }
  }, [step, stepName, category]);

  // Track back navigation
  const trackBack = () => {
    if (!hasTrackedBack.current) {
      hasTrackedBack.current = true;
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent("get_help_step_back", { step, stepName, category, timeSpent });
    }
  };

  // Track abandonment (when user leaves page without completing)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasTrackedView.current && !hasTrackedBack.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        // Use sendBeacon for reliable tracking on page unload
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/analytics/beacon",
            JSON.stringify({
              event: "get_help_step_abandon",
              step,
              stepName,
              category,
              timeSpent,
              timestamp: Date.now(),
            })
          );
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step, stepName, category]);

  return { trackBack };
}
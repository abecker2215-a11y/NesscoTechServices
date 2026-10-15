"use client";

import { getStoredReferralCode } from "@/components/refer/ReferralCapture";

export interface FunnelBeacon {
  email?: string;
  name?: string;
  step: number;
  category?: string;
  payload?: Record<string, unknown>;
}

/** Fire-and-forget server-side draft capture for abandonment recovery. */
export function beaconDraft(beacon: FunnelBeacon): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(beacon);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/funnel/draft",
        new Blob([body], { type: "application/json" })
      );
    } else {
      fetch("/api/funnel/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics must never break the user flow.
  }
}

export function beaconReferral(): string | null {
  return getStoredReferralCode();
}

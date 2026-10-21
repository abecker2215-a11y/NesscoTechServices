/**
 * Provider-agnostic funnel analytics.
 *
 * Every event goes to three places:
 *  1. `window.dataLayer` — picked up automatically by Google Tag Manager /
 *     GA4 if you ever add it.
 *  2. Google Analytics 4 via `gtag('event', ...)` — active now that the GA4
 *     gtag snippet is in `src/app/layout.tsx` (NEXT_PUBLIC_GA_ID).
 *  3. Plausible custom events (`plausible('event-name')`) — active now that
 *     the Plausible snippet is in `src/app/layout.tsx`. Plausible props are
 *     flat strings only, so values are stringified and personal data must
 *     never be passed here (see Privacy Policy).
 *
 * No-ops on the server and when providers are blocked. Analytics must never
 * break the user flow.
 */
export type GtagFn = (command: string, ...args: unknown[]) => void;

export type FunnelEvent =
  | "hero_quiz_pick"
  | "pricing_tab_select"
  | "get_help_start"
  | "get_help_details"
  | "get_help_contact"
  | "get_help_submit"
  | "photo_added"
  | "photo_removed"
  | "slot_picked"
  | "estimator_cta"
  | "plan_calculator_cta"
  | "booking_click"
  | "call_click"
  | "sms_click"
  | "guide_feedback"
  | "guide_copy_link"
  | "guide_print"
  | "chat_open"
  | "chat_ask"
  | "chat_ticket_nudge"
  | "chat_ticket_open"
  | "chat_ticket_filed"
  | "storm_report_requested"
  | "video_request"
  | "emergency_submit"
  | "push_enable"
  | "push_disable"
  | "switch_incumbent"
  | "switch_plan_sent"
  | "roi_case_sent"
  | "referral_share"
  | "referral_submit"
  | "offers_cta"
  | "guide_request"
  | "newsletter_subscribe"
  | "contact_submit"
  | "emergency_flagged"
  | "exit_intent_triggered"
  | "exit_intent_dismissed"
  | "exit_intent_converted"
  | "sticky_cta_dismissed"
  | "sticky_cta_call"
  | "sticky_cta_click"
  | "video_play"
  | "case_study_click"
  | "blog_click"
  | "get_help_step_view"
  | "get_help_step_back"
  | "get_help_step_abandon"
  | "triage_open"
  | "triage_select"
  | "quote_start"
  | "quote_step"
  | "quote_back"
  | "quote_submit";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: GtagFn;
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(event: FunnelEvent, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props });
    // Send to Google Analytics 4 so funnel/conversion events appear in GA4
    // reporting, not just Plausible. Requires the GA4 gtag snippet in layout.tsx.
    if (typeof window.gtag === "function") {
      window.gtag("event", event, ga4SafeProps(props));
    }
    if (typeof window.plausible === "function") {
      const safeProps: Record<string, string> = {};
      for (const [key, value] of Object.entries(props ?? {})) {
        if (value === undefined || value === null) continue;
        const str = String(value);
        // Plausible prop values should stay short and never contain PII.
        if (str.length > 0 && str.length <= 120) safeProps[key] = str;
      }
      window.plausible(event, { props: safeProps });
    }
    if (process.env.NODE_ENV === "development") {
      console.debug(`[analytics] ${event}`, props ?? {});
    }
  } catch {
    // Analytics must never break the user flow.
  }
}

/** Sanitize event props for GA4: drop objects/arrays, cap string length,
 *  and strip known PII keys. Never passes email/phone/name to GA4. */
function ga4SafeProps(props?: Record<string, unknown>): Record<string, unknown> {
  if (!props) return {};
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    const k = key.toLowerCase();
    if (k.includes("email") || k.includes("phone") || k.includes("name")) continue; // no PII
    if (value === undefined || value === null) continue;
    if (typeof value === "object") continue; // GA4 drops non-primitives
    let str = String(value);
    if (str.length > 0) {
      if (str.length > 500) str = str.slice(0, 500) + "…"; // GA4 param value limit
      clean[key] = str;
    }
  }
  return clean;
}

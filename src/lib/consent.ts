/**
 * Consent Mode v2 utilities for Google Analytics 4
 * Call these functions when user interacts with your consent banner
 */

export type ConsentState = {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
};

/** Extend Window type for gtag and dataLayer */
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Update consent state when user interacts with consent banner
 * Call this when user accepts/rejects cookies
 */
export function updateConsent(consent: ConsentState) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', consent);
  }
}

/**
 * Grant analytics only (user accepts analytics but rejects ads)
 */
export function acceptAnalyticsOnly() {
  updateConsent({
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/**
 * Deny all (user clicks "Reject All")
 */
export function rejectAllConsent() {
  updateConsent({
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/**
 * Get current consent state from dataLayer
 */
export function getConsentState(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  
  const dataLayer = window.dataLayer;
  if (!dataLayer || !Array.isArray(dataLayer)) return null;
  
  // Find the most recent consent state
  for (let i = dataLayer.length - 1; i >= 0; i--) {
    const entry = dataLayer[i];
    if (entry && typeof entry === 'object' && 'consent' in entry) {
      return entry.consent as ConsentState;
    }
  }
  return null;
}

/**
 * Apply stored consent from localStorage to gtag on page load
 */
export function applyStoredConsent() {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('nessco-consent');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === 1 && parsed.consent && window.gtag) {
        const consent = parsed.consent;
        const granted: Record<string, 'granted'> = {};
        for (const [key, value] of Object.entries(consent)) {
          if (value === 'granted') {
            granted[key] = 'granted';
          }
        }
        if (Object.keys(granted).length > 0 && window.gtag) {
          window.gtag('consent', 'update', granted);
        }
      }
    }
  } catch {
    // Ignore parse errors
  }
}
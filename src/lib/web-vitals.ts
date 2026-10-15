import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from "web-vitals";

const VITALS_ENDPOINT = "/api/analytics/vitals";

interface VitalsConfig {
  endpoint?: string;
  debug?: boolean;
  sampleRate?: number;
}

function sendToAnalytics(metric: Metric, config: VitalsConfig = {}) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    entries: metric.entries?.map((e) => ({
      name: e.name,
      entryType: e.entryType,
      startTime: e.startTime,
      duration: e.duration,
    })),
    navigationType: getNavigationType(),
    timestamp: Date.now(),
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  if (config.debug) {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
  }

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(config.endpoint || VITALS_ENDPOINT, JSON.stringify(body));
  } else if (typeof fetch !== "undefined") {
    fetch(config.endpoint || VITALS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
}

function getNavigationType(): string {
  if (typeof window === "undefined") return "unknown";
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  return navigation?.type ?? "unknown";
}

export function initWebVitals(config: VitalsConfig = {}) {
  if (typeof window === "undefined") return;

  const sampleRate = config.sampleRate ?? 1;
  if (Math.random() > sampleRate) return;

  const handleMetric = (metric: Metric) => sendToAnalytics(metric, config);

  onCLS(handleMetric);
  onINP(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);

  if (config.debug) {
    console.log("[Web Vitals] Initialized with sample rate:", sampleRate);
  }
}
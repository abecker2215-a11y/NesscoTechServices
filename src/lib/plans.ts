import type { PricingPlan } from "./types";

/**
 * Single source of truth for business IT plans. Used by the pricing page
 * cards AND the plan calculator — update prices/limits here once.
 */
export interface BusinessPlan extends PricingPlan {
  /** Max devices included; null = unlimited. */
  deviceLimit: number | null;
  /** Short label for the calculator recommendation. */
  fitLabel: string;
}

export const businessPlans: BusinessPlan[] = [
  {
    id: "payg",
    name: "Pay As You Go",
    description: "Occasional help when something breaks. No monthly commitment.",
    price: 75,
    period: "hour",
    features: [
      "Remote & on-site support",
      "No monthly fees",
      "Pay only for time used",
      "Same-day service available",
      "No contract required",
    ],
    ctaText: "Request Service",
    ctaHref: "/get-help",
    type: "remote",
    deviceLimit: null,
    fitLabel: "No device limit — billed hourly",
  },
  {
    id: "essentials",
    name: "Essentials",
    description: "Basic monitoring, patching, and help desk for small teams.",
    price: 499,
    period: "month",
    features: [
      "Remote monitoring & alerts",
      "Automated patch management",
      "Help desk (email/phone)",
      "Monthly health report",
      "Up to 10 devices",
    ],
    ctaText: "Get Started",
    ctaHref: "/contact",
    type: "business",
    deviceLimit: 10,
    fitLabel: "Up to 10 devices",
  },
  {
    id: "managed",
    name: "Managed",
    description: "Full IT management: monitoring, security, backups, strategy.",
    price: 899,
    period: "month",
    features: [
      "Everything in Essentials",
      "Managed antivirus/EDR",
      "Automated cloud backups",
      "Microsoft 365 management",
      "Network monitoring",
      "Quarterly business review",
      "Up to 25 devices",
    ],
    ctaText: "Get Started",
    ctaHref: "/contact",
    type: "business",
    popular: true,
    deviceLimit: 25,
    fitLabel: "Up to 25 devices",
  },
  {
    id: "complete",
    name: "Complete",
    description: "Managed IT + advanced security, compliance, and vCIO guidance.",
    price: 1399,
    period: "month",
    features: [
      "Everything in Managed",
      "Advanced threat protection",
      "Compliance documentation",
      "vCIO strategic planning",
      "Vendor management",
      "Unlimited devices",
      "Priority response (1hr)",
    ],
    ctaText: "Contact Sales",
    ctaHref: "/contact",
    type: "business",
    deviceLimit: null,
    fitLabel: "Unlimited devices",
  },
];

/** Monthly plans only (excludes hourly Pay As You Go), cheapest first. */
export const monthlyPlans: BusinessPlan[] = businessPlans.filter((p) => p.period === "month");

/** Smallest monthly plan that covers `deviceCount` devices. */
export function fitPlan(deviceCount: number): BusinessPlan {
  return (
    monthlyPlans.find((p) => p.deviceLimit === null || deviceCount <= p.deviceLimit) ??
    monthlyPlans[monthlyPlans.length - 1]
  );
}

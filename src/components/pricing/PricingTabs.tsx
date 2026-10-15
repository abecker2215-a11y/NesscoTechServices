"use client";

import { useState } from "react";
import { Home, Building2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { PricingCard, PriceEstimator } from "@/components/pricing";
import { BusinessPlanCalculator } from "@/components/pricing/BusinessPlanCalculator";
import { businessPlans } from "@/lib/plans";

type Tab = "home" | "business";

const hourlyPlans = [
  {
    id: "remote",
    name: "Remote IT Help",
    description: "Secure remote desktop session. Ideal for software issues, configuration, and quick fixes.",
    price: 75,
    period: "hour" as const,
    features: [
      "No travel time or trip charge",
      "Available same day in most cases",
      "You watch everything we do",
      "Works anywhere with internet",
      "Best for: email, software, browser, printer setup",
    ],
    ctaText: "Request Remote Help",
    ctaHref: "/get-help?category=computer",
    type: "remote" as const,
  },
  {
    id: "onsite",
    name: "On-Site IT Help",
    description: "We come to your business or office in the Tampa Bay area. Required for hardware and cabling work.",
    price: 125,
    period: "hour" as const,
    features: [
      "Hardware repair & replacement",
      "Network cabling & Wi-Fi installation",
      "Device setup & data migration",
      "Server & rack work",
      "Best for: broken screens, dead computers, network installs",
    ],
    ctaText: "Schedule On-Site Visit",
    ctaHref: "/get-help?category=hardware",
    type: "onsite" as const,
    popular: true,
  },
];

const monthlyPlans = businessPlans.filter((p) => p.period === "month");

export function PricingTabs() {
  const [tab, setTab] = useState<Tab>("home");

  const select = (t: Tab) => {
    setTab(t);
    trackEvent("pricing_tab_select", { tab: t });
  };

  return (
    <div>
      <div
        className="mx-auto mb-10 flex max-w-md rounded-lg border border-border bg-muted/50 p-1"
        role="tablist"
        aria-label="Pricing audience"
      >
        {(
          [
            { id: "home", label: "Home & Personal", icon: Home },
            { id: "business", label: "Business", icon: Building2 },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => select(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-4 w-4" aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "home" ? (
        <div role="tabpanel" aria-label="Home pricing">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Hourly Services</h2>
          <p className="text-center text-muted-foreground mb-8">
            Pay as you go. You approve the estimate before we start — no contracts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {hourlyPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="mt-10 max-w-5xl mx-auto">
            <PriceEstimator />
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            No fix, no fee on remote work we can&apos;t resolve. Final price confirmed before work starts.
          </p>
        </div>
      ) : (
        <div role="tabpanel" aria-label="Business pricing">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Business IT Plans (Monthly)</h2>
          <p className="text-center text-muted-foreground mb-8">
            Month-to-month with 30-day cancellation. Monitoring, patching, help desk included.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {monthlyPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="mt-10 max-w-5xl mx-auto">
            <BusinessPlanCalculator />
          </div>
        </div>
      )}
    </div>
  );
}

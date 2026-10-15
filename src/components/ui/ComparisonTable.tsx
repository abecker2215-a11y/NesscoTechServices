"use client";

import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonFeature {
  name: string;
  description?: string;
  plans: (boolean | "partial" | "custom" | string | number)[];
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  plans: {
    name: string;
    price: string;
    period?: string;
    popular?: boolean;
    ctaText?: string;
    ctaHref?: string;
    color?: "primary" | "secondary" | "success" | "warning";
  }[];
  features: ComparisonFeature[];
  showCheckmarks?: boolean;
}

export function ComparisonTable({ 
  title, 
  subtitle, 
  plans, 
  features, 
  showCheckmarks = true 
}: ComparisonTableProps) {
  return (
    <section className="py-12 lg:py-20" aria-labelledby={title ? "comparison-title" : undefined}>
      <div className="container">
        {title && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="comparison-title" className="text-3xl font-bold text-foreground mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 z-10 px-4 py-3 text-left font-semibold text-foreground bg-background/80 backdrop-blur-sm">
                  {title || "Features"}
                </th>
                {plans.map((plan, i) => (
                  <th key={i} className="px-4 py-3 text-center">
                    <div className={cn(
                      "rounded-xl p-4 text-center",
                      plan.popular && "ring-2 ring-primary relative"
                    )}>
                      {plan.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                      <p className="text-lg font-semibold text-foreground">{plan.name}</p>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                        {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/50">
                  <td className="sticky left-0 z-10 px-4 py-3 font-medium text-foreground bg-background/80 backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                      <span>{feature.name}</span>
                      {feature.description && (
                        <HelpCircle className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" 
                          aria-label={feature.description}
                        />
                      )}
                    </div>
                  </td>
                  {feature.plans.map((value, planIndex) => (
                    <td key={planIndex} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        {value === true && showCheckmarks && (
                          <Check className={cn("h-5 w-5 text-success", "mx-auto")} aria-label="Included" />
                        )}
                        {value === false && showCheckmarks && (
                          <X className={cn("h-5 w-5 text-muted-foreground", "mx-auto")} aria-label="Not included" />
                        )}
                        {value === "partial" && (
                          <div className="flex items-center justify-center gap-1">
                            <Check className="h-4 w-4 text-success" />
                            <span className="text-xs text-muted-foreground">Partial</span>
                          </div>
                        )}
                        {value === "custom" && (
                          <span className="text-xs font-medium text-primary px-2 py-0.5 rounded bg-primary/10">
                            Custom
                          </span>
                        )}
                        {typeof value === "string" && (
                          <span className="text-sm text-foreground">{value}</span>
                        )}
                        {typeof value === "number" && (
                          <span className="text-sm font-medium text-foreground">{value.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                "rounded-2xl p-6 border transition-all duration-200",
                plan.popular 
                  ? "border-primary shadow-lg shadow-primary/10 bg-primary/5" 
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
              </div>
              {plan.ctaHref && plan.ctaText && (
                <a 
                  href={plan.ctaHref} 
                  className={cn(
                    "block w-full rounded-lg px-4 py-3 text-center font-medium transition-all",
                    plan.popular 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "border border-border bg-background hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {plan.ctaText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceComparisonTable() {
  const plans = [
    {
      name: "Remote Support",
      price: "75",
      period: "/hr",
      ctaText: "Request Remote Help",
      ctaHref: "/get-help?type=remote",
      color: "secondary" as const,
    },
    {
      name: "On-Site Support",
      price: "125",
      period: "/hr",
      ctaText: "Schedule Visit",
      ctaHref: "/get-help?type=onsite",
      color: "primary" as const,
    },
    {
      name: "Project Work",
      price: "Custom",
      period: "",
      popular: true,
      ctaText: "Get Quote",
      ctaHref: "/contact",
      color: "primary" as const,
    },
  ];

  const features: ComparisonFeature[] = [
    {
      name: "Software Troubleshooting",
      plans: [true, true, true],
    },
    {
      name: "Email & Browser Issues",
      plans: [true, true, true],
    },
    {
      name: "Hardware Repair",
      plans: [false, true, true],
    },
    {
      name: "Network Cabling & Wi-Fi",
      plans: [false, true, true],
    },
    {
      name: "Device Setup & Migration",
      plans: [false, true, true],
    },
    {
      name: "Server & Rack Work",
      plans: [false, false, true],
    },
    {
      name: "Travel Included",
      plans: [true, false, true],
    },
    {
      name: "Same-Day Availability",
      plans: [true, "partial", true],
    },
    {
      name: "Travel Fee",
      plans: ["$0", "$0", "Included"],
    },
  ];

  return (
    <ComparisonTable
      title="Remote vs. On-Site vs. Project"
      subtitle="Choose the right delivery method for your needs"
      plans={plans}
      features={features}
    />
  );
}
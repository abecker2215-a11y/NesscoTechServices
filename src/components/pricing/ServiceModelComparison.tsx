import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Model {
  name: string;
  tagline: string;
  price: string;
  period: string;
  bestFor: string;
  features: (boolean | string)[];
  ctaText: string;
  ctaHref: string;
  color: "primary" | "secondary";
}

const models: Model[] = [
  {
    name: "Break-Fix",
    tagline: "Pay as you go",
    price: "$75/$125",
    period: "/hr",
    bestFor: "Occasional issues, one-off projects. No commitment.",
    features: ["No fix, no fee on remote", true, true, false, false, false],
    ctaText: "Get Help Now",
    ctaHref: "/get-help",
    color: "secondary",
  },
  {
    name: "Fully Managed",
    tagline: "End-to-end IT",
    price: "$149–$599",
    period: "/mo",
    bestFor: "Businesses that want us to be their IT department.",
    features: [true, true, true, true, true, true],
    ctaText: "View Business Plans",
    ctaHref: "/pricing",
    color: "primary",
  },
  {
    name: "Co-Managed",
    tagline: "Extend your team",
    price: "Custom",
    period: "",
    bestFor: "You have in-house IT but need enterprise expertise and 24/7 coverage.",
    features: ["Tailored", true, true, true, true, "Custom"],
    ctaText: "Learn About Co-Managed IT",
    ctaHref: "/services/managed-it-services/co-managed",
    color: "primary",
  },
];

const featureLabels = [
  "Pricing",
  "No fix, no fee on remote",
  "Same-day response",
  "24/7 monitoring",
  "Proactive maintenance",
  "vCIO strategic planning",
];

export function ServiceModelComparison() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="models-heading">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="models-heading" className="text-3xl font-bold text-foreground mb-4">
            How You Can Work With Us
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the model that fits your team — from reactive help to a full partnership.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {models.map((model) => (
            <div
              key={model.name}
              className={cn(
                "flex flex-col rounded-xl border p-6 transition-all",
                model.color === "primary"
                  ? "border-primary ring-2 ring-primary bg-background shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{model.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{model.tagline}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{model.price}</span>
                  {model.period && <span className="text-muted-foreground">{model.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{model.bestFor}</p>
              </div>

              <div className="space-y-4 mb-6 flex-grow">
                {model.features.map((value, i) => {
                  const isActive = value === true;
                  const isCustom = typeof value === "string";
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{featureLabels[i]}</span>
                      <span className="font-medium text-foreground">
                        {isCustom ? value : isActive ? "Yes" : "No"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <a
                href={model.ctaHref}
                className={cn(
                  "mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  model.color === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-background text-foreground hover:border-primary/50"
                )}
              >
                {model.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

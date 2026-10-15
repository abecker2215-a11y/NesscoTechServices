"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const RATES = { remote: 75, onsite: 125 } as const;
type SupportType = keyof typeof RATES;

const issues = [
  { id: "computer", label: "Computer & software issues", onsiteOnly: false },
  { id: "wifi", label: "Wi-Fi & network problems", onsiteOnly: false },
  { id: "email", label: "Email problems", onsiteOnly: false },
  { id: "m365", label: "Microsoft 365 setup & issues", onsiteOnly: false },
  { id: "security", label: "Virus & security cleanup", onsiteOnly: false },
  { id: "printer", label: "Printer problems", onsiteOnly: false },
  { id: "hardware", label: "Hardware repair / on-site work", onsiteOnly: true },
  { id: "business", label: "Business IT support", onsiteOnly: false },
  { id: "other", label: "Something else", onsiteOnly: false },
];

const round5 = (n: number) => Math.round(n / 5) * 5;

export function PriceEstimator() {
  const [type, setType] = useState<SupportType>("remote");
  const [issue, setIssue] = useState("computer");
  const [hours, setHours] = useState(1);

  const rate = RATES[type];
  const estimate = rate * hours;
  const low = round5(estimate);
  const high = round5(estimate * 1.2);

  const handleIssue = (id: string) => {
    setIssue(id);
    const issueDef = issues.find((i) => i.id === id);
    if (issueDef?.onsiteOnly) setType("onsite");
  };

  return (
    <div className="rounded-xl border-2 border-border bg-background shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Instant Price Estimate</h3>
          <p className="text-sm text-muted-foreground">See a typical range before you commit — no email required.</p>
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <span className="block text-sm font-medium text-foreground mb-2">Support type</span>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/50 p-1" role="radiogroup" aria-label="Support type">
              {(Object.keys(RATES) as SupportType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={type === t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    type === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "remote" ? `Remote — $${RATES.remote}/hr` : `On-Site — $${RATES.onsite}/hr`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="estimate-issue" className="block text-sm font-medium text-foreground mb-2">
              What do you need help with?
            </label>
            <select
              id="estimate-issue"
              value={issue}
              onChange={(e) => handleIssue(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {issues.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}{i.onsiteOnly ? " (on-site)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="estimate-hours" className="text-sm font-medium text-foreground">
                Expected time
              </label>
              <span className="text-sm font-medium text-primary">{hours} {hours === 1 ? "hour" : "hours"}</span>
            </div>
            <input
              id="estimate-hours"
              type="range"
              min={0.5}
              max={4}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-valuetext={`${hours} hours`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>30 min</span>
              <span>4 hours</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-border bg-muted/40 p-6">
          <span className="text-sm font-medium text-muted-foreground">Estimated total</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">${low}</span>
            <span className="text-xl font-medium text-muted-foreground">– ${high}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {hours} {hours === 1 ? "hour" : "hours"} × ${rate}/hr {type === "remote" ? "remote" : "on-site"}
          </p>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground" role="list">
            <li className="flex gap-2"><span className="text-success">✓</span> Final price confirmed before work starts</li>
            <li className="flex gap-2"><span className="text-success">✓</span> You approve any changes — no surprise charges</li>
            <li className="flex gap-2"><span className="text-success">✓</span> Estimate only; longer jobs quoted upfront</li>
          </ul>

          <div className="mt-auto pt-6">
            <Button
              className="w-full"
              size="lg"
              href={`/get-help?category=${issue}&type=${type}&hours=${hours}`}
              onClick={() => trackEvent("estimator_cta", { issue, type, hours })}
            >
              Start a Request for This
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
              Hardware and cabling work usually requires an on-site visit — we&apos;ll confirm during triage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Scale, ArrowRight, Check, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const ONSITE_RATE = 125;
const MANAGED_MONTHLY = 349;

const rows = [
  { label: "Response promise", us: "~2 hrs, Mon–Fri 8am–6pm", them: "Queue + appointment windows" },
  { label: "Pricing before work", us: true, them: "Varies — diagnostic fees common" },
  { label: "No fix, no fee (remote)", us: true, them: false },
  { label: "Local on-site in Tampa Bay", us: true, them: "Ship it or wait for a slot" },
  { label: "Month-to-month, no contract", us: true, them: "Memberships with fine print" },
  { label: "You watch remote sessions", us: true, them: "Usually not" },
  { label: "Plain-English explanations", us: true, them: "Varies by agent" },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <Check className="h-4 w-4 text-success" aria-hidden="true" /> Yes
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <X className="h-4 w-4" aria-hidden="true" /> No
      </span>
    );
  return <span className="text-muted-foreground">{v}</span>;
}

export function CompareCalculator() {
  const [outages, setOutages] = useState(3);
  const [hours, setHours] = useState(2);

  const breakfixYear = outages * hours * ONSITE_RATE;
  const managedYear = MANAGED_MONTHLY * 12;
  const diff = breakfixYear - managedYear;

  return (
    <div className="grid gap-8 rounded-2xl border-2 border-border bg-background p-6 shadow-sm lg:grid-cols-2 lg:p-8">
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="cmp-outages" className="text-sm font-medium text-foreground">
              Surprise IT incidents per year
            </label>
            <span className="text-sm font-medium text-primary">{outages}</span>
          </div>
          <input
            id="cmp-outages"
            type="range"
            min={1}
            max={12}
            step={1}
            value={outages}
            onChange={(e) => setOutages(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="cmp-hours" className="text-sm font-medium text-foreground">
              On-site hours each
            </label>
            <span className="text-sm font-medium text-primary">{hours}h</span>
          </div>
          <input
            id="cmp-hours"
            type="range"
            min={1}
            max={8}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
          <p className="mt-1 text-xs text-muted-foreground">At our published ${ONSITE_RATE}/hr on-site rate.</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          Plus the unbillable part: every incident costs you the downtime itself — missed quotes,
          idle staff, deadline stress. Managed plans buy prevention, not just repairs.
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-muted/40 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Break-fix / year</p>
            <p className="text-3xl font-bold text-foreground">${breakfixYear.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{outages} incidents × {hours}h × ${ONSITE_RATE}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Managed / year</p>
            <p className="text-3xl font-bold text-foreground">${managedYear.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Managed ${MANAGED_MONTHLY}/mo + prevention</p>
          </div>
        </div>
        <p className={cn("mt-4 rounded-lg p-3 text-sm font-medium", diff > 0 ? "bg-success/10 text-foreground" : "bg-muted text-muted-foreground")}>
          {diff > 0
            ? `Managed saves ~$${diff.toLocaleString()}/yr at your incident rate — before counting avoided downtime.`
            : `At this incident rate break-fix is cheaper — but one bad year flips the math. Prevention is the insurance.`}
        </p>
        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            size="lg"
            href="/pricing"
            onClick={() => trackEvent("plan_calculator_cta", { plan: "compare", devices: 0 })}
          >
            See the plans
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CompareTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Scale className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Us vs. typical big-box tech support</h2>
          <p className="text-sm text-muted-foreground">Local team, flat quotes, no script-reading.</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-6 py-3 font-medium text-muted-foreground">What matters</th>
            <th className="px-6 py-3 font-semibold text-foreground">Nessco</th>
            <th className="px-6 py-3 font-medium text-muted-foreground">Big-box counter</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border last:border-0">
              <td className="px-6 py-3 font-medium text-foreground">{r.label}</td>
              <td className="px-6 py-3"><Cell v={r.us} /></td>
              <td className="px-6 py-3"><Cell v={r.them} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

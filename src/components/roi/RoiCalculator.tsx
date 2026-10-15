"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { Calculator, ArrowRight, TrendingDown, Mail, CheckCircle2, AlertTriangle, Clock, Users, BarChart3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { computeRoi, money0 } from "@/lib/roi";
import { cn } from "@/lib/utils";

export function RoiCalculator() {
  const [employees, setEmployees] = useState(12);
  const [hourlyCost, setHourlyCost] = useState(45);
  const [incidents, setIncidents] = useState(4);
  const [hoursEach, setHoursEach] = useState(3);

  const { downtimeYear, devices, rows, best } = useMemo(
    () => computeRoi({ employees, hourlyCost, incidentsPerYear: incidents, hoursEach }),
    [employees, hourlyCost, incidents, hoursEach]
  );

  const [caseName, setCaseName] = useState("");
  const [caseEmail, setCaseEmail] = useState("");
  const [caseStatus, setCaseStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [caseError, setCaseError] = useState<string | null>(null);

  const sendCase = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caseEmail.trim())) {
      setCaseError("Please enter a valid email.");
      return;
    }
    setCaseStatus("sending");
    setCaseError(null);
    try {
      const res = await fetch("/api/roi/business-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: caseEmail.trim(),
          name: caseName.trim() || undefined,
          employees,
          hourlyCost,
          incidentsPerYear: incidents,
          hoursEach,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Couldn't send it.");
      setCaseStatus("sent");
      trackEvent("roi_case_sent", { plan: best.plan.id, downtime: downtimeYear });
    } catch (err) {
      setCaseStatus("error");
      setCaseError(err instanceof Error ? err.message : "Couldn't send it. Try again.");
    }
  };

  const calculateBreakdown = () => {
    const totalHoursLost = employees * incidents * hoursEach;
    const avgCostPerIncident = (employees * hourlyCost * hoursEach);
    const weeklyImpact = downtimeYear / 52;
    const monthlyImpact = downtimeYear / 12;
    
    return {
      totalHoursLost,
      avgCostPerIncident,
      weeklyImpact,
      monthlyImpact,
    };
  };

  const breakdown = calculateBreakdown();

  return (
    <div className="rounded-2xl border-2 border-border bg-background shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">What do outages cost you?</h2>
          <p className="text-sm text-muted-foreground">Your staff, your numbers — no email required.</p>
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">
        <div className="space-y-6">
          {(
            [
              { id: "roi-employees", label: "Employees affected", value: employees, set: setEmployees, min: 1, max: 100, fmt: (v: number) => `${v}`, icon: Users },
              { id: "roi-cost", label: "Loaded cost per employee / hour", value: hourlyCost, set: setHourlyCost, min: 20, max: 150, step: 5, fmt: (v: number) => `$${v}`, icon: BarChart3 },
              { id: "roi-incidents", label: "Incidents per year", value: incidents, set: setIncidents, min: 1, max: 24, fmt: (v: number) => `${v}`, icon: AlertTriangle },
              { id: "roi-hours", label: "Hours lost each", value: hoursEach, set: setHoursEach, min: 1, max: 16, fmt: (v: number) => `${v}h`, icon: Clock },
            ] as const
          ).map((s) => (
            <div key={s.id}>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor={s.id} className="text-sm font-medium text-foreground flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {s.label}
                </label>
                <span className="text-sm font-medium text-primary">{s.fmt(s.value)}</span>
              </div>
              <input
                id={s.id}
                type="range"
                min={s.min}
                max={s.max}
                step={"step" in s ? s.step : 1}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Assumes ~{devices} devices (1.2 per employee) for plan sizing. Downtime math only — repair bills not included.
          </p>
        </div>

        <div className="flex flex-col rounded-xl border border-border bg-muted/40 p-6">
          <span className="text-sm font-medium text-muted-foreground">Downtime is costing you about</span>
          <div className="mt-1 flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-destructive" aria-hidden="true" />
            <span className="text-4xl font-bold text-foreground">{money0(downtimeYear)}</span>
            <span className="text-xl text-muted-foreground">/yr</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground">Weekly</p>
              <p className="text-sm font-semibold text-foreground">{money0(breakdown.weeklyImpact)}</p>
            </div>
            <div className="rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className="text-sm font-semibold text-foreground">{money0(breakdown.monthlyImpact)}</p>
            </div>
            <div className="rounded-lg bg-background p-3 text-center">
              <p className="text-xs text-muted-foreground">Hours Lost</p>
              <p className="text-sm font-semibold text-foreground">{breakdown.totalHoursLost}h</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {rows.map(({ plan, annual, avoided, net }) => {
              const isBest = plan.id === best.plan.id;
              const savingsPercent = avoided > 0 ? Math.round((avoided / downtimeYear) * 100) : 0;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all",
                    isBest ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{plan.name}</span>
                      {isBest && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Best Value
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {money0(annual)}/yr · avoids ~{money0(avoided)} ({savingsPercent}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn("font-bold text-base", net > 0 ? "text-success" : "text-muted-foreground")}>
                      {net > 0 ? `+${money0(net)}` : money0(net)}
                    </span>
                    <p className="text-xs text-muted-foreground">net savings</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <Button
              className="w-full"
              size="lg"
              href={`/get-help?category=business&plan=${best.plan.id}&devices=${devices}`}
              onClick={() => trackEvent("plan_calculator_cta", { plan: best.plan.id, devices, source: "roi" })}
            >
              Stop the bleeding — start with {best.plan.name}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Month-to-month · 30-day cancellation · Quote before anything starts
            </p>

            <div className="mt-5 rounded-lg border border-border bg-background p-4">
              {caseStatus === "sent" ? (
                <p className="flex items-center gap-2 text-sm font-medium text-success" role="status">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Business case sent to {caseEmail.trim()} — forward the PDF to whoever signs off.
                </p>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                    Email this business case to the boss
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">PDF with your numbers + plan math. No spam, ever.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
                    <label htmlFor="roi-case-name" className="sr-only">First name (optional)</label>
                    <input
                      id="roi-case-name"
                      value={caseName}
                      onChange={(e) => setCaseName(e.target.value)}
                      placeholder="First name"
                      autoComplete="given-name"
                      className="min-h-[44px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <label htmlFor="roi-case-email" className="sr-only">Work email</label>
                    <input
                      id="roi-case-email"
                      type="email"
                      value={caseEmail}
                      onChange={(e) => setCaseEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      inputMode="email"
                      className="min-h-[44px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={sendCase}
                      disabled={caseStatus === "sending"}
                      className="min-h-[44px] rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {caseStatus === "sending" ? "Sending…" : "Send PDF"}
                    </button>
                  </div>
                  {caseError && <p className="mt-2 text-xs text-destructive" role="alert">{caseError}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

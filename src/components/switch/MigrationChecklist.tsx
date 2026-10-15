"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Mail, CheckCircle2, Building2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { incumbents, migrationPhases, type Incumbent } from "@/lib/migration";
import { cn } from "@/lib/utils";

const STORE_KEY = "nessco-switch-plan";

/** Interactive migration checklist: pick incumbent → check steps → email the plan. */
export function MigrationChecklist() {
  const [incumbent, setIncumbent] = useState<Incumbent>("other");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Load a previously saved plan. This intentionally runs in an effect (not a lazy
  // initializer) so server-rendered markup stays deterministic: localStorage is only
  // available on the client, and applying it post-hydration avoids a mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { incumbent?: Incumbent; checked?: Record<string, boolean> };
        if (saved.incumbent) setIncumbent(saved.incumbent);
        if (saved.checked) setChecked(saved.checked);
      }
    } catch {
      // ignore
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ incumbent, checked }));
    } catch {
      // ignore
    }
  }, [incumbent, checked]);

  const phases = useMemo(() => migrationPhases(incumbent), [incumbent]);
  const total = phases.reduce((n, p) => n + p.steps.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const sendPlan = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/switch/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), incumbent, checkedSteps: Object.keys(checked).filter((k) => checked[k]) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Couldn't send it.");
      setStatus("sent");
      trackEvent("switch_plan_sent", { incumbent, done });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send it. Try again.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-foreground">Who handles your IT today?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Current IT provider">
          {incumbents.map((inc) => (
            <button
              key={inc.id}
              type="button"
              role="radio"
              aria-checked={incumbent === inc.id}
              onClick={() => {
                setIncumbent(inc.id);
                trackEvent("switch_incumbent", { incumbent: inc.id });
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition-all min-h-[64px]",
                incumbent === inc.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                {inc.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{inc.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-foreground">Migration readiness: {done}/{total}</span>
          <span className="font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-8">
        {phases.map((phase, pi) => (
          <div key={phase.id}>
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Phase {pi + 1}</p>
              <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
              <p className="text-sm text-muted-foreground">{phase.when}</p>
            </div>
            <ul className="space-y-2" role="list">
              {phase.steps.map((s) => {
                const on = !!checked[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => toggle(s.id)}
                      aria-pressed={on}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                        on ? "border-success/40 bg-success/5" : "border-border bg-background hover:border-primary/50"
                      )}
                    >
                      <span className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        on ? "border-success bg-success text-white" : "border-border text-transparent"
                      )}>
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-sm font-semibold", on ? "text-muted-foreground line-through" : "text-foreground")}>
                          {s.title}
                          <span className={cn(
                            "ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium",
                            s.owner === "us" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {s.owner === "us" ? "we handle" : "you handle"}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{s.body}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
        {status === "sent" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-success" role="status">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            Plan sent to {email.trim()} — your checked steps are saved on this device too.
          </p>
        ) : (
          <>
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              Email me this migration plan
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">Your setup, your checked steps, our fixed quote next.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <label htmlFor="switch-plan-email" className="sr-only">Work email</label>
              <input
                id="switch-plan-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                inputMode="email"
                className="min-h-[48px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={sendPlan}
                disabled={status === "sending"}
                className="min-h-[48px] rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send my plan"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

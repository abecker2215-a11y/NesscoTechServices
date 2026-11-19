"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { Building2, ArrowRight, BadgeCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { monthlyPlans, fitPlan } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";

const NONPROFIT_DISCOUNT = 0.1;
// Illustrative reactive baseline from our own published rates: 2 on-site hrs/mo.
const BREAKFIX_BASELINE = 2 * 125;

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 === 0 ? 0 : 2 });

export function BusinessPlanCalculator() {
  const [users, setUsers] = useState(5);
  const [totalDevices, setTotalDevices] = useState(10);
  const [nonprofit, setNonprofit] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Default plan selected by device allowance (smallest plan covering total devices).
  const defaultPlan = useMemo(() => fitPlan(totalDevices), [totalDevices]);
  const plan = useMemo(
    () => monthlyPlans.find((p) => p.id === selectedPlanId) ?? defaultPlan,
    [selectedPlanId, defaultPlan],
  );

  const discount = nonprofit ? NONPROFIT_DISCOUNT : 0;
  const monthly = Math.round(plan.price * users * (1 - discount));
  const annual = monthly * 12;
  const perUser = monthly / Math.max(users, 1);

  // Device allowance validation against the selected plan.
  const exceedsAllowance = plan.deviceLimit !== null && totalDevices > plan.deviceLimit;

  // Recommend the cheapest higher tier that covers the device count.
  const higherTier = useMemo(() => {
    if (!exceedsAllowance) return null;
    return (
      monthlyPlans
        .filter((p) => p.deviceLimit === null || totalDevices <= p.deviceLimit)
        .sort((a, b) => a.price - b.price)[0] ?? null
    );
  }, [exceedsAllowance, totalDevices]);

  const savesVsBreakfix = BREAKFIX_BASELINE - monthly;

  const href = `/get-help?category=business&plan=${plan.id}&users=${users}&devices=${totalDevices}`;

  const handlePlanSelect = (id: string) => {
    setSelectedPlanId(id);
  };

  return (
    <div className="rounded-xl border-2 border-border bg-background shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Which business plan fits?</h3>
          <p className="text-sm text-muted-foreground">
            Set users and devices — we&apos;ll price per user and validate device allowance.
          </p>
        </div>
      </div>

      <div className="grid gap-8 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-users" className="text-sm font-medium text-foreground">
                Users
              </label>
              <span className="text-sm font-medium text-primary">
                {users} {users === 1 ? "user" : "users"}
              </span>
            </div>
            <input
              id="calc-users"
              type="range"
              min={1}
              max={100}
              step={1}
              value={users}
              onChange={(e) => setUsers(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-valuetext={`${users} users`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-devices" className="text-sm font-medium text-foreground">
                Total devices
              </label>
              <span className="text-sm font-medium text-primary">
                {totalDevices} {totalDevices === 1 ? "device" : "devices"}
              </span>
            </div>
            <input
              id="calc-devices"
              type="range"
              min={1}
              max={500}
              step={1}
              value={totalDevices}
              onChange={(e) => setTotalDevices(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-valuetext={`${totalDevices} devices`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>500</span>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <input
              id="calc-nonprofit"
              name="nonprofit"
              type="checkbox"
              checked={nonprofit}
              onChange={(e) => setNonprofit(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--primary)]"
            />
            <span className="text-sm">
              <span className="font-medium text-foreground">Registered 501(c)(3) non-profit</span>
              <span className="block text-muted-foreground">10% off all monthly plans, applied below.</span>
            </span>
          </label>

          <div className="space-y-2" role="list" aria-label="Plan fit">
            {monthlyPlans.map((p) => {
              const fits = p.deviceLimit === null || totalDevices <= p.deviceLimit;
              const isPick = p.id === plan.id;
              return (
                <div
                  key={p.id}
                  role="listitem"
                  onClick={() => handlePlanSelect(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors",
                    isPick
                      ? "border-primary bg-primary/5 text-foreground"
                      : fits
                        ? "border-border text-muted-foreground"
                        : "border-border text-muted-foreground opacity-50",
                  )}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {isPick && <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />}
                    {p.name}
                    <span className="font-normal">
                      · {!fits ? `too small for ${totalDevices}` : p.fitLabel}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {money(Math.round(p.price * (1 - discount)))}/user/mo
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-border bg-muted/40 p-6">
          <span className="text-sm font-medium text-muted-foreground">
            Recommended for {totalDevices} {totalDevices === 1 ? "device" : "devices"}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">{money(monthly)}</span>
            <span className="text-xl font-medium text-muted-foreground">/mo</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {plan.name} · {money(perUser)}/user/mo · {money(annual)}/yr
            {nonprofit && " (non-profit rate)"}
          </p>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground" role="list">
            {plan.features.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-success" aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {exceedsAllowance && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-800 font-medium mb-1">
                Device allowance exceeded
              </p>
              <p className="text-xs text-amber-700 mb-2">
                {totalDevices} total devices exceed the {plan.name} allowance of {plan.deviceLimit} device{plan.deviceLimit === 1 ? "" : "s"}.
              </p>
              {higherTier && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePlanSelect(higherTier.id)}
                  className="w-auto"
                >
                  Switch to {higherTier.name} ({higherTier.deviceLimit === null ? "unlimited" : higherTier.deviceLimit} device{higherTier.deviceLimit === 1 ? "" : "s"})
                </Button>
              )}
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {savesVsBreakfix > 0 ? (
              <span>
                About {money(savesVsBreakfix)}/mo less than {money(BREAKFIX_BASELINE)}/mo for two
                reactive on-site hours — with monitoring and prevention included.
              </span>
            ) : (
              <span>
                For reference, two reactive on-site hours run {money(BREAKFIX_BASELINE)}/mo —
                with none of the monitoring, patching, or prevention.
              </span>
            )}
          </p>

          <div className="mt-auto pt-6">
            <Button
              className="w-full"
              size="lg"
              href={href}
              onClick={() => trackEvent("plan_calculator_cta", { plan: plan.id, users, devices: totalDevices, nonprofit })}
            >
              Get {plan.name} for {users} {users === 1 ? "user" : "users"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Month-to-month · 30-day cancellation · Final quote before anything starts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

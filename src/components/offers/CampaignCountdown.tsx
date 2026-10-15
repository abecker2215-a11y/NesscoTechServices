"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function parts(target: Date): { d: number; h: number; m: number; s: number } {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

/** Live countdown to a campaign's end-of-season. */
export function CampaignCountdown({ daysLeft, label }: { daysLeft: number; label?: string }) {
  const [target] = useState(() => new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000));
  const [t, setT] = useState(() => parts(target));

  useEffect(() => {
    const id = setInterval(() => setT(parts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: [string, number][] = [
    ["days", t.d],
    ["hrs", t.h],
    ["min", t.m],
    ["sec", t.s],
  ];

  return (
    <div className="inline-flex flex-col items-center gap-1" role="timer" aria-label={label ?? "Offer ends in"}>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        <Timer className="h-3.5 w-3.5" aria-hidden="true" />
        {label ?? "Season ends in"}
      </span>
      <span className="flex gap-1.5">
        {cells.map(([unit, v]) => (
          <span key={unit} className="min-w-[3rem] rounded-lg border border-border bg-background px-2 py-1 text-center">
            <span className="block text-lg font-bold tabular-nums text-foreground">{String(v).padStart(2, "0")}</span>
            <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{unit}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

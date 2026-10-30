"use client";

import { useMemo } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface TimeSlotPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

interface Slot {
  value: string;
  dayLabel: string;
  windowLabel: string;
}

function nextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1); // start tomorrow
  while (days.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const ASAP_VALUE = "ASAP — urgent, contact me as soon as possible";

const WINDOWS = [
  { id: "morning", label: "Morning", hint: "9am–12pm ET" },
  { id: "afternoon", label: "Afternoon", hint: "1–5pm ET" },
];

export function TimeSlotPicker({ value, onChange }: TimeSlotPickerProps) {
  const slots: Slot[] = useMemo(() => {
    const days = nextBusinessDays(3);
    const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
    return days.flatMap((day) =>
      WINDOWS.map((w) => ({
        value: `${fmt.format(day)} · ${w.label} (${w.hint})`,
        dayLabel: fmt.format(day),
        windowLabel: `${w.label} (${w.hint})`,
      }))
    );
  }, []);

  const pick = (v: string) => {
    const next = value === v ? "" : v;
    onChange(next);
    if (next) trackEvent("slot_picked", { slot: v });
  };

  return (
    <div>
      <button
        type="button"
        role="radio"
        aria-checked={value === ASAP_VALUE}
        onClick={() => pick(ASAP_VALUE)}
        className={cn(
          "mb-2 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
          value === ASAP_VALUE
            ? "border-destructive bg-destructive/10 text-foreground"
            : "border-border bg-background text-muted-foreground hover:border-destructive/50 hover:text-foreground"
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <Zap className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold">It&apos;s urgent — ASAP</span>
          <span className="block text-xs">Business down, security incident, deadline today</span>
        </span>
      </button>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Preferred time slot">
        {slots.map((slot) => {
          const selected = value === slot.value;
          return (
            <button
              key={slot.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => pick(slot.value)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <span className="block text-xs font-semibold">{slot.dayLabel}</span>
              <span className="block text-xs">{slot.windowLabel}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Pick a window that suits you, or describe another time below. We confirm the exact time
        when we reply (within 2 business hours). Real-time booking coming
        soon — for now this reserves your preference, not a locked slot.
      </p>
    </div>
  );
}

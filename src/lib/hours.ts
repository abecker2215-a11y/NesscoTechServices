/**
 * Business-hours logic for Tampa Bay (America/New_York).
 * Single source of truth — Header pill, hero badge, and anywhere else
 * that promises a response time should derive from here.
 */
export const BUSINESS_TZ = "America/New_York";
export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 18;
/** 0 = Sunday … 6 = Saturday */
export const OPEN_DAYS = [1, 2, 3, 4, 5];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TzParts {
  day: number;
  hour: number;
}

function partsInTz(date: Date): TzParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TZ,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday"); // "Mon", "Tue", …
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const hour = Number.parseInt(get("hour"), 10) % 24;
  return { day, hour };
}

export function isBusinessOpen(at = new Date()): boolean {
  const { day, hour } = partsInTz(at);
  return OPEN_DAYS.includes(day) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

/**
 * Human label for when we next respond, e.g. "today at 8am",
 * "tomorrow at 8am", "Monday at 8am". Assumes currently closed.
 */
export function nextOpeningLabel(at = new Date()): string {
  const { day, hour } = partsInTz(at);
  if (OPEN_DAYS.includes(day) && hour < OPEN_HOUR) return "today at 8am";
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    if (OPEN_DAYS.includes(nextDay)) {
      if (offset === 1) return "tomorrow at 8am";
      return `${DAY_NAMES[nextDay]} at 8am`;
    }
  }
  return "Monday at 8am";
}

export type BusinessStatus =
  | { open: true; label: string }
  | { open: false; label: string };

export function getBusinessStatus(at = new Date()): BusinessStatus {
  if (isBusinessOpen(at)) {
    return { open: true, label: "Replies within 2 hrs" };
  }
  return { open: false, label: `Closed now · back ${nextOpeningLabel(at)}` };
}

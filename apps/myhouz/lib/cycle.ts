import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  getDay,
  isSameDay,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns";
import type { RecurrenceMeta } from "@home/types";

type RecurrenceArg = string; // RecurrenceType from DB

/**
 * Returns the start of the current cycle for a given recurrence type.
 * For custom recurrence, always returns startOfDay (daily granularity).
 */
export function getCycleStart(
  recurrence: RecurrenceArg,
  _meta?: RecurrenceMeta,
): Date {
  const now = new Date();
  switch (recurrence) {
    case "daily":
    case "weekdays":
    case "weekends":
    case "custom":
      return startOfDay(now);
    case "weekly":
      return startOfWeek(now, { weekStartsOn: 1 });
    case "monthly":
      return startOfMonth(now);
    default:
      return startOfDay(now);
  }
}

/**
 * Checks if an item is completed for the current cycle.
 */
export function isCompletedThisCycle(
  lastCompletedAt: string | null,
  recurrence: RecurrenceArg,
  meta?: RecurrenceMeta,
): boolean {
  if (!lastCompletedAt) return false;
  const cycleStart = getCycleStart(recurrence, meta);
  return new Date(lastCompletedAt) >= cycleStart;
}

/**
 * Checks if a given date is an active day for the given recurrence.
 * Generalized version of isActiveToday that accepts any Date.
 */
export function isActiveOnDate(
  recurrence: RecurrenceArg,
  meta: RecurrenceMeta | undefined,
  date: Date,
  startsAt?: Date | null,
): boolean {
  // Guard: if task has a start date and the queried date is before it, inactive
  if (startsAt && date < startOfDay(startsAt)) return false;

  const dayOfWeek = getDay(date); // 0=Sun, 1=Mon, ..., 6=Sat

  switch (recurrence) {
    case "daily":
    case "monthly":
    case "weekly":
      return true;

    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5;

    case "weekends":
      return dayOfWeek === 0 || dayOfWeek === 6;

    case "custom": {
      if (!meta) return true;

      if (meta.type === "days_of_week") {
        return meta.days.includes(dayOfWeek);
      }

      // interval — always show as "active" (user decided the frequency)
      return true;
    }

    default:
      return true;
  }
}

/**
 * Checks if today is an active day for the given recurrence.
 * Delegates to isActiveOnDate with today's date.
 */
export function isActiveToday(
  recurrence: RecurrenceArg,
  meta?: RecurrenceMeta,
  startsAt?: Date | null,
): boolean {
  return isActiveOnDate(recurrence, meta, new Date(), startsAt);
}

/**
 * Checks if any completion record falls on a given date.
 */
export function hasCompletionOnDate(
  completions: { completed_at: string }[],
  date: Date,
): boolean {
  return completions.some((c) => isSameDay(new Date(c.completed_at), date));
}

/**
 * Returns a human-readable summary of custom recurrence meta.
 * Used by RecurrenceBadge. Returns null if no meta or not custom.
 */
export function getRecurrenceDescription(
  recurrence: RecurrenceArg,
  meta: RecurrenceMeta,
  dayLabels: string[], // 7 short labels: ["Sun", "Mon", ..., "Sat"]
  unitLabels: Record<string, string>, // { days: "days", weeks: "weeks", months: "months" }
): string | null {
  if (recurrence !== "custom" || !meta) return null;

  if (meta.type === "days_of_week") {
    // Sort days starting from Monday (1,2,3,4,5,6,0)
    const sorted = [...meta.days].sort((a, b) => {
      const orderA = a === 0 ? 7 : a;
      const orderB = b === 0 ? 7 : b;
      return orderA - orderB;
    });
    return sorted.map((d) => dayLabels[d]).join(", ");
  }

  if (meta.type === "interval") {
    const unitLabel = unitLabels[meta.unit] ?? meta.unit;
    if (meta.every === 1) {
      return unitLabel;
    }
    return `${meta.every} ${unitLabel}`;
  }

  return null;
}

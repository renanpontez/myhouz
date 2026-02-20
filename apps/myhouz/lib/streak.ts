import {
  startOfDay,
  subDays,
  subWeeks,
  subMonths,
  isBefore,
} from "date-fns";
import { getCycleStart } from "./cycle";
import type { RecurrenceMeta } from "@home/types";

type RecurrenceArg = string;

interface CompletionRecord {
  completed_at: string;
}

/**
 * Calculates the current streak (consecutive cycles with at least one completion).
 * Walks backwards through cycles counting consecutive completions.
 *
 * Returns 0 if no completions or the most recent cycle was missed.
 */
export function calculateStreak(
  recurrence: RecurrenceArg,
  meta: RecurrenceMeta,
  completions: CompletionRecord[],
): number {
  if (completions.length === 0) return 0;

  // Sort completions by date descending
  const sorted = [...completions].sort(
    (a, b) =>
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
  );

  const now = new Date();
  const currentCycleStart = getCycleStart(recurrence, meta);

  // Check if the current cycle has a completion
  const hasCurrentCycle = sorted.some(
    (c) => new Date(c.completed_at) >= currentCycleStart,
  );

  // Start counting from: current cycle if it has a completion, otherwise previous cycle
  let streak = hasCurrentCycle ? 1 : 0;
  let cycleStart = hasCurrentCycle
    ? getPreviousCycleStart(recurrence, meta, currentCycleStart)
    : currentCycleStart;

  // If the current cycle has no completion, check if the previous cycle did
  // (we allow a "grace" — current cycle may still be in progress)
  if (!hasCurrentCycle) {
    const prevCycleStart = getPreviousCycleStart(recurrence, meta, currentCycleStart);
    const hasPrevCycle = sorted.some((c) => {
      const d = new Date(c.completed_at);
      return d >= prevCycleStart && d < currentCycleStart;
    });
    if (!hasPrevCycle) return 0;
    streak = 1;
    cycleStart = getPreviousCycleStart(recurrence, meta, prevCycleStart);
  }

  // Walk backwards counting consecutive cycles
  const maxIterations = 1000; // safety limit
  for (let i = 0; i < maxIterations; i++) {
    const cycleEnd = getNextCycleStart(recurrence, meta, cycleStart);

    const hasCompletion = sorted.some((c) => {
      const d = new Date(c.completed_at);
      return d >= cycleStart && d < cycleEnd;
    });

    if (!hasCompletion) break;

    streak++;
    cycleStart = getPreviousCycleStart(recurrence, meta, cycleStart);

    // Stop if we've gone past the oldest completion
    const oldest = sorted[sorted.length - 1];
    if (oldest && isBefore(cycleStart, startOfDay(new Date(oldest.completed_at)))) break;
  }

  return streak;
}

function getPreviousCycleStart(
  recurrence: RecurrenceArg,
  meta: RecurrenceMeta,
  fromDate: Date,
): Date {
  switch (recurrence) {
    case "daily":
    case "weekdays":
    case "weekends":
    case "custom":
      return subDays(fromDate, 1);
    case "weekly":
      return subWeeks(fromDate, 1);
    case "monthly":
      return subMonths(fromDate, 1);
    default:
      return subDays(fromDate, 1);
  }
}

function getNextCycleStart(
  recurrence: RecurrenceArg,
  meta: RecurrenceMeta,
  fromDate: Date,
): Date {
  switch (recurrence) {
    case "daily":
    case "weekdays":
    case "weekends":
    case "custom":
      return startOfDay(new Date(fromDate.getTime() + 86400000));
    case "weekly":
      return new Date(fromDate.getTime() + 7 * 86400000);
    case "monthly":
      return subMonths(fromDate, -1);
    default:
      return startOfDay(new Date(fromDate.getTime() + 86400000));
  }
}

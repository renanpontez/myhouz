import type { Tables, Enums } from "./database";

export type RecurrenceType = Enums<"recurrence_type">;

export type RoutineTask = Tables<"routine_task">;

export type RoutineTaskCompletion = Tables<"routine_task_completion">;

/**
 * Discriminated union stored in routine_task.recurrence_meta (JSONB).
 * null for daily/monthly (no extra config needed).
 */
export type RecurrenceMeta =
  | { type: "days_of_week"; days: number[] } // 0=Sun, 1=Mon, ..., 6=Sat
  | { type: "interval"; every: number; unit: "days" | "weeks" | "months" }
  | null;

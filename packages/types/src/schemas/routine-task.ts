import { z } from "zod";

// Full enum (matches Postgres — includes legacy values that stay in DB)
export const recurrenceTypeSchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "weekdays",
  "weekends",
  "custom",
]);

// UI-facing options (only these are shown in forms)
export const UI_RECURRENCE_OPTIONS = ["daily", "monthly", "custom"] as const;

// recurrence_meta discriminated union
export const recurrenceMetaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("days_of_week"),
    days: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Select at least one day"),
  }),
  z.object({
    type: z.literal("interval"),
    every: z.number().int().min(1).max(365),
    unit: z.enum(["days", "weeks", "months"]),
  }),
]);

export const createTaskSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(200, t("titleMax")),
    recurrence: recurrenceTypeSchema.default("daily"),
    recurrence_meta: recurrenceMetaSchema.nullable().optional(),
    assigned_to: z.string().uuid().optional(),
    icon: z.string().max(50).nullable().optional(),
    starts_at: z.string().date().nullable().optional(),
  });

export const createUpdateTaskSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1).max(200, t("titleMax")).optional(),
    recurrence: recurrenceTypeSchema.optional(),
    recurrence_meta: recurrenceMetaSchema.nullable().optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    is_active: z.boolean().optional(),
    icon: z.string().max(50).nullable().optional(),
    starts_at: z.string().date().nullable().optional(),
  });

export type CreateTaskInput = z.infer<ReturnType<typeof createTaskSchema>>;
export type UpdateTaskInput = z.infer<ReturnType<typeof createUpdateTaskSchema>>;

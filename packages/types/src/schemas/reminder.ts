import { z } from "zod";

export const createReminderSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(200, t("titleMax")),
    due_at: z.string().datetime({ message: t("dateRequired") }),
    assigned_to: z.string().uuid().optional(),
  });

export const createUpdateReminderSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1).max(200, t("titleMax")).optional(),
    due_at: z.string().datetime().optional(),
    assigned_to: z.string().uuid().nullable().optional(),
  });

export type CreateReminderInput = z.infer<ReturnType<typeof createReminderSchema>>;
export type UpdateReminderInput = z.infer<ReturnType<typeof createUpdateReminderSchema>>;

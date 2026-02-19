import { z } from "zod";

export const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  due_at: z.string().datetime({ message: "Valid date/time is required" }),
  assigned_to: z.string().uuid().optional(),
});

export const updateReminderSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  due_at: z.string().datetime().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;

import { z } from "zod";

export const recurrenceTypeSchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "custom",
]);

export const createChecklistSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  recurrence: recurrenceTypeSchema.default("weekly"),
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(200),
      }),
    )
    .min(1, "At least one item is required"),
});

export const updateChecklistSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  recurrence: recurrenceTypeSchema.optional(),
  is_active: z.boolean().optional(),
});

export const addChecklistItemSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
});

export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;
export type UpdateChecklistInput = z.infer<typeof updateChecklistSchema>;
export type AddChecklistItemInput = z.infer<typeof addChecklistItemSchema>;

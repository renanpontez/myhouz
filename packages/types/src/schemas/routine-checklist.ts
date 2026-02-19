import { z } from "zod";

export const recurrenceTypeSchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "custom",
]);

export const createChecklistSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(200, t("titleMax")),
    recurrence: recurrenceTypeSchema.default("weekly"),
    items: z
      .array(
        z.object({
          label: z.string().min(1).max(200, t("labelMax")),
        }),
      )
      .min(1, t("atLeastOneItem")),
  });

export const createUpdateChecklistSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1).max(200, t("titleMax")).optional(),
    recurrence: recurrenceTypeSchema.optional(),
    is_active: z.boolean().optional(),
  });

export const createAddChecklistItemSchema = (t: (key: string) => string) =>
  z.object({
    label: z.string().min(1, t("labelRequired")).max(200, t("labelMax")),
  });

export type CreateChecklistInput = z.infer<ReturnType<typeof createChecklistSchema>>;
export type UpdateChecklistInput = z.infer<ReturnType<typeof createUpdateChecklistSchema>>;
export type AddChecklistItemInput = z.infer<ReturnType<typeof createAddChecklistItemSchema>>;

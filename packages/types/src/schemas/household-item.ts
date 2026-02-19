import { z } from "zod";

export const itemTypeSchema = z.enum(["buy", "repair", "fix"]);
export const itemPrioritySchema = z.enum(["low", "medium", "high"]);
export const itemStatusSchema = z.enum(["pending", "in_progress", "done"]);

export const createItemSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("itemNameRequired")).max(200, t("itemNameMax")),
    type: itemTypeSchema.default("buy"),
    priority: itemPrioritySchema.default("medium"),
    assigned_to: z.string().uuid().optional(),
    notes: z.string().max(1000, t("notesMax")).optional(),
  });

export const createUpdateItemSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1).max(200, t("itemNameMax")).optional(),
    type: itemTypeSchema.optional(),
    priority: itemPrioritySchema.optional(),
    status: itemStatusSchema.optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    notes: z.string().max(1000, t("notesMax")).nullable().optional(),
  });

export type CreateItemInput = z.infer<ReturnType<typeof createItemSchema>>;
export type UpdateItemInput = z.infer<ReturnType<typeof createUpdateItemSchema>>;

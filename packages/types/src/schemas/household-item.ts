import { z } from "zod";

export const itemTypeSchema = z.enum(["buy", "repair", "fix"]);
export const itemPrioritySchema = z.enum(["low", "medium", "high"]);
export const itemStatusSchema = z.enum(["pending", "in_progress", "done"]);

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: itemTypeSchema.default("buy"),
  priority: itemPrioritySchema.default("medium"),
  assigned_to: z.string().uuid().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: itemTypeSchema.optional(),
  priority: itemPrioritySchema.optional(),
  status: itemStatusSchema.optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

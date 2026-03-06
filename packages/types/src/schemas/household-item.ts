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
    price: z.number().min(0, t("priceMin")).max(99999999, t("priceMax")).optional(),
    photos: z.array(z.string().url()).max(5, t("photosMax")).optional(),
    link: z.string().url(t("linkInvalid")).max(2083, t("linkMax")).optional().or(z.literal("")),
    tags: z
      .array(z.string().max(50, t("tagMax")))
      .max(10, t("tagsMax"))
      .optional(),
    icon: z.string().max(50).nullable().optional(),
  });

export const createUpdateItemSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1).max(200, t("itemNameMax")).optional(),
    type: itemTypeSchema.optional(),
    priority: itemPrioritySchema.optional(),
    status: itemStatusSchema.optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    notes: z.string().max(1000, t("notesMax")).nullable().optional(),
    price: z.number().min(0, t("priceMin")).max(99999999, t("priceMax")).nullable().optional(),
    photos: z.array(z.string().url()).max(5, t("photosMax")).nullable().optional(),
    link: z.string().url(t("linkInvalid")).max(2083, t("linkMax")).nullable().optional().or(z.literal("")),
    tags: z
      .array(z.string().max(50, t("tagMax")))
      .max(10, t("tagsMax"))
      .nullable()
      .optional(),
    icon: z.string().max(50).nullable().optional(),
  });

export type CreateItemInput = z.infer<ReturnType<typeof createItemSchema>>;
export type UpdateItemInput = z.infer<ReturnType<typeof createUpdateItemSchema>>;

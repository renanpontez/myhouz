import { z } from "zod";

export const createHouseholdSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
});

export const updateHouseholdSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
export type UpdateHouseholdInput = z.infer<typeof updateHouseholdSchema>;

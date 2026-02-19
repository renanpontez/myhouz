import { z } from "zod";

export const createHouseholdSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("householdNameRequired")).max(200, t("householdNameMax")),
  });

export const createUpdateHouseholdSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("householdNameRequired")).max(200, t("householdNameMax")),
  });

export type CreateHouseholdInput = z.infer<ReturnType<typeof createHouseholdSchema>>;
export type UpdateHouseholdInput = z.infer<ReturnType<typeof createUpdateHouseholdSchema>>;

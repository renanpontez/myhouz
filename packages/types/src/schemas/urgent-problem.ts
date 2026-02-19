import { z } from "zod";

export const createUrgentProblemSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("titleRequired")).max(200, t("titleMax")),
    description: z.string().min(1, t("descriptionRequired")).max(2000, t("descriptionMax")),
  });

export const createUpdateUrgentProblemSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1).max(200, t("titleMax")).optional(),
    description: z.string().min(1).max(2000, t("descriptionMax")).optional(),
  });

export type CreateUrgentProblemInput = z.infer<
  ReturnType<typeof createUrgentProblemSchema>
>;
export type UpdateUrgentProblemInput = z.infer<
  ReturnType<typeof createUpdateUrgentProblemSchema>
>;

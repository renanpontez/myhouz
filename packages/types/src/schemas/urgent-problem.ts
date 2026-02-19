import { z } from "zod";

export const createUrgentProblemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
});

export const updateUrgentProblemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
});

export type CreateUrgentProblemInput = z.infer<
  typeof createUrgentProblemSchema
>;
export type UpdateUrgentProblemInput = z.infer<
  typeof updateUrgentProblemSchema
>;

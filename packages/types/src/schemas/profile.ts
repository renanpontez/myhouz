import { z } from "zod";

export const createUpdateProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("nameRequired")).max(100, t("nameMax")),
    avatar_url: z.string().url().nullable().optional(),
  });

export type UpdateProfileInput = z.infer<ReturnType<typeof createUpdateProfileSchema>>;

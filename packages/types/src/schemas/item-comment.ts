import { z } from "zod";

export const createItemCommentSchema = (t: (key: string) => string) =>
  z.object({
    content: z
      .string()
      .min(1, t("commentRequired"))
      .max(2000, t("commentMax")),
  });

export type CreateItemCommentInput = z.infer<
  ReturnType<typeof createItemCommentSchema>
>;

import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });

export const createSignupSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("nameRequired")).max(100, t("nameMax")),
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(6, t("passwordMin")),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupInput = z.infer<ReturnType<typeof createSignupSchema>>;

import { z } from "zod";

export const memberRoleSchema = z.enum(["owner", "member", "guest"]);

export const createGenerateInviteSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .email(t("emailInvalid"))
      .optional()
      .or(z.literal("")),
    role: z.enum(["member", "guest"]).default("member"),
  });

/** @deprecated Use createGenerateInviteSchema(t) instead */
export const generateInviteSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(["member", "guest"]).default("member"),
});

export type GenerateInviteInput = z.infer<typeof generateInviteSchema>;

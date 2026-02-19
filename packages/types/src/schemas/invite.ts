import { z } from "zod";

export const memberRoleSchema = z.enum(["owner", "member", "guest"]);

export const generateInviteSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(["member", "guest"]).default("member"),
});

export type GenerateInviteInput = z.infer<typeof generateInviteSchema>;

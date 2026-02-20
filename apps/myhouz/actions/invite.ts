"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUser, getUserWithRole } from "@home/auth";
import { createGenerateInviteSchema } from "@home/types";
import { getTranslations } from "next-intl/server";
import { nanoid } from "nanoid";

export async function generateInvite(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string; code?: string; inviteUrl?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") {
    return { error: tError("generateInviteError") };
  }

  const schema = createGenerateInviteSchema(t);
  const rawEmail = formData.get("email") as string;
  const parsed = schema.safeParse({
    email: rawEmail || undefined,
    role: formData.get("role") || "member",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.email?.[0] ?? tError("generateInviteError") };
  }

  const code = nanoid(12);
  const supabase = createServerClient();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { profile } = await getUserWithRole(householdId);

  const { error: insertError } = await supabase
    .from("household_invite")
    .insert({
      household_id: householdId,
      invited_by: profile.id,
      code,
      email: parsed.data.email || null,
      role: parsed.data.role,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    });

  if (insertError) {
    return { error: tError("generateInviteError") };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const inviteUrl = `${appUrl}/invite/${code}`;

  // Send email if provided
  if (parsed.data.email) {
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "myhouz <noreply@myhouz.app>",
            to: [parsed.data.email],
            subject: `You've been invited to join a household on myhouz`,
            html: `<p>${profile.name ?? "Someone"} invited you to join their household on myhouz.</p><p><a href="${inviteUrl}">Accept invite</a></p><p>This invite expires in 7 days.</p>`,
          }),
        });
      }
    } catch {
      // Email sending is best-effort — don't fail the invite
      console.error("Failed to send invite email");
    }
  }

  revalidatePath("/app/members");
  return { code, inviteUrl };
}

export async function revokeInvite(
  householdId: string,
  inviteId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") {
    return { error: tError("revokeInviteError") };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("household_invite")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("revokeInviteError") };
  }

  revalidatePath("/app/members");
  return {};
}

export async function acceptInvite(code: string): Promise<{ error?: string }> {
  const tError = await getTranslations("error");
  const user = await getUser();
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("accept_invite", {
    p_invite_code: code,
  });

  if (error) {
    return { error: tError("acceptInviteError") };
  }

  const result = data as { household_id?: string } | null;
  const householdId = result?.household_id;

  if (!householdId) {
    return { error: tError("invalidOrExpiredInvite") };
  }

  const cookieStore = await cookies();
  cookieStore.set("activeHouseholdId", householdId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/");
  redirect("/app/dashboard");
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUser } from "@home/auth";

export async function generateInvite(
  _householdId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function revokeInvite(
  _householdId: string,
  _inviteId: string,
) {
  throw new Error("Not implemented");
}

export async function acceptInvite(code: string): Promise<{ error?: string }> {
  const user = await getUser();
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("accept_invite", {
    p_invite_code: code,
  });

  if (error) {
    return { error: "Erro ao aceitar o convite. Verifique se o codigo e valido." };
  }

  const result = data as { household_id?: string } | null;
  const householdId = result?.household_id;

  if (!householdId) {
    return { error: "Convite invalido ou expirado." };
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

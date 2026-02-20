"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUser, getUserWithRole } from "@home/auth";
import { getTranslations } from "next-intl/server";

export async function changeRole(
  householdId: string,
  memberId: string,
  role: "member" | "guest",
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { role: currentRole, profile } = await getUserWithRole(householdId);
  if (currentRole !== "owner") {
    return { error: tError("changeRoleError") };
  }

  // Cannot change own role
  const supabase = createServerClient();
  const { data: targetMember } = await supabase
    .from("household_member")
    .select("user_id")
    .eq("id", memberId)
    .eq("household_id", householdId)
    .single();

  if (!targetMember) {
    return { error: tError("changeRoleError") };
  }

  if (targetMember.user_id === profile.id) {
    return { error: tError("changeRoleError") };
  }

  const { error } = await supabase
    .from("household_member")
    .update({ role })
    .eq("id", memberId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("changeRoleError") };
  }

  revalidatePath("/app/members");
  return {};
}

export async function removeMember(
  householdId: string,
  memberId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { role, profile } = await getUserWithRole(householdId);
  if (role !== "owner") {
    return { error: tError("removeMemberError") };
  }

  // Cannot remove self (use leaveHousehold instead)
  const supabase = createServerClient();
  const { data: targetMember } = await supabase
    .from("household_member")
    .select("user_id")
    .eq("id", memberId)
    .eq("household_id", householdId)
    .single();

  if (!targetMember) {
    return { error: tError("removeMemberError") };
  }

  if (targetMember.user_id === profile.id) {
    return { error: tError("removeMemberError") };
  }

  const { error } = await supabase
    .from("household_member")
    .delete()
    .eq("id", memberId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("removeMemberError") };
  }

  revalidatePath("/app/members");
  return {};
}

export async function leaveHousehold(
  householdId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { role, profile } = await getUserWithRole(householdId);

  if (role === "owner") {
    return { error: tError("ownerCannotLeave") };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("household_member")
    .delete()
    .eq("household_id", householdId)
    .eq("user_id", profile.id);

  if (error) {
    return { error: tError("leaveHouseholdError") };
  }

  const cookieStore = await cookies();
  cookieStore.delete("activeHouseholdId");

  revalidatePath("/");
  redirect("/app/onboarding");
}

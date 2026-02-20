"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUser, getUserWithRole } from "@home/auth";
import { createUpdateHouseholdSchema, createHouseholdSchema } from "@home/types";
import { getTranslations } from "next-intl/server";

export async function createHousehold(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const schema = createHouseholdSchema(t);
  const parsed = schema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.name?.[0] ?? t("householdNameRequired") };
  }

  const supabase = createServerClient();

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser || !session) {
    redirect("/login");
  }

  // Insert without .select() — the SELECT RLS policy requires membership,
  // which only exists after the trigger fires
  const { error: insertError } = await supabase
    .from("household")
    .insert({ name: parsed.data.name, owner_id: authUser.id });

  if (insertError) {
    return { error: tError("createHouseholdError") };
  }

  // Now the trigger has added us as a member — query the household
  const { data: household, error: selectError } = await supabase
    .from("household")
    .select("id")
    .eq("owner_id", authUser.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (selectError || !household) {
    return { error: tError("createHouseholdError") };
  }

  const cookieStore = await cookies();
  cookieStore.set("activeHouseholdId", household.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/");
  redirect("/app/dashboard");
}

export async function switchHousehold(
  householdId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");
  const user = await getUser();
  const supabase = createServerClient();

  // Verify user is a member of target household
  const { data: membership } = await supabase
    .from("household_member")
    .select("id")
    .eq("household_id", householdId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return { error: tError("somethingWentWrong") };
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

export async function updateHousehold(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") {
    return { error: tError("updateHouseholdError") };
  }

  const schema = createUpdateHouseholdSchema(t);
  const parsed = schema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.name?.[0] ?? tError("updateHouseholdError") };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("household")
    .update({ name: parsed.data.name })
    .eq("id", householdId);

  if (error) {
    return { error: tError("updateHouseholdError") };
  }

  revalidatePath("/app/settings/household");
  revalidatePath("/");
  return {};
}

export async function deleteHousehold(
  householdId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") {
    return { error: tError("deleteHouseholdError") };
  }

  const supabase = createServerClient();

  // Check only member
  const { count } = await supabase
    .from("household_member")
    .select("id", { count: "exact", head: true })
    .eq("household_id", householdId);

  if (count && count > 1) {
    return { error: tError("mustBeSoleMember") };
  }

  const { error } = await supabase
    .from("household")
    .delete()
    .eq("id", householdId);

  if (error) {
    return { error: tError("deleteHouseholdError") };
  }

  const cookieStore = await cookies();
  cookieStore.delete("activeHouseholdId");

  revalidatePath("/");
  redirect("/app/onboarding");
}

export async function transferOwnership(
  _householdId: string,
  _newOwnerId: string,
) {
  throw new Error("Not implemented");
}

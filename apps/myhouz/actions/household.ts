"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { createHouseholdSchema } from "@home/types";
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

export async function updateHousehold(
  _householdId: string,
  _formData: FormData,
) {
  throw new Error("Not implemented");
}

export async function deleteHousehold(_householdId: string) {
  throw new Error("Not implemented");
}

export async function transferOwnership(
  _householdId: string,
  _newOwnerId: string,
) {
  throw new Error("Not implemented");
}

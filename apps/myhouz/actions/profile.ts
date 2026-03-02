"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUser } from "@home/auth";
import { createUpdateProfileSchema } from "@home/types";
import { getTranslations } from "next-intl/server";

export async function updateProfile(
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tSettings = await getTranslations("settings");

  const user = await getUser();

  const rawAvatarUrl = formData.get("avatar_url") as string | null;

  const schema = createUpdateProfileSchema(t);
  const parsed = schema.safeParse({
    name: formData.get("name"),
    avatar_url: rawAvatarUrl || null,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError =
      errors.fieldErrors.name?.[0] ?? tSettings("profileSaveError");
    return { error: firstError };
  }

  const supabase = createServerClient();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.avatar_url !== undefined)
    updateData.avatar_url = parsed.data.avatar_url;

  const { error } = await supabase
    .from("profile")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return { error: tSettings("profileSaveError") };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  return {};
}

export async function deleteAccount() {
  throw new Error("Not implemented");
}

"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { createItemCommentSchema } from "@home/types";
import { getTranslations } from "next-intl/server";

export async function addItemComment(
  householdId: string,
  itemId: string,
  content: string,
): Promise<{
  data?: { id: string; content: string; author_id: string; created_at: string };
  error?: string;
}> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");
  const { profile } = await getUserWithRole(householdId);

  const schema = createItemCommentSchema(t);
  const parsed = schema.safeParse({ content });
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.content?.[0] ??
        tError("createCommentError"),
    };
  }

  const supabase = createServerClient();

  // Verify item belongs to household
  const { data: item } = await supabase
    .from("household_item")
    .select("id")
    .eq("id", itemId)
    .eq("household_id", householdId)
    .single();

  if (!item) {
    return { error: tError("createCommentError") };
  }

  const { data: comment, error } = await supabase
    .from("item_comment")
    .insert({
      item_id: itemId,
      household_id: householdId,
      author_id: profile.id,
      content: parsed.data.content,
    })
    .select("id, content, author_id, created_at")
    .single();

  if (error) {
    return { error: tError("createCommentError") };
  }

  revalidatePath(`/app/items/${itemId}`);
  return { data: comment };
}

export async function deleteItemComment(
  householdId: string,
  itemId: string,
  commentId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");
  const { profile } = await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { error } = await supabase
    .from("item_comment")
    .delete()
    .eq("id", commentId)
    .eq("item_id", itemId)
    .eq("household_id", householdId)
    .eq("author_id", profile.id);

  if (error) {
    return { error: tError("deleteCommentError") };
  }

  revalidatePath(`/app/items/${itemId}`);
  return {};
}

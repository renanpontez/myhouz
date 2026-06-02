"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { createItemSchema, createUpdateItemSchema, itemStatusSchema, type TablesUpdate } from "@home/types";
import { getTranslations } from "next-intl/server";

function parseJsonField<T>(raw: string | null): T | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function createItem(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const photos = parseJsonField<string[]>(
    formData.get("photos") as string | null,
  );
  const tags = parseJsonField<string[]>(
    formData.get("tags") as string | null,
  );

  const rawPrice = formData.get("price") as string | null;
  const price = rawPrice ? parseFloat(rawPrice) : undefined;

  const schema = createItemSchema(t);
  const parsed = schema.safeParse({
    name: formData.get("name"),
    type: formData.get("type") || "buy",
    priority: formData.get("priority") || "medium",
    assigned_to: (formData.get("assigned_to") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    price: isNaN(price as number) ? undefined : price,
    photos,
    link: (formData.get("link") as string) || undefined,
    tags,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError =
      errors.fieldErrors.name?.[0] ?? tError("createItemError");
    return { error: firstError };
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("household_item").insert({
    household_id: householdId,
    name: parsed.data.name,
    type: parsed.data.type,
    priority: parsed.data.priority,
    assigned_to: parsed.data.assigned_to ?? null,
    notes: parsed.data.notes ?? null,
    price: parsed.data.price ?? null,
    photos: parsed.data.photos ?? [],
    link: parsed.data.link || null,
    tags: parsed.data.tags ?? [],
    added_by: profile.id,
  });

  if (error) {
    return { error: tError("createItemError") };
  }

  revalidatePath("/app/items");
  revalidatePath("/app/dashboard");
  redirect("/app/items");
}

export async function updateItem(
  householdId: string,
  itemId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const photos = parseJsonField<string[]>(
    formData.get("photos") as string | null,
  );
  const tags = parseJsonField<string[]>(
    formData.get("tags") as string | null,
  );

  const rawPrice = formData.get("price") as string | null;
  const price =
    rawPrice === "" ? null : rawPrice ? parseFloat(rawPrice) : undefined;

  const rawAssignedTo = formData.get("assigned_to") as string | null;
  const rawLink = formData.get("link") as string | null;

  const schema = createUpdateItemSchema(t);
  const parsed = schema.safeParse({
    name: formData.get("name") || undefined,
    type: formData.get("type") || undefined,
    priority: formData.get("priority") || undefined,
    assigned_to: rawAssignedTo || null,
    notes:
      formData.has("notes")
        ? (formData.get("notes") as string) || null
        : undefined,
    price: price === null ? null : isNaN(price as number) ? undefined : price,
    photos: photos !== undefined ? photos : undefined,
    link: rawLink !== null ? rawLink || null : undefined,
    tags: tags !== undefined ? tags : undefined,
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.name?.[0] ??
        tError("updateItemError"),
    };
  }

  const supabase = createServerClient();

  const updateData: TablesUpdate<"household_item"> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
  if (parsed.data.priority !== undefined)
    updateData.priority = parsed.data.priority;
  if (parsed.data.assigned_to !== undefined)
    updateData.assigned_to = parsed.data.assigned_to;
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
  if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
  if (parsed.data.photos !== undefined) updateData.photos = parsed.data.photos;
  if (parsed.data.link !== undefined) updateData.link = parsed.data.link;
  if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;

  const { error } = await supabase
    .from("household_item")
    .update(updateData)
    .eq("id", itemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateItemError") };
  }

  revalidatePath("/app/items");
  revalidatePath(`/app/items/${itemId}`);
  revalidatePath("/app/dashboard");
  return {};
}

export async function deleteItem(
  householdId: string,
  itemId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  // Fetch photos for storage cleanup
  const { data: item } = await supabase
    .from("household_item")
    .select("photos")
    .eq("id", itemId)
    .eq("household_id", householdId)
    .single();

  const { error } = await supabase
    .from("household_item")
    .delete()
    .eq("id", itemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("deleteItemError") };
  }

  // Best-effort storage cleanup
  if (item?.photos && item.photos.length > 0) {
    const paths = item.photos
      .map((url: string) => {
        const match = url.match(/item-images\/(.+)$/);
        return match?.[1];
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from("item-images").remove(paths);
    }
  }

  revalidatePath("/app/items");
  revalidatePath("/app/dashboard");
  redirect("/app/items");
}

export async function markItemDone(
  householdId: string,
  itemId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  // Just set status — the trigger handles resolved_at
  const { error } = await supabase
    .from("household_item")
    .update({ status: "done" })
    .eq("id", itemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateItemError") };
  }

  revalidatePath("/app/items");
  revalidatePath("/app/dashboard");
  return {};
}

export async function changeItemStatus(
  householdId: string,
  itemId: string,
  status: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const parsed = itemStatusSchema.safeParse(status);
  if (!parsed.success) {
    return { error: tError("updateItemError") };
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("household_item")
    .update({ status: parsed.data })
    .eq("id", itemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateItemError") };
  }

  revalidatePath("/app/items");
  revalidatePath(`/app/items/${itemId}`);
  revalidatePath("/app/dashboard");
  return {};
}

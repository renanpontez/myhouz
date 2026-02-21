"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { createReminderSchema, createUpdateReminderSchema } from "@home/types";
import { getTranslations } from "next-intl/server";

export async function createReminder(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const schema = createReminderSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title"),
    due_at: formData.get("due_at"),
    assigned_to: (formData.get("assigned_to") as string) || undefined,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError =
      errors.fieldErrors.title?.[0] ??
      errors.fieldErrors.due_at?.[0] ??
      tError("createReminderError");
    return { error: firstError };
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("reminder").insert({
    household_id: householdId,
    title: parsed.data.title,
    due_at: parsed.data.due_at,
    assigned_to: parsed.data.assigned_to ?? null,
    created_by: profile.id,
  });

  if (error) {
    return { error: tError("createReminderError") };
  }

  revalidatePath("/app/reminders");
  revalidatePath("/app/dashboard");
  redirect("/app/reminders");
}

export async function updateReminder(
  householdId: string,
  reminderId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const rawAssignedTo = formData.get("assigned_to") as string | null;

  const schema = createUpdateReminderSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title") || undefined,
    due_at: formData.get("due_at") || undefined,
    assigned_to: rawAssignedTo || null,
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.title?.[0] ??
        tError("updateReminderError"),
    };
  }

  const supabase = createServerClient();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.due_at !== undefined) updateData.due_at = parsed.data.due_at;
  if (parsed.data.assigned_to !== undefined)
    updateData.assigned_to = parsed.data.assigned_to;

  const { error } = await supabase
    .from("reminder")
    .update(updateData)
    .eq("id", reminderId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateReminderError") };
  }

  revalidatePath("/app/reminders");
  revalidatePath(`/app/reminders/${reminderId}`);
  revalidatePath("/app/dashboard");
  return {};
}

export async function deleteReminder(
  householdId: string,
  reminderId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { error } = await supabase
    .from("reminder")
    .delete()
    .eq("id", reminderId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("deleteReminderError") };
  }

  revalidatePath("/app/reminders");
  revalidatePath("/app/dashboard");
  redirect("/app/reminders");
}

export async function toggleReminderComplete(
  householdId: string,
  reminderId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: reminder } = await supabase
    .from("reminder")
    .select("is_completed")
    .eq("id", reminderId)
    .eq("household_id", householdId)
    .single();

  if (!reminder) {
    return { error: tError("toggleReminderError") };
  }

  const nowCompleted = !reminder.is_completed;

  const { error } = await supabase
    .from("reminder")
    .update({
      is_completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
      completed_by: nowCompleted ? profile.id : null,
    })
    .eq("id", reminderId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("toggleReminderError") };
  }

  revalidatePath("/app/reminders");
  revalidatePath(`/app/reminders/${reminderId}`);
  revalidatePath("/app/dashboard");
  return {};
}

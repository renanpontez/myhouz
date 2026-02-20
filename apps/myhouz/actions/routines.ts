"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { createTaskSchema, createUpdateTaskSchema } from "@home/types";
import { getTranslations } from "next-intl/server";
import { getCycleStart } from "@/lib/cycle";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

function parseRecurrenceMeta(raw: string | null): RecurrenceMeta {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RecurrenceMeta;
  } catch {
    return null;
  }
}

export async function createTask(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const recurrenceMeta = parseRecurrenceMeta(
    formData.get("recurrence_meta") as string | null,
  );

  const rawIcon = formData.get("icon") as string | null;

  const schema = createTaskSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title"),
    recurrence: formData.get("recurrence") || "daily",
    recurrence_meta: recurrenceMeta,
    assigned_to: (formData.get("assigned_to") as string) || undefined,
    icon: rawIcon || null,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError =
      errors.fieldErrors.title?.[0] ?? tError("createTaskError");
    return { error: firstError };
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("routine_task").insert({
    household_id: householdId,
    title: parsed.data.title,
    recurrence: parsed.data.recurrence,
    recurrence_meta: parsed.data.recurrence_meta ?? null,
    assigned_to: parsed.data.assigned_to ?? null,
    icon: parsed.data.icon ?? null,
    created_by: profile.id,
  });

  if (error) {
    return { error: tError("createTaskError") };
  }

  revalidatePath("/app/routines");
  revalidatePath("/app/dashboard");
  redirect("/app/routines");
}

export async function updateTask(
  householdId: string,
  taskId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const rawMeta = formData.get("recurrence_meta") as string | null;
  const recurrenceMeta = parseRecurrenceMeta(rawMeta);
  const rawAssignedTo = formData.get("assigned_to") as string | null;
  const rawIcon = formData.get("icon") as string | null;

  const schema = createUpdateTaskSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title") || undefined,
    recurrence: formData.get("recurrence") || undefined,
    recurrence_meta: recurrenceMeta,
    assigned_to: rawAssignedTo || null,
    icon: rawIcon || null,
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.title?.[0] ??
        tError("updateTaskError"),
    };
  }

  const supabase = createServerClient();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title) updateData.title = parsed.data.title;
  if (parsed.data.recurrence) updateData.recurrence = parsed.data.recurrence;
  if (parsed.data.is_active !== undefined)
    updateData.is_active = parsed.data.is_active;
  if (parsed.data.assigned_to !== undefined)
    updateData.assigned_to = parsed.data.assigned_to;
  if (parsed.data.icon !== undefined) updateData.icon = parsed.data.icon;
  // Always set recurrence_meta when recurrence is provided
  if (parsed.data.recurrence) {
    updateData.recurrence_meta = parsed.data.recurrence_meta ?? null;
  }

  const { error } = await supabase
    .from("routine_task")
    .update(updateData)
    .eq("id", taskId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateTaskError") };
  }

  revalidatePath("/app/routines");
  revalidatePath(`/app/routines/${taskId}`);
  return {};
}

export async function deleteTask(
  householdId: string,
  taskId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const supabase = createServerClient();
  const { error } = await supabase
    .from("routine_task")
    .delete()
    .eq("id", taskId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("deleteTaskError") };
  }

  revalidatePath("/app/routines");
  revalidatePath("/app/dashboard");
  redirect("/app/routines");
}

export async function toggleTask(
  taskId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const supabase = createServerClient();

  const { data: task } = await supabase
    .from("routine_task")
    .select(
      "id, household_id, recurrence, recurrence_meta, last_completed_at",
    )
    .eq("id", taskId)
    .single();

  if (!task) {
    return { error: tError("toggleTaskError") };
  }

  const { profile } = await getUserWithRole(task.household_id);

  const meta = task.recurrence_meta as RecurrenceMeta;
  const cycleStart = getCycleStart(
    task.recurrence as RecurrenceType,
    meta,
  );
  const isCompleted =
    task.last_completed_at && new Date(task.last_completed_at) >= cycleStart;

  if (isCompleted) {
    // Un-complete: clear task fields + delete completion record for this cycle
    const { error: updateError } = await supabase
      .from("routine_task")
      .update({ last_completed_at: null, completed_by: null })
      .eq("id", taskId);

    if (updateError) {
      return { error: tError("toggleTaskError") };
    }

    // Delete the completion record for this cycle
    await supabase
      .from("routine_task_completion")
      .delete()
      .eq("task_id", taskId)
      .gte("completed_at", cycleStart.toISOString());
  } else {
    // Complete: set task fields + insert completion record
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("routine_task")
      .update({ last_completed_at: now, completed_by: profile.id })
      .eq("id", taskId);

    if (updateError) {
      return { error: tError("toggleTaskError") };
    }

    const { error: insertError } = await supabase
      .from("routine_task_completion")
      .insert({
        task_id: taskId,
        completed_at: now,
        completed_by: profile.id,
      });

    if (insertError) {
      return { error: tError("toggleTaskError") };
    }
  }

  revalidatePath("/app/routines");
  revalidatePath("/app/dashboard");
  return {};
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import {
  createUrgentProblemSchema,
  createUpdateUrgentProblemSchema,
} from "@home/types";
import { getTranslations } from "next-intl/server";
import { notifyHouseholdMembers } from "@/lib/notifications";

export async function createUrgentProblem(
  householdId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const schema = createUrgentProblemSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError =
      errors.fieldErrors.title?.[0] ??
      errors.fieldErrors.description?.[0] ??
      tError("createUrgentError");
    return { error: firstError };
  }

  const supabase = createServerClient();

  const { data: problem, error } = await supabase
    .from("urgent_problem")
    .insert({
      household_id: householdId,
      title: parsed.data.title,
      description: parsed.data.description,
      reported_by: profile.id,
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !problem) {
    return { error: tError("createUrgentError") };
  }

  await notifyHouseholdMembers({
    supabase,
    householdId,
    excludeUserId: profile.id,
    type: "urgent_problem_reported",
    title: parsed.data.title,
    referenceId: problem.id,
    referenceType: "urgent_problem",
  });

  revalidatePath("/app/urgent");
  revalidatePath("/app/dashboard");
  redirect("/app/urgent");
}

export async function updateUrgentProblem(
  householdId: string,
  problemId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const t = await getTranslations("validation");
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const schema = createUpdateUrgentProblemSchema(t);
  const parsed = schema.safeParse({
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.title?.[0] ??
        tError("updateUrgentError"),
    };
  }

  const supabase = createServerClient();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined)
    updateData.description = parsed.data.description;

  const { error } = await supabase
    .from("urgent_problem")
    .update(updateData)
    .eq("id", problemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("updateUrgentError") };
  }

  revalidatePath("/app/urgent");
  revalidatePath(`/app/urgent/${problemId}`);
  revalidatePath("/app/dashboard");
  return {};
}

export async function resolveUrgentProblem(
  householdId: string,
  problemId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  const { profile } = await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: problem } = await supabase
    .from("urgent_problem")
    .select("title")
    .eq("id", problemId)
    .eq("household_id", householdId)
    .single();

  const { error } = await supabase
    .from("urgent_problem")
    .update({
      is_active: false,
      resolved_at: new Date().toISOString(),
      resolved_by: profile.id,
    })
    .eq("id", problemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("resolveUrgentError") };
  }

  await notifyHouseholdMembers({
    supabase,
    householdId,
    excludeUserId: profile.id,
    type: "urgent_problem_resolved",
    title: problem?.title ?? "Problem resolved",
    referenceId: problemId,
    referenceType: "urgent_problem",
  });

  revalidatePath("/app/urgent");
  revalidatePath(`/app/urgent/${problemId}`);
  revalidatePath("/app/dashboard");
  return {};
}

export async function deleteUrgentProblem(
  householdId: string,
  problemId: string,
): Promise<{ error?: string }> {
  const tError = await getTranslations("error");

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { error } = await supabase
    .from("urgent_problem")
    .delete()
    .eq("id", problemId)
    .eq("household_id", householdId);

  if (error) {
    return { error: tError("deleteUrgentError") };
  }

  revalidatePath("/app/urgent");
  revalidatePath("/app/dashboard");
  redirect("/app/urgent");
}

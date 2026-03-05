import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateTaskSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const taskId = params.taskId!;

    const { data: task, error } = await supabase
      .from("routine_task")
      .select(
        "id, title, recurrence, recurrence_meta, last_completed_at, completed_by, assigned_to, icon, is_active, starts_at, created_at, created_by",
      )
      .eq("id", taskId)
      .eq("household_id", household.id)
      .single();

    if (error || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    const { data: completions } = await supabase
      .from("routine_task_completion")
      .select("id, completed_at, completed_by")
      .eq("task_id", taskId)
      .order("completed_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      data: { ...task, completions: completions ?? [] },
    });
  },
);

export const PATCH = withHouseholdAuth(
  async (request, { household, supabase }, params) => {
    const taskId = params.taskId!;

    const schema = createUpdateTaskSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const updateData: Record<string, unknown> = {};
    if (result.data.title) updateData.title = result.data.title;
    if (result.data.recurrence) updateData.recurrence = result.data.recurrence;
    if (result.data.is_active !== undefined)
      updateData.is_active = result.data.is_active;
    if (result.data.assigned_to !== undefined)
      updateData.assigned_to = result.data.assigned_to;
    if (result.data.icon !== undefined) updateData.icon = result.data.icon;
    if (result.data.recurrence) {
      updateData.recurrence_meta = result.data.recurrence_meta ?? null;
    }
    if (result.data.starts_at !== undefined)
      updateData.starts_at = result.data.starts_at;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data: task, error } = await supabase
      .from("routine_task")
      .update(updateData)
      .eq("id", taskId)
      .eq("household_id", household.id)
      .select()
      .single();

    if (error || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: task });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const taskId = params.taskId!;

    const { error } = await supabase
      .from("routine_task")
      .delete()
      .eq("id", taskId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { deleted: true } });
  },
);

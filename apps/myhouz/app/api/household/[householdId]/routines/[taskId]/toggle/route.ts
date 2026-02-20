import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { getCycleStart } from "@/lib/cycle";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

export const POST = withHouseholdAuth(
  async (_request, { household, user, supabase }, params) => {
    const taskId = params.taskId!;

    const { data: task, error: taskError } = await supabase
      .from("routine_task")
      .select(
        "id, household_id, recurrence, recurrence_meta, last_completed_at",
      )
      .eq("id", taskId)
      .eq("household_id", household.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    const meta = task.recurrence_meta as RecurrenceMeta;
    const cycleStart = getCycleStart(
      task.recurrence as RecurrenceType,
      meta,
    );
    const isCompleted =
      task.last_completed_at &&
      new Date(task.last_completed_at) >= cycleStart;

    if (isCompleted) {
      // Un-complete: clear task fields + delete completion record for this cycle
      const { error: updateError } = await supabase
        .from("routine_task")
        .update({ last_completed_at: null, completed_by: null })
        .eq("id", taskId);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to toggle task" },
          { status: 500 },
        );
      }

      await supabase
        .from("routine_task_completion")
        .delete()
        .eq("task_id", taskId)
        .gte("completed_at", cycleStart.toISOString());

      return NextResponse.json({ data: { completed: false } });
    }

    // Complete: set task fields + insert completion record
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("routine_task")
      .update({ last_completed_at: now, completed_by: user.id })
      .eq("id", taskId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to toggle task" },
        { status: 500 },
      );
    }

    await supabase.from("routine_task_completion").insert({
      task_id: taskId,
      completed_at: now,
      completed_by: user.id,
    });

    return NextResponse.json({ data: { completed: true } });
  },
);

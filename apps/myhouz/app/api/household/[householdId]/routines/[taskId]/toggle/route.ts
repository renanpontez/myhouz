import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { getCycleStart } from "@/lib/cycle";
import { startOfDay, endOfDay, isSameDay } from "date-fns";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

/** Parse "YYYY-MM-DD" as local midnight (not UTC). */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

export const POST = withHouseholdAuth(
  async (request, { household, user, supabase }, params) => {
    const taskId = params.taskId!;

    // Optional date field for past-day toggling
    let targetDate: Date | null = null;
    try {
      const body = await request.json();
      if (body.date) {
        targetDate = parseLocalDate(body.date);
      }
    } catch {
      // No body or invalid JSON — toggle for today
    }

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
    const today = new Date();
    const isToggleForToday = !targetDate || isSameDay(targetDate, today);

    if (isToggleForToday) {
      const cycleStart = getCycleStart(
        task.recurrence as RecurrenceType,
        meta,
      );
      const isCompleted =
        task.last_completed_at &&
        new Date(task.last_completed_at) >= cycleStart;

      if (isCompleted) {
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
    }

    // Past-day toggle — targetDate is guaranteed non-null here
    const pastDay = targetDate!;
    const dayStart = startOfDay(pastDay).toISOString();
    const dayEnd = endOfDay(pastDay).toISOString();

    const { data: existing } = await supabase
      .from("routine_task_completion")
      .select("id, completed_at")
      .eq("task_id", taskId)
      .gte("completed_at", dayStart)
      .lte("completed_at", dayEnd);

    if (existing && existing.length > 0) {
      await supabase
        .from("routine_task_completion")
        .delete()
        .eq("task_id", taskId)
        .gte("completed_at", dayStart)
        .lte("completed_at", dayEnd);

      if (
        task.last_completed_at &&
        isSameDay(new Date(task.last_completed_at), pastDay)
      ) {
        const { data: latest } = await supabase
          .from("routine_task_completion")
          .select("completed_at, completed_by")
          .eq("task_id", taskId)
          .order("completed_at", { ascending: false })
          .limit(1);

        const latestRecord = latest?.[0];
        if (latestRecord) {
          await supabase
            .from("routine_task")
            .update({
              last_completed_at: latestRecord.completed_at,
              completed_by: latestRecord.completed_by,
            })
            .eq("id", taskId);
        } else {
          await supabase
            .from("routine_task")
            .update({ last_completed_at: null, completed_by: null })
            .eq("id", taskId);
        }
      }

      return NextResponse.json({ data: { completed: false } });
    }

    const completedAt = new Date(pastDay);
    completedAt.setHours(12, 0, 0, 0);

    await supabase.from("routine_task_completion").insert({
      task_id: taskId,
      completed_at: completedAt.toISOString(),
      completed_by: user.id,
    });

    if (
      !task.last_completed_at ||
      completedAt > new Date(task.last_completed_at)
    ) {
      await supabase
        .from("routine_task")
        .update({
          last_completed_at: completedAt.toISOString(),
          completed_by: user.id,
        })
        .eq("id", taskId);
    }

    return NextResponse.json({ data: { completed: true } });
  },
);

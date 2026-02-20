import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createTaskSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (request, { household, supabase }) => {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get("include");

    const { data: tasks, error } = await supabase
      .from("routine_task")
      .select(
        "id, title, recurrence, recurrence_meta, last_completed_at, completed_by, assigned_to, icon, is_active, created_at",
      )
      .eq("household_id", household.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }

    if (include === "completions" && tasks && tasks.length > 0) {
      const taskIds = tasks.map((t) => t.id);
      const { data: completions } = await supabase
        .from("routine_task_completion")
        .select("id, task_id, completed_at, completed_by")
        .in("task_id", taskIds)
        .order("completed_at", { ascending: false });

      const completionsByTask = new Map<string, typeof completions>();
      for (const c of completions ?? []) {
        const list = completionsByTask.get(c.task_id) ?? [];
        list.push(c);
        completionsByTask.set(c.task_id, list);
      }

      const tasksWithCompletions = tasks.map((t) => ({
        ...t,
        completions: completionsByTask.get(t.id) ?? [],
      }));

      return NextResponse.json({ data: tasksWithCompletions });
    }

    return NextResponse.json({ data: tasks });
  },
);

export const POST = withHouseholdAuth(
  async (request, { household, user, supabase }) => {
    const schema = createTaskSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const { data: profile } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user.id)
      .single();

    const { data: task, error } = await supabase
      .from("routine_task")
      .insert({
        household_id: household.id,
        title: result.data.title,
        recurrence: result.data.recurrence,
        recurrence_meta: result.data.recurrence_meta ?? null,
        assigned_to: result.data.assigned_to ?? null,
        icon: result.data.icon ?? null,
        created_by: profile?.id ?? user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: task }, { status: 201 });
  },
);

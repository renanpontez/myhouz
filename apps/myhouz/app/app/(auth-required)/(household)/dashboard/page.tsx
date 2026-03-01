import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUser, getUserWithRole } from "@home/auth";
import { ItemsWidget } from "@/components/dashboard/ItemsWidget";
import { RemindersWidget } from "@/components/dashboard/RemindersWidget";
import { RoutineCalendar } from "@/components/dashboard/RoutineCalendar";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const user = await getUser();

  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  let items: {
    id: string;
    name: string;
    type: "buy" | "repair" | "fix";
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "done";
    price: number | null;
    notes: string | null;
    link: string | null;
    assigned_to: string | null;
  }[] = [];

  let reminders: {
    id: string;
    title: string;
    due_at: string;
    is_completed: boolean;
  }[] = [];

  let tasks: {
    id: string;
    title: string;
    recurrence: string;
    recurrence_meta: unknown;
    last_completed_at: string | null;
    assigned_to: string | null;
    icon: string | null;
  }[] = [];
  let completionsByTask: Record<string, { completed_at: string }[]> = {};

  if (householdId) {
    await getUserWithRole(householdId);
    const supabase = createServerClient();

    // Fetch all datasets in parallel
    const [itemsResult, remindersResult, tasksResult] =
      await Promise.all([
        supabase
          .from("household_item")
          .select("id, name, type, priority, status, price, notes, link, assigned_to")
          .eq("household_id", householdId)
          .neq("status", "done")
          .order("priority", { ascending: false })
          .limit(10),

        supabase
          .from("reminder")
          .select("id, title, due_at, is_completed")
          .eq("household_id", householdId)
          .eq("is_completed", false)
          .order("due_at", { ascending: true })
          .limit(10),

        supabase
          .from("routine_task")
          .select(
            "id, title, recurrence, recurrence_meta, last_completed_at, assigned_to, icon",
          )
          .eq("household_id", householdId)
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);

    items = (itemsResult.data ?? []) as typeof items;
    reminders = (remindersResult.data ?? []) as typeof reminders;
    tasks = tasksResult.data ?? [];

    // Fetch completions for the last 90 days
    const taskIds = tasks.map((t) => t.id);
    if (taskIds.length > 0) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: completions } = await supabase
        .from("routine_task_completion")
        .select("task_id, completed_at")
        .in("task_id", taskIds)
        .gte("completed_at", ninetyDaysAgo.toISOString())
        .order("completed_at", { ascending: false });

      for (const c of completions ?? []) {
        const list = completionsByTask[c.task_id] ?? [];
        list.push({ completed_at: c.completed_at });
        completionsByTask[c.task_id] = list;
      }
    }
  }

  return (
    <div className="p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <RoutineCalendar
          tasks={tasks}
          completionsByTask={completionsByTask}
          userName={user.name?.split(" ")[0] ?? ""}
        />
        <ItemsWidget items={items} />
        <RemindersWidget reminders={reminders} />
      </div>
    </div>
  );
}

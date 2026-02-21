import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { ItemsWidget } from "@/components/dashboard/ItemsWidget";
import { RemindersWidget } from "@/components/dashboard/RemindersWidget";
import { RoutineCalendar } from "@/components/dashboard/RoutineCalendar";
import { UrgentBanner } from "@/components/dashboard/UrgentBanner";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  let items: {
    id: string;
    name: string;
    type: "buy" | "repair" | "fix";
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "done";
    price: number | null;
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

  let urgentProblems: {
    id: string;
    title: string;
    reported_by: string;
    created_at: string;
  }[] = [];

  let memberProfiles: {
    id: string;
    name: string | null;
    email: string;
  }[] = [];

  if (householdId) {
    await getUserWithRole(householdId);
    const supabase = createServerClient();

    // Fetch all datasets in parallel
    const [itemsResult, remindersResult, tasksResult, urgentResult, membersResult] =
      await Promise.all([
        supabase
          .from("household_item")
          .select("id, name, type, priority, status, price")
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

        supabase
          .from("urgent_problem")
          .select("id, title, reported_by, created_at")
          .eq("household_id", householdId)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),

        supabase
          .from("household_member")
          .select("profile:profile(id, name, email)")
          .eq("household_id", householdId),
      ]);

    items = (itemsResult.data ?? []) as typeof items;
    reminders = (remindersResult.data ?? []) as typeof reminders;
    tasks = tasksResult.data ?? [];
    urgentProblems = (urgentResult.data ?? []) as typeof urgentProblems;
    memberProfiles = (membersResult.data ?? []).map((m) => {
      const p = m.profile as { id: string; name: string | null; email: string } | null;
      return { id: p?.id ?? "", name: p?.name ?? null, email: p?.email ?? "" };
    });

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
      <UrgentBanner problems={urgentProblems} members={memberProfiles} />

      <h1 className={`text-2xl font-bold${urgentProblems.length > 0 ? " mt-4" : ""}`}>
        {t("title")}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Column 3: Routine Calendar */}
        <RoutineCalendar
          tasks={tasks}
          completionsByTask={completionsByTask}
        />
        {/* Column 1: Items to Buy */}
        <ItemsWidget items={items} />

        {/* Column 2: Reminders */}
        <RemindersWidget reminders={reminders} />
      </div>
    </div>
  );
}

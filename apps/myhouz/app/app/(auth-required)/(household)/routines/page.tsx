import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { TaskRow } from "@/components/routines/TaskRow";
import { TodayProgress } from "@/components/routines/TodayProgress";
import { isCompletedThisCycle, isActiveToday } from "@/lib/cycle";
import { calculateStreak } from "@/lib/streak";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

export default async function RoutinesPage() {
  const t = await getTranslations("routines");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  // Fetch all active tasks
  const { data: tasks } = await supabase
    .from("routine_task")
    .select(
      "id, title, recurrence, recurrence_meta, assigned_to, last_completed_at, sort_order, icon",
    )
    .eq("household_id", householdId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Fetch recent completions for streak calculation (last 90 days)
  const taskIds = (tasks ?? []).map((t) => t.id);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: completions } = await supabase
    .from("routine_task_completion")
    .select("id, task_id, completed_at, completed_by")
    .in("task_id", taskIds.length > 0 ? taskIds : ["__none__"])
    .gte("completed_at", ninetyDaysAgo.toISOString())
    .order("completed_at", { ascending: false });

  // Group completions by task
  const completionsByTask = new Map<
    string,
    { completed_at: string }[]
  >();
  for (const c of completions ?? []) {
    const list = completionsByTask.get(c.task_id) ?? [];
    list.push({ completed_at: c.completed_at });
    completionsByTask.set(c.task_id, list);
  }

  // Split tasks into today vs other days
  const allTasks = tasks ?? [];
  const todayTasks: typeof allTasks = [];
  const otherTasks: typeof allTasks = [];
  for (const task of allTasks) {
    const meta = task.recurrence_meta as RecurrenceMeta;
    if (isActiveToday(task.recurrence as RecurrenceType, meta)) {
      todayTasks.push(task);
    } else {
      otherTasks.push(task);
    }
  }

  const doneToday = todayTasks.filter((task) => {
    const meta = task.recurrence_meta as RecurrenceMeta;
    return isCompletedThisCycle(
      task.last_completed_at,
      task.recurrence as RecurrenceType,
      meta,
    );
  }).length;

  // Sort: incomplete first, then completed
  const sortedTodayTasks = [...todayTasks].sort((a, b) => {
    const aMeta = a.recurrence_meta as RecurrenceMeta;
    const bMeta = b.recurrence_meta as RecurrenceMeta;
    const aDone = isCompletedThisCycle(
      a.last_completed_at,
      a.recurrence as RecurrenceType,
      aMeta,
    );
    const bDone = isCompletedThisCycle(
      b.last_completed_at,
      b.recurrence as RecurrenceType,
      bMeta,
    );
    if (aDone !== bDone) return aDone ? 1 : -1;
    return a.sort_order - b.sort_order;
  });

  // Other tasks sorted by sort_order
  const sortedOtherTasks = [...otherTasks].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  function renderTaskRow(task: (typeof allTasks)[number]) {
    const meta = task.recurrence_meta as RecurrenceMeta;
    const taskCompletions = completionsByTask.get(task.id) ?? [];
    const streak = calculateStreak(
      task.recurrence as RecurrenceType,
      meta,
      taskCompletions,
    );
    return (
      <TaskRow
        key={task.id}
        task={task}
        isCompletedThisCycle={isCompletedThisCycle(
          task.last_completed_at,
          task.recurrence as RecurrenceType,
          meta,
        )}
        isActiveToday={isActiveToday(
          task.recurrence as RecurrenceType,
          meta,
        )}
        streak={streak}
      />
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link
            href="/app/routines/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            {t("addButton")}
          </Link>
        }
      />

      {(!tasks || tasks.length === 0) ? (
        <div className="mt-6">
          <EmptyState
            title={t("title")}
            description={t("empty")}
            actionLabel={t("addButton")}
            actionHref="/app/routines/new"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Today's tasks */}
          {todayTasks.length > 0 && (
            <div className="space-y-3">
              <TodayProgress done={doneToday} total={todayTasks.length} />
              <div className="space-y-2">
                {sortedTodayTasks.map(renderTaskRow)}
              </div>
            </div>
          )}

          {/* Upcoming / other days */}
          {sortedOtherTasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("otherDays")}
              </h3>
              <div className="space-y-2">
                {sortedOtherTasks.map(renderTaskRow)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

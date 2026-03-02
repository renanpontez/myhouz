import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { RecurrenceBadge } from "@/components/routines/RecurrenceBadge";
import { StreakBadge } from "@/components/routines/StreakBadge";
import { TaskRow } from "@/components/routines/TaskRow";
import { CompletionHistory } from "@/components/routines/CompletionHistory";
import { RoutineDetailActions } from "@/components/routines/RoutineDetailActions";
import { isCompletedThisCycle, isActiveToday } from "@/lib/cycle";
import { calculateStreak } from "@/lib/streak";
import { User, CalendarClock } from "lucide-react";
import { startOfDay, format } from "date-fns";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

interface TaskDetailPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;
  const t = await getTranslations("routines");
  const tNav = await getTranslations("nav");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: task } = await supabase
    .from("routine_task")
    .select(
      "id, title, recurrence, recurrence_meta, is_active, household_id, assigned_to, last_completed_at, created_by, created_at, icon, starts_at",
    )
    .eq("id", taskId)
    .eq("household_id", householdId)
    .single();

  if (!task) notFound();

  // Fetch completion history (last 50)
  const { data: completions } = await supabase
    .from("routine_task_completion")
    .select("id, completed_at, completed_by")
    .eq("task_id", taskId)
    .order("completed_at", { ascending: false })
    .limit(50);

  // Fetch household members for assignee display
  const { data: members } = await supabase
    .from("household_member")
    .select("user_id, profile:profile(id, name, email)")
    .eq("household_id", householdId);

  const recurrence = task.recurrence as RecurrenceType;
  const meta = task.recurrence_meta as RecurrenceMeta;
  const startsAt = task.starts_at ? new Date(task.starts_at) : null;
  const activeToday = isActiveToday(recurrence, meta, startsAt);
  const hasFutureStart =
    startsAt !== null && startOfDay(startsAt) > startOfDay(new Date());
  const completedThisCycle = isCompletedThisCycle(
    task.last_completed_at,
    recurrence,
    meta,
  );

  const streak = calculateStreak(
    recurrence,
    meta,
    (completions ?? []).map((c) => ({ completed_at: c.completed_at })),
  );

  const assigneeProfile = task.assigned_to
    ? (() => {
        const member = members?.find((m) => {
          const p = m.profile as { id: string; name: string | null; email: string } | null;
          return p?.id === task.assigned_to;
        });
        return member?.profile as { id: string; name: string | null; email: string } | null;
      })()
    : null;

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/routines" },
        { label: task.title },
      ]} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h1 className="truncate text-xl font-bold sm:text-2xl">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <RecurrenceBadge recurrence={recurrence} recurrenceMeta={meta} />
            <StreakBadge count={streak} />
            {assigneeProfile && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {assigneeProfile.name ?? assigneeProfile.email}
              </span>
            )}
            {hasFutureStart && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground italic">
                <CalendarClock className="h-3.5 w-3.5" />
                {t("startsOn", { date: format(startsAt!, "MMM d, yyyy") })}
              </span>
            )}
            {!activeToday && !hasFutureStart && (
              <span className="text-xs text-muted-foreground italic">
                {t("notActiveToday")}
              </span>
            )}
          </div>
        </div>
        <RoutineDetailActions householdId={householdId} taskId={taskId} />
      </div>

      {/* Large toggle for today's completion */}
      <div className="mt-6">
        <TaskRow
          task={task}
          isCompletedThisCycle={completedThisCycle}
          isActiveToday={activeToday}
          streak={streak}
        />
      </div>

      {/* Completion history */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">{t("completionHistory")}</h2>
        <div className="mt-3">
          <CompletionHistory completions={completions ?? []} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useOptimistic, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "date-fns";
import {
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  isToday as isDateToday,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Plus,
  Check,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@home/ui";
import { cn } from "@home/ui";
import Link from "next/link";
import { CalendarTaskRow } from "./CalendarTaskRow";
import { isActiveToday, isCompletedThisCycle } from "@/lib/cycle";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import type { RecurrenceMeta } from "@home/types";

interface Task {
  id: string;
  title: string;
  recurrence: string;
  recurrence_meta: unknown;
  last_completed_at: string | null;
  assigned_to: string | null;
  icon: string | null;
}

interface RoutineCalendarProps {
  tasks: Task[];
  completionsByTask: Record<string, { completed_at: string }[]>;
}

const DATE_FNS_LOCALES: Record<string, Locale> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

/* ── Inline pill for today's task strip ── */

function TodayTaskPill({
  task,
  isCompleted,
}: {
  task: Task;
  isCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] =
    useOptimistic(isCompleted);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await toggleTask(task.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        isPending && "opacity-60",
        optimisticCompleted
          ? "border-primary/20 bg-primary/5 text-muted-foreground line-through"
          : "border-border bg-background text-foreground hover:bg-accent",
      )}
    >
      {optimisticCompleted ? (
        <Check className="h-3 w-3 shrink-0 text-primary" strokeWidth={3} />
      ) : (
        <Circle className="h-3 w-3 shrink-0 text-muted-foreground" />
      )}
      <span className="max-w-[8rem] truncate">{task.title}</span>
    </button>
  );
}

/* ── Main component ── */

export function RoutineCalendar({
  tasks,
  completionsByTask,
}: RoutineCalendarProps) {
  const t = useTranslations("dashboard.calendar");
  const locale = useLocale();
  const dateFnsLocale = DATE_FNS_LOCALES[locale] ?? enUS;

  const today = new Date();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(today, { weekStartsOn: 1 }),
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const isCurrentWeek = isSameDay(
    weekStart,
    startOfWeek(today, { weekStartsOn: 1 }),
  );

  // Week range label
  const weekEnd = addDays(weekStart, 6);
  const weekLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${format(weekStart, "MMM d", { locale: dateFnsLocale })} – ${format(weekEnd, "d", { locale: dateFnsLocale })}`
      : `${format(weekStart, "MMM d", { locale: dateFnsLocale })} – ${format(weekEnd, "MMM d", { locale: dateFnsLocale })}`;

  // Today's active tasks for the strip
  const todayTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const meta = task.recurrence_meta as RecurrenceMeta | undefined;
        return isActiveToday(task.recurrence, meta);
      }),
    [tasks],
  );

  const todayDoneCount = todayTasks.filter((task) => {
    const meta = task.recurrence_meta as RecurrenceMeta | undefined;
    return isCompletedThisCycle(task.last_completed_at, task.recurrence, meta);
  }).length;

  // Empty state
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <ListChecks className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("noRoutines")}</p>
          <Link
            href="/app/routines/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            {t("noRoutinesAction")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <Link
              href="/app/routines/new"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={t("addTask")}
            >
              <Plus className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {!isCurrentWeek && (
              <button
                type="button"
                onClick={() => {
                  setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
                }}
                className="mr-1 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t("today")}
              </button>
            )}
            <button
              type="button"
              onClick={() => setWeekStart((w) => subWeeks(w, 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[7rem] text-center text-sm font-medium capitalize text-muted-foreground">
              {weekLabel}
            </span>
            <button
              type="button"
              onClick={() => setWeekStart((w) => addWeeks(w, 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day header row */}
        <div
          className="mb-3 grid items-center gap-2"
          style={{ gridTemplateColumns: "1fr repeat(7, 2rem)" }}
        >
          <span />
          {weekDays.map((day) => {
            const isToday = isDateToday(day);
            return (
              <div key={day.toISOString()} className="flex justify-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {format(day, "EEEEE", { locale: dateFnsLocale })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task rows */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <CalendarTaskRow
              key={task.id}
              task={task}
              completions={completionsByTask[task.id] ?? []}
              weekDays={weekDays}
            />
          ))}
        </div>

        {/* Footer — today's tasks strip + View all */}
        {todayTasks.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {t("tasksCompleted", {
                  done: todayDoneCount,
                  total: todayTasks.length,
                })}
              </span>
              <Link
                href="/app/routines"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("viewAll")}
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {todayTasks.map((task) => {
                const meta = task.recurrence_meta as
                  | RecurrenceMeta
                  | undefined;
                const completed = isCompletedThisCycle(
                  task.last_completed_at,
                  task.recurrence,
                  meta,
                );
                return (
                  <TodayTaskPill
                    key={task.id}
                    task={task}
                    isCompleted={completed}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* View all fallback when no today tasks */}
        {todayTasks.length === 0 && (
          <div className="mt-4 border-t pt-3 text-right">
            <Link
              href="/app/routines"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("viewAll")}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

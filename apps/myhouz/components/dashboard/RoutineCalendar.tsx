"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "date-fns";
import {
  isSameDay,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  isToday as isDateToday,
  isFuture,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import {
  isActiveOnDate,
  isCompletedThisCycle,
  hasCompletionOnDate,
} from "@/lib/cycle";
import { CalendarTaskRow } from "./CalendarTaskRow";
import { Card, CardContent } from "@home/ui";
import { cn } from "@home/ui";
import Link from "next/link";
import type { RecurrenceMeta } from "@home/types";

interface Task {
  id: string;
  title: string;
  recurrence: string;
  recurrence_meta: unknown;
  last_completed_at: string | null;
  assigned_to: string | null;
}

interface RoutineCalendarProps {
  tasks: Task[];
  completionsByTask: Record<string, { completed_at: string }[]>;
}

const DATE_FNS_LOCALES: Record<string, Locale> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

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
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // 7 days of the current week
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  // Task stats per day in the visible week
  const dayTaskMap = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();

    for (const day of weekDays) {
      let total = 0;
      let done = 0;
      const isDayToday = isDateToday(day);

      for (const task of tasks) {
        const meta = task.recurrence_meta as RecurrenceMeta;
        if (isActiveOnDate(task.recurrence, meta, day)) {
          total++;
          if (isDayToday) {
            if (
              isCompletedThisCycle(
                task.last_completed_at,
                task.recurrence,
                meta,
              )
            ) {
              done++;
            }
          } else if (!isFuture(day)) {
            const taskCompletions = completionsByTask[task.id] ?? [];
            if (hasCompletionOnDate(taskCompletions, day)) {
              done++;
            }
          }
        }
      }

      if (total > 0) {
        map.set(day.toDateString(), { total, done });
      }
    }

    return map;
  }, [weekDays, tasks, completionsByTask]);

  // Tasks active on the selected date
  const selectedDayTasks = useMemo(() => {
    return tasks.filter((task) => {
      const meta = task.recurrence_meta as RecurrenceMeta;
      return isActiveOnDate(task.recurrence, meta, selectedDate);
    });
  }, [tasks, selectedDate]);

  const selectedDayStats = dayTaskMap.get(selectedDate.toDateString());
  const isSelectedToday = isDateToday(selectedDate);

  const dateLabel = isSelectedToday
    ? t("today")
    : format(selectedDate, "EEEE, MMM d", { locale: dateFnsLocale });

  function goToPrevWeek() {
    setWeekStart((w) => subWeeks(w, 1));
  }

  function goToNextWeek() {
    setWeekStart((w) => addWeeks(w, 1));
  }

  function goToThisWeek() {
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    setWeekStart(thisWeekStart);
    setSelectedDate(today);
  }

  const isCurrentWeek = isSameDay(
    weekStart,
    startOfWeek(today, { weekStartsOn: 1 }),
  );

  // Week range label: "Feb 17 – 23"
  const weekEnd = addDays(weekStart, 6);
  const weekLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${format(weekStart, "MMM d", { locale: dateFnsLocale })} – ${format(weekEnd, "d", { locale: dateFnsLocale })}`
      : `${format(weekStart, "MMM d", { locale: dateFnsLocale })} – ${format(weekEnd, "MMM d", { locale: dateFnsLocale })}`;

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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={goToThisWeek}
              className="rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t("today")}
            </button>
          )}
        </div>

        {/* Week navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPrevWeek}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium capitalize">{weekLabel}</span>
          <button
            type="button"
            onClick={goToNextWeek}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Week day strip */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isToday = isDateToday(day);
            const isSelected = isSameDay(day, selectedDate);
            const dayStats = dayTaskMap.get(day.toDateString());
            const hasTasks = !!dayStats;
            const allDone = hasTasks && dayStats.done === dayStats.total;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "group flex flex-col items-center gap-1 rounded-xl py-2 transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <span className="text-[11px] font-medium uppercase">
                  {format(day, "EEE", { locale: dateFnsLocale })}
                </span>
                <span
                  className={cn(
                    "text-lg font-semibold leading-none",
                    isSelected
                      ? "text-primary-foreground"
                      : isToday
                        ? "text-foreground"
                        : "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                {/* Dot indicator */}
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    hasTasks
                      ? isSelected
                        ? "bg-primary-foreground"
                        : allDone
                          ? "bg-green-500 dark:bg-green-400"
                          : "bg-primary"
                      : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Selected day task list */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize">
              {t("tasksForDay", { date: dateLabel })}
            </h3>
            {selectedDayStats && (
              <span className="text-xs font-medium text-muted-foreground">
                {t("tasksCompleted", {
                  done: selectedDayStats.done,
                  total: selectedDayStats.total,
                })}
              </span>
            )}
          </div>

          {selectedDayTasks.length === 0 ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              {t("noTasks")}
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDayTasks.map((task) => (
                <CalendarTaskRow
                  key={task.id}
                  task={task}
                  completions={completionsByTask[task.id] ?? []}
                  selectedDate={selectedDate.toISOString()}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useMemo } from "react";
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
import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import { Card, CardContent } from "@home/ui";
import { cn } from "@home/ui";
import Link from "next/link";
import { CalendarTaskRow } from "./CalendarTaskRow";
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
          <h2 className="text-lg font-semibold">{t("title")}</h2>
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
      </CardContent>
    </Card>
  );
}

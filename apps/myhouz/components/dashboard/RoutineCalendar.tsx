"use client";

import { useState, useMemo, useOptimistic, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "date-fns";
import {
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  subDays,
  format,
  isSameDay,
  isToday as isDateToday,
  isFuture,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Plus,
  Check,
  Flame,
  List,
  LayoutGrid,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "@home/ui";
import Link from "next/link";
import {
  isActiveOnDate,
  isCompletedThisCycle,
  hasCompletionOnDate,
} from "@/lib/cycle";
import { getTaskIcon } from "@/lib/task-icons";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import { useHousehold, useUser } from "@home/auth/hooks";
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
  userName: string;
}

const DATE_FNS_LOCALES: Record<string, Locale> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

/** Short 3-letter day abbreviation: "seg", "ter", … / "Mon", "Tue", … */
function shortDayName(day: Date, loc: Locale): string {
  const raw = format(day, "EEE", { locale: loc }).replace(".", "");
  // pt-BR returns full names like "segunda", "terça" — take first 3 chars
  return raw.length > 3 ? raw.slice(0, 3) : raw;
}

/** "RENAN MARTINS" → "Renan" */
function toTitleCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** "RENAN MARTINS" → "Renan M." */
function formatDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const firstPart = parts[0];
  if (!firstPart) return fullName;
  const first = toTitleCase(firstPart);
  if (parts.length === 1) return first;
  const lastPart = parts[parts.length - 1];
  if (!lastPart) return first;
  const lastInitial = lastPart.charAt(0).toUpperCase();
  return `${first} ${lastInitial}.`;
}

function getStreak(completions: { completed_at: string }[]): number {
  if (completions.length === 0) return 0;
  const completionDays = new Set(
    completions.map((c) => format(new Date(c.completed_at), "yyyy-MM-dd")),
  );
  let streak = 0;
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const startFrom = completionDays.has(todayStr) ? 0 : 1;
  for (let i = startFrom; i < 365; i++) {
    const dayStr = format(subDays(now, i), "yyyy-MM-dd");
    if (completionDays.has(dayStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/* ── Timeline task row ── */

function TimelineTaskRow({
  task,
  isCompleted,
  recurrenceLabel,
  streak,
  disabled,
}: {
  task: Task;
  isCompleted: boolean;
  recurrenceLabel: string;
  streak: number;
  disabled?: boolean;
}) {
  const { members } = useHousehold();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] =
    useOptimistic(isCompleted);

  const assignee = task.assigned_to
    ? members.find((m) => m.id === task.assigned_to)
    : null;

  function handleToggle() {
    if (disabled) return;
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await toggleTask(task.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  const TaskIcon = getTaskIcon(task.icon);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3",
        isPending && "opacity-60",
      )}
    >
      {/* Checkbox — sits on the dotted line, outside the card */}
      <button
        type="button"
        onClick={disabled ? undefined : handleToggle}
        disabled={disabled}
        className={cn(
          "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          optimisticCompleted
            ? "border-primary bg-primary text-white"
            : "border-muted-foreground/30 bg-background",
          disabled
            ? "cursor-default opacity-70"
            : "hover:border-muted-foreground/50",
        )}
      >
        {optimisticCompleted && (
          <Check className="h-4 w-4" strokeWidth={3} />
        )}
      </button>

      {/* Card — wraps icon + content + streak */}
      <div
        className={cn(
          "flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 shadow-sm",
          optimisticCompleted
            ? "bg-white/30"
            : "bg-white dark:bg-card",
        )}
      >
        {/* Task icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          {TaskIcon ? (
            <TaskIcon className="h-4 w-4 text-primary" />
          ) : task.icon ? (
            <DynamicIcon
              name={task.icon as IconName}
              className="h-4 w-4 text-primary"
            />
          ) : (
            <ListChecks className="h-4 w-4 text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              optimisticCompleted && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {assignee
              ? formatDisplayName(assignee.name ?? assignee.email)
              : recurrenceLabel}
          </p>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            <Flame className="h-4 w-4 text-brand-accent" />
            <span className="text-sm font-semibold">{streak}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── View mode persistence ── */

const VIEW_STORAGE_KEY = "myhouz:routine-view";
type ViewMode = "timeline" | "matrix";

/* ── Matrix cell (interactive for today) ── */

function MatrixCell({
  task,
  isCompleted,
  isToday,
  isActive,
  isFutureDay,
}: {
  task: Task;
  isCompleted: boolean;
  isToday: boolean;
  isActive: boolean;
  isFutureDay: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(isCompleted);

  function handleToggle() {
    if (!isToday || !isActive) return;
    startTransition(async () => {
      setOptimistic(!optimistic);
      const result = await toggleTask(task.id);
      if (result.error) toast.error(result.error);
    });
  }

  if (!isActive) {
    return (
      <div className="flex justify-center">
        <div className="h-3 w-3 rounded-full bg-muted-foreground/10" />
      </div>
    );
  }

  if (isFutureDay) {
    return (
      <div className="flex justify-center">
        <div className="h-7 w-7 rounded-full border-2 border-muted-foreground/10" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={isToday ? handleToggle : undefined}
        disabled={!isToday}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          optimistic
            ? "bg-green-500 dark:bg-green-400"
            : isToday
              ? "border-2 border-primary/40 hover:border-primary/60"
              : "border-2 border-muted-foreground/20",
          isPending && "opacity-60",
          !isToday && "cursor-default",
        )}
      >
        {optimistic && (
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        )}
      </button>
    </div>
  );
}

/* ── Weekly matrix view ── */

function WeeklyMatrixView({
  tasks,
  weekDays,
  completionsByTask,
  dateFnsLocale,
  noActiveLabel,
}: {
  tasks: Task[];
  weekDays: Date[];
  completionsByTask: Record<string, { completed_at: string }[]>;
  dateFnsLocale: Locale;
  noActiveLabel: string;
}) {
  const user = useUser();
  const weekActiveTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const meta = task.recurrence_meta as RecurrenceMeta | undefined;
        return weekDays.some((day) => isActiveOnDate(task.recurrence, meta, day));
      }),
    [tasks, weekDays],
  );

  if (weekActiveTasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <p className="text-sm text-muted-foreground">{noActiveLabel}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-3 py-3 shadow-sm dark:bg-card">
      {/* Column headers */}
      <div className="mb-1 grid grid-cols-[2.5rem_repeat(7,1fr)] items-center gap-x-1">
        <div />
        {weekDays.map((day) => (
          <span
            key={day.toISOString()}
            className={cn(
              "text-center text-xs uppercase",
              isDateToday(day)
                ? "font-semibold text-foreground"
                : "text-muted-foreground",
            )}
          >
            {shortDayName(day, dateFnsLocale)}
          </span>
        ))}
      </div>

      {/* Task rows */}
      {weekActiveTasks.map((task) => {
        const meta = task.recurrence_meta as RecurrenceMeta | undefined;
        const TaskIcon = getTaskIcon(task.icon);

        const isMine = !task.assigned_to || task.assigned_to === user.id;

        return (
          <div
            key={task.id}
            className={cn(
              "grid grid-cols-[2.5rem_repeat(7,1fr)] items-center gap-x-1 py-2",
              !isMine && "opacity-75",
            )}
          >
            {/* Task icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg">
              {TaskIcon ? (
                <TaskIcon className="h-4 w-4 text-primary" />
              ) : task.icon ? (
                <DynamicIcon
                  name={task.icon as IconName}
                  className="h-4 w-4 text-primary"
                />
              ) : (
                <ListChecks className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* 7 day cells */}
            {weekDays.map((day) => {
              const isDayToday = isDateToday(day);
              const isFutureDay = isFuture(day) && !isDayToday;
              const active = isActiveOnDate(task.recurrence, meta, day);

              let completed = false;
              if (active && !isFutureDay) {
                if (isDayToday) {
                  completed = isCompletedThisCycle(
                    task.last_completed_at,
                    task.recurrence,
                    meta,
                  );
                } else {
                  completed = hasCompletionOnDate(
                    completionsByTask[task.id] ?? [],
                    day,
                  );
                }
              }

              return (
                <MatrixCell
                  key={day.toISOString()}
                  task={task}
                  isCompleted={completed}
                  isToday={isDayToday}
                  isActive={active}
                  isFutureDay={isFutureDay}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ── */

export function RoutineCalendar({
  tasks,
  completionsByTask,
  userName,
}: RoutineCalendarProps) {
  const t = useTranslations("dashboard.calendar");
  const tDashboard = useTranslations("dashboard");
  const tEnums = useTranslations("enums");
  const locale = useLocale();
  const dateFnsLocale = DATE_FNS_LOCALES[locale] ?? enUS;

  const today = new Date();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(today, { weekStartsOn: 1 }),
  );
  const [selectedDay, setSelectedDay] = useState(() => today);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "timeline";
    return (localStorage.getItem(VIEW_STORAGE_KEY) as ViewMode) ?? "timeline";
  });

  function handleViewChange(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const isCurrentWeek = isSameDay(
    weekStart,
    startOfWeek(today, { weekStartsOn: 1 }),
  );

  const weekEnd = addDays(weekStart, 6);
  const weekLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${format(weekStart, "MMM d", { locale: dateFnsLocale })} - ${format(weekEnd, "d", { locale: dateFnsLocale })}`
      : `${format(weekStart, "MMM d", { locale: dateFnsLocale })} - ${format(weekEnd, "MMM d", { locale: dateFnsLocale })}`;

  const isSelectedToday = isDateToday(selectedDay);

  // Tasks active on the selected day
  const selectedDayTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const meta = task.recurrence_meta as RecurrenceMeta | undefined;
        return isActiveOnDate(task.recurrence, meta, selectedDay);
      }),
    [tasks, selectedDay],
  );

  // Completion count for selected day
  const selectedDayDoneCount = selectedDayTasks.filter((task) => {
    if (isSelectedToday) {
      const meta = task.recurrence_meta as RecurrenceMeta | undefined;
      return isCompletedThisCycle(
        task.last_completed_at,
        task.recurrence,
        meta,
      );
    }
    return hasCompletionOnDate(completionsByTask[task.id] ?? [], selectedDay);
  }).length;

  // Per-day completion status for the strip
  const dayStatuses = useMemo(
    () =>
      weekDays.map((day) => {
        const isDayToday = isDateToday(day);
        const isFutureDay = isFuture(day) && !isDayToday;

        let active = 0;
        let done = 0;
        for (const task of tasks) {
          const meta = task.recurrence_meta as RecurrenceMeta | undefined;
          if (!isActiveOnDate(task.recurrence, meta, day)) continue;
          active++;
          if (isFutureDay) {
            // Future days: no completions yet
          } else if (isDayToday) {
            if (
              isCompletedThisCycle(
                task.last_completed_at,
                task.recurrence,
                meta,
              )
            )
              done++;
          } else {
            if (hasCompletionOnDate(completionsByTask[task.id] ?? [], day))
              done++;
          }
        }
        return { active, done };
      }),
    [weekDays, tasks, completionsByTask],
  );

  function selectDay(day: Date) {
    setSelectedDay(day);
    setShowAllTasks(false);
  }

  function handleWeekPrev() {
    const newWeekStart = subWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    selectDay(
      isSameDay(newWeekStart, currentWeekStart) ? today : newWeekStart,
    );
  }

  function handleWeekNext() {
    const newWeekStart = addWeeks(weekStart, 1);
    setWeekStart(newWeekStart);
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    selectDay(
      isSameDay(newWeekStart, currentWeekStart) ? today : newWeekStart,
    );
  }

  function handleGoToToday() {
    setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    selectDay(today);
  }

  const displayName = toTitleCase(userName);

  // Heading for the task list
  const taskListHeading = isSelectedToday
    ? t("todaysTasks")
    : t("tasksForDay", {
      date: format(selectedDay, "MMM d", { locale: dateFnsLocale }),
    });

  return (
    <div>
      {/* Greeting + Week navigation */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {tDashboard("greeting", { name: displayName })}
        </h1>
        <div className="flex items-center gap-1">
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={handleGoToToday}
              className="mr-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
            >
              {t("today")}
            </button>
          )}
          <button
            type="button"
            onClick={handleWeekPrev}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[8rem] text-center text-sm font-medium capitalize text-muted-foreground">
            {weekLabel}
          </span>
          <button
            type="button"
            onClick={handleWeekNext}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day strip */}
      <div className="mb-8 grid grid-cols-7 gap-2">
        {weekDays.map((day, i) => {
          const isDayToday = isDateToday(day);
          const isSelected = isSameDay(day, selectedDay);
          const status = dayStatuses[i];
          const done = status?.done ?? 0;
          const active = status?.active ?? 0;
          const hasActive = active > 0;
          const allDone = hasActive && done === active;
          const progress = hasActive ? done / active : 0;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => selectDay(day)}
              className="flex flex-col items-center gap-1"
            >
              {/* Progress arc (SVG) */}
              <div className="relative flex h-7 items-end justify-center">
                {hasActive && (
                  <>
                    <svg viewBox="0 0 44 24" className="h-6 w-10">
                      <path
                        d="M 2 22 A 20 20 0 0 1 42 22"
                        fill="none"
                        strokeWidth="2.5"
                        className="stroke-muted-foreground/15"
                      />
                      {progress > 0 && (
                        <path
                          d="M 2 22 A 20 20 0 0 1 42 22"
                          fill="none"
                          strokeWidth="2.5"
                          className="stroke-green-500 dark:stroke-green-400"
                          strokeDasharray={`${progress * 62.83} ${62.83}`}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    {allDone && (
                      <div className="absolute -bottom-2 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-green-500 shadow-sm dark:bg-green-400">
                        <Check
                          className="h-3.5 w-3.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Day pill */}
              <div
                className={cn(
                  "flex w-full flex-col items-center rounded-lg py-3 transition-colors",
                  isDayToday && isSelected
                    ? "bg-foreground text-background shadow-md"
                    : isSelected
                      ? "bg-primary/10 text-primary shadow-sm ring-2 ring-primary/30"
                      : isDayToday
                        ? "bg-foreground/80 text-background shadow-md"
                        : "bg-white text-muted-foreground shadow-sm dark:bg-card",
                )}
              >
                <span
                  className={cn(
                    "text-2xl font-bold leading-tight",
                    isDayToday && isSelected
                      ? "text-background"
                      : isSelected
                        ? "text-primary"
                        : isDayToday
                          ? "text-background"
                          : "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                <span
                  className={cn(
                    "text-xs uppercase leading-tight",
                    isDayToday && isSelected
                      ? "text-background/70"
                      : isSelected
                        ? "text-primary/70"
                        : isDayToday
                          ? "text-background/70"
                          : "text-muted-foreground",
                  )}
                >
                  {shortDayName(day, dateFnsLocale)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Task list heading */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{taskListHeading}</h2>
          <Link
            href="/app/routines/new"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={t("addTask")}
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex items-center gap-2">

          {viewMode === "timeline" && selectedDayTasks.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {t("tasksCompleted", {
                done: selectedDayDoneCount,
                total: selectedDayTasks.length,
              })}
            </span>
          )}
          {/* View toggle */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleViewChange("timeline")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                viewMode === "timeline"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              aria-label={t("viewTimeline")}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("matrix")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                viewMode === "matrix"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              aria-label={t("viewMatrix")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Task list / Matrix view */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <ListChecks className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("noRoutines")}</p>
          <Link
            href="/app/routines/new"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("noRoutinesAction")}
          </Link>
        </div>
      ) : viewMode === "matrix" ? (
        <WeeklyMatrixView
          tasks={tasks}
          weekDays={weekDays}
          completionsByTask={completionsByTask}
          dateFnsLocale={dateFnsLocale}
          noActiveLabel={t("noActiveThisWeek")}
        />
      ) : selectedDayTasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <p className="text-sm text-muted-foreground">{t("noTasks")}</p>
        </div>
      ) : (() => {
        const visibleTasks = showAllTasks
          ? selectedDayTasks
          : selectedDayTasks.slice(0, 5);
        const hasMore = selectedDayTasks.length > 5;

        return (
          <>
            <div className="relative space-y-2">
              {/* Vertical dotted line — through checkbox centers */}
              {visibleTasks.length > 1 && (
                <div className="absolute left-[13px] top-7 bottom-7 w-px border-l-2 border-dashed border-muted-foreground/20" />
              )}
              {visibleTasks.map((task) => {
                const meta = task.recurrence_meta as
                  | RecurrenceMeta
                  | undefined;

                let completed: boolean;
                if (isSelectedToday) {
                  completed = isCompletedThisCycle(
                    task.last_completed_at,
                    task.recurrence,
                    meta,
                  );
                } else if (
                  isFuture(selectedDay) &&
                  !isDateToday(selectedDay)
                ) {
                  completed = false;
                } else {
                  completed = hasCompletionOnDate(
                    completionsByTask[task.id] ?? [],
                    selectedDay,
                  );
                }

                const label = tEnums(`recurrence.${task.recurrence}`);
                const streak = getStreak(completionsByTask[task.id] ?? []);
                return (
                  <TimelineTaskRow
                    key={task.id}
                    task={task}
                    isCompleted={completed}
                    recurrenceLabel={label}
                    streak={streak}
                    disabled={!isSelectedToday}
                  />
                );
              })}
            </div>

            {hasMore && !showAllTasks && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllTasks(true)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("viewAll")} ({selectedDayTasks.length})
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

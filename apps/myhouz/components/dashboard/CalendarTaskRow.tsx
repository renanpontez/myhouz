"use client";

import { useOptimistic, useTransition } from "react";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import {
  isActiveOnDate,
  isCompletedThisCycle,
  hasCompletionOnDate,
} from "@/lib/cycle";
import { isToday as isDateToday, isFuture } from "date-fns";
import { Check } from "lucide-react";
import { cn } from "@home/ui";
import type { RecurrenceMeta } from "@home/types";

interface CalendarTaskRowProps {
  task: {
    id: string;
    title: string;
    recurrence: string;
    recurrence_meta: unknown;
    last_completed_at: string | null;
    assigned_to: string | null;
  };
  completions: { completed_at: string }[];
  weekDays: Date[];
}

export function CalendarTaskRow({
  task,
  completions,
  weekDays,
}: CalendarTaskRowProps) {
  const meta = task.recurrence_meta as RecurrenceMeta;

  const todayCompleted = isCompletedThisCycle(
    task.last_completed_at,
    task.recurrence,
    meta,
  );

  const [isPending, startTransition] = useTransition();
  const [optimisticTodayCompleted, setOptimisticTodayCompleted] =
    useOptimistic(todayCompleted);

  function handleToggleToday() {
    startTransition(async () => {
      setOptimisticTodayCompleted(!optimisticTodayCompleted);
      const result = await toggleTask(task.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div
      className={cn(
        "grid items-center gap-2 transition-opacity",
        isPending && "opacity-60",
      )}
      style={{ gridTemplateColumns: "1fr repeat(7, 2rem)" }}
    >
      {/* Task name */}
      <span className="truncate pr-2 text-sm font-medium">{task.title}</span>

      {/* 7 day dots */}
      {weekDays.map((day) => {
        const isToday = isDateToday(day);
        const isActive = isActiveOnDate(task.recurrence, meta, day);
        const isFutureDay = isFuture(day) && !isToday;

        let completed = false;
        if (isActive) {
          if (isToday) {
            completed = optimisticTodayCompleted;
          } else if (!isFutureDay) {
            completed = hasCompletionOnDate(completions, day);
          }
        }

        // Not active on this day
        if (!isActive) {
          return (
            <div key={day.toISOString()} className="flex justify-center">
              <div className="h-7 w-7 rounded-full bg-muted/50" />
            </div>
          );
        }

        // Future day — active, scheduled but can't act yet
        if (isFutureDay) {
          return (
            <div key={day.toISOString()} className="flex justify-center">
              <div className="h-7 w-7 rounded-full bg-primary/15" />
            </div>
          );
        }

        // Today — interactive
        if (isToday) {
          return (
            <div key={day.toISOString()} className="flex justify-center">
              <button
                type="button"
                onClick={handleToggleToday}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                  completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/20 hover:bg-primary/30",
                )}
                aria-label={task.title}
              >
                {completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
            </div>
          );
        }

        // Past day
        return (
          <div key={day.toISOString()} className="flex justify-center">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                completed
                  ? "bg-primary/70 text-primary-foreground"
                  : "bg-primary/15",
              )}
            >
              {completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

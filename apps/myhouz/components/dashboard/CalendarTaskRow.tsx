"use client";

import { useOptimistic, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import { User } from "lucide-react";
import { RecurrenceBadgeClient } from "@/components/routines/RecurrenceBadgeClient";
import { isCompletedThisCycle, hasCompletionOnDate } from "@/lib/cycle";
import { isSameDay } from "date-fns";
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
  selectedDate: string; // ISO string
}

export function CalendarTaskRow({
  task,
  completions,
  selectedDate,
}: CalendarTaskRowProps) {
  const t = useTranslations("routines");
  const { members } = useHousehold();

  const date = new Date(selectedDate);
  const isToday = isSameDay(date, new Date());
  const meta = task.recurrence_meta as RecurrenceMeta;

  const isCompleted = isToday
    ? isCompletedThisCycle(task.last_completed_at, task.recurrence, meta)
    : hasCompletionOnDate(completions, date);

  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] =
    useOptimistic(isCompleted);

  const assignee = task.assigned_to
    ? members.find((m) => m.id === task.assigned_to)
    : null;

  function handleToggle() {
    if (!isToday) return;
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await toggleTask(task.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-opacity ${
        isPending ? "opacity-70" : ""
      }`}
    >
      {isToday ? (
        <button
          type="button"
          onClick={handleToggle}
          className="shrink-0"
          aria-label={
            optimisticCompleted ? t("completedAt", { time: "" }) : task.title
          }
        >
          <input
            type="checkbox"
            checked={optimisticCompleted}
            readOnly
            className="h-4 w-4 rounded border-input accent-primary pointer-events-none"
            tabIndex={-1}
          />
        </button>
      ) : (
        <div className="shrink-0">
          <input
            type="checkbox"
            checked={optimisticCompleted}
            readOnly
            disabled
            className="h-4 w-4 rounded border-input accent-primary opacity-50"
            tabIndex={-1}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span
          className={
            optimisticCompleted
              ? "text-sm text-muted-foreground line-through"
              : "text-sm font-medium"
          }
        >
          {task.title}
        </span>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <RecurrenceBadgeClient
            recurrence={task.recurrence}
            recurrenceMeta={meta}
          />
          {assignee && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {assignee.name ?? assignee.email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

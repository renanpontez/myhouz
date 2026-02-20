"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { User, Flame } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { RecurrenceBadgeClient } from "./RecurrenceBadgeClient";
import { getTaskIcon } from "@/lib/task-icons";
import type { RecurrenceMeta } from "@home/types";

interface TaskRowProps {
  task: {
    id: string;
    title: string;
    recurrence: string;
    recurrence_meta: unknown;
    last_completed_at: string | null;
    assigned_to: string | null;
    icon?: string | null;
  };
  isCompletedThisCycle: boolean;
  isActiveToday: boolean;
  streak: number;
}

export function TaskRow({
  task,
  isCompletedThisCycle,
  isActiveToday,
  streak,
}: TaskRowProps) {
  const t = useTranslations("routines");
  const { members } = useHousehold();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] =
    useOptimistic(isCompletedThisCycle);

  const assignee = task.assigned_to
    ? members.find((m) => m.id === task.assigned_to)
    : null;

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await toggleTask(task.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  const streakStyle =
    streak >= 30
      ? "text-red-600 dark:text-red-400"
      : streak >= 7
        ? "text-orange-600 dark:text-orange-400"
        : "text-amber-600 dark:text-amber-400";

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-opacity ${
        isPending ? "opacity-70" : ""
      } ${!isActiveToday ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="shrink-0"
        aria-label={
          optimisticCompleted ? "Mark as incomplete" : "Mark as complete"
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
      <Link
        href={`/app/routines/${task.id}`}
        className="flex-1 min-w-0"
      >
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
            recurrenceMeta={task.recurrence_meta as RecurrenceMeta}
          />
          {assignee && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {(() => {
                const StaticIcon = getTaskIcon(task.icon ?? null);
                if (StaticIcon) return <StaticIcon className="h-3 w-3 text-primary" />;
                if (task.icon) return <DynamicIcon name={task.icon as IconName} className="h-3 w-3 text-primary" />;
                return <User className="h-3 w-3" />;
              })()}
              {assignee.name ?? assignee.email}
            </span>
          )}
          {streak > 0 && (
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${streakStyle}`}
            >
              <Flame className="h-3 w-3" />
              {streak}
            </span>
          )}
          {task.last_completed_at && optimisticCompleted && (
            <span className="text-xs text-muted-foreground">
              {t("completedAt", {
                time: formatDistanceToNow(
                  new Date(task.last_completed_at),
                  { addSuffix: true },
                ),
              })}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

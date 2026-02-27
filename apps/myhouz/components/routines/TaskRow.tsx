"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { cn } from "@home/ui";
import { toggleTask } from "@/actions/routines";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Check, ChevronRight, User, Flame } from "lucide-react";
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

  function renderTaskIcon() {
    const StaticIcon = getTaskIcon(task.icon ?? null);
    if (StaticIcon) return <StaticIcon className="h-5 w-5 text-primary" />;
    if (task.icon)
      return (
        <DynamicIcon
          name={task.icon as IconName}
          className="h-5 w-5 text-primary"
        />
      );
    return <User className="h-5 w-5 text-primary" />;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-opacity dark:bg-card",
        isPending && "opacity-70",
        !isActiveToday && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          optimisticCompleted
            ? "border-primary bg-primary"
            : "border-muted-foreground/30 bg-background",
        )}
        aria-label={
          optimisticCompleted ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {optimisticCompleted && (
          <Check className="h-4 w-4 text-primary-foreground" />
        )}
      </button>

      <Link
        href={`/app/routines/${task.id}`}
        className="flex flex-1 items-center gap-4 min-w-0"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background">
          {optimisticCompleted ? (
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            renderTaskIcon()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-base font-medium",
              optimisticCompleted && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <RecurrenceBadgeClient
              recurrence={task.recurrence}
              recurrenceMeta={task.recurrence_meta as RecurrenceMeta}
            />
            {assignee && (
              <span>{assignee.name ?? assignee.email}</span>
            )}
            {streak > 0 && (
              <span
                className={`flex items-center gap-0.5 font-medium ${streakStyle}`}
              >
                <Flame className="h-3.5 w-3.5" />
                {streak}
              </span>
            )}
            {task.last_completed_at && optimisticCompleted && (
              <span>
                {t("completedAt", {
                  time: formatDistanceToNow(
                    new Date(task.last_completed_at),
                    { addSuffix: true },
                  ),
                })}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground/40" />
      </Link>
    </div>
  );
}

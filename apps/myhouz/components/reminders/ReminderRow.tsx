"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Badge } from "@home/ui";
import { User, Clock } from "lucide-react";
import { toggleReminderComplete } from "@/actions/reminders";
import { toast } from "sonner";

interface ReminderRowProps {
  reminder: {
    id: string;
    title: string;
    due_at: string;
    assigned_to: string | null;
    is_completed: boolean;
  };
}

function getDueStatus(dueAt: string): "overdue" | "dueToday" | "future" {
  const now = new Date();
  const due = new Date(dueAt);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  if (due < todayStart) return "overdue";
  if (due < todayEnd) return "dueToday";
  return "future";
}

function formatDueDate(dueAt: string): string {
  const d = new Date(dueAt);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReminderRow({ reminder }: ReminderRowProps) {
  const t = useTranslations("reminders");
  const { members, household } = useHousehold();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    reminder.is_completed,
  );

  const assignee = reminder.assigned_to
    ? members.find((m) => m.id === reminder.assigned_to)
    : null;

  const dueStatus = getDueStatus(reminder.due_at);

  const dueColorClass =
    !optimisticCompleted && dueStatus === "overdue"
      ? "text-destructive"
      : !optimisticCompleted && dueStatus === "dueToday"
        ? "text-amber-600 dark:text-amber-500"
        : "text-muted-foreground";

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await toggleReminderComplete(household.id, reminder.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-opacity ${
        isPending ? "opacity-70" : ""
      } ${!optimisticCompleted && dueStatus === "overdue" ? "border-destructive/30 bg-destructive/5" : ""}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="shrink-0"
        aria-label={
          optimisticCompleted ? t("markIncomplete") : t("markComplete")
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

      <Link href={`/app/reminders/${reminder.id}`} className="flex-1 min-w-0">
        <span
          className={
            optimisticCompleted
              ? "text-sm text-muted-foreground line-through"
              : "text-sm font-medium"
          }
        >
          {reminder.title}
        </span>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-1 text-xs ${dueColorClass}`}>
            <Clock className="h-3 w-3" />
            {formatDueDate(reminder.due_at)}
          </span>

          {!optimisticCompleted && dueStatus === "overdue" && (
            <Badge variant="destructive" className="text-[10px]">
              {t("overdue")}
            </Badge>
          )}

          {!optimisticCompleted && dueStatus === "dueToday" && (
            <Badge
              variant="outline"
              className="border-amber-500/30 text-[10px] text-amber-600 dark:text-amber-500"
            >
              {t("dueToday")}
            </Badge>
          )}

          {optimisticCompleted && (
            <Badge variant="default" className="text-[10px]">
              {t("completed")}
            </Badge>
          )}

          {assignee && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {assignee.name ?? assignee.email}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

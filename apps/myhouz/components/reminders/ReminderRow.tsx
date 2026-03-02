"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { cn } from "@home/ui";
import { Bell, Check, ChevronRight, Clock, User } from "lucide-react";
import { toggleReminderComplete } from "@/actions/reminders";
import { toast } from "sonner";
import { format, isPast, isToday } from "date-fns";

interface ReminderRowProps {
  reminder: {
    id: string;
    title: string;
    due_at: string;
    assigned_to: string | null;
    is_completed: boolean;
  };
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

  const dueDate = new Date(reminder.due_at);
  const overdue =
    !optimisticCompleted && isPast(dueDate) && !isToday(dueDate);
  const dueToday = !optimisticCompleted && isToday(dueDate);

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
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-opacity hover:bg-accent/40",
        isPending && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          optimisticCompleted
            ? "border-primary bg-primary"
            : "border-muted-foreground/30 bg-background",
        )}
        aria-label={
          optimisticCompleted ? t("markIncomplete") : t("markComplete")
        }
      >
        {optimisticCompleted && (
          <Check className="h-4 w-4 text-primary-foreground" />
        )}
      </button>

      <Link
        href={`/app/reminders/${reminder.id}`}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background",
            overdue
              ? "text-destructive"
              : dueToday
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground",
          )}
        >
          {optimisticCompleted ? (
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              optimisticCompleted && "text-muted-foreground line-through",
            )}
          >
            {reminder.title}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {format(dueDate, "MMM d, HH:mm")}
            {overdue && `  ·  ${t("overdue")}`}
            {dueToday && `  ·  ${t("dueToday")}`}
            {assignee && `  ·  ${assignee.name ?? assignee.email}`}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30" />
      </Link>
    </div>
  );
}

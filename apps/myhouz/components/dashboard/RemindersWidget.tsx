"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@home/ui";
import { cn } from "@home/ui";
import {
  Bell,
  Check,
  Plus,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { isToday, isPast, format } from "date-fns";

interface Reminder {
  id: string;
  title: string;
  due_at: string;
  is_completed: boolean;
}

interface RemindersWidgetProps {
  reminders: Reminder[];
}

type SortKey = "dueDate" | "newest";
type FilterKey = "all" | "overdue" | "today" | "upcoming";

const SORT_OPTIONS: SortKey[] = ["dueDate", "newest"];
const FILTER_OPTIONS: FilterKey[] = ["all", "overdue", "today", "upcoming"];

export function RemindersWidget({ reminders }: RemindersWidgetProps) {
  const t = useTranslations("dashboard.remindersWidget");

  const [activeSort, setActiveSort] = useState<SortKey>("dueDate");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const pendingReminders = reminders.filter((r) => !r.is_completed);

  const filteredReminders = pendingReminders.filter((r) => {
    const dueDate = new Date(r.due_at);
    if (activeFilter === "overdue") return isPast(dueDate) && !isToday(dueDate);
    if (activeFilter === "today") return isToday(dueDate);
    if (activeFilter === "upcoming") return !isPast(dueDate) || isToday(dueDate);
    return true;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (activeSort === "dueDate") {
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    }
    // newest — reverse chronological
    return new Date(b.due_at).getTime() - new Date(a.due_at).getTime();
  });

  const displayReminders = sortedReminders.slice(0, 5);

  const hasActiveFilters = activeFilter !== "all" || activeSort !== "dueDate";

  return (
    <div>
      {/* Title + filter icon */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        {pendingReminders.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-accent",
                  hasActiveFilters
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-1">
              {/* Sort section */}
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {t("sortBy")}
              </p>
              {SORT_OPTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSort(key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    activeSort === key && "font-medium",
                  )}
                >
                  <span>{t(`sort${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
                  {activeSort === key && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}

              <div className="mx-2 my-1 h-px bg-border" />

              {/* Filter section */}
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {t("filterBy")}
              </p>
              {FILTER_OPTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    activeFilter === key && "font-medium",
                  )}
                >
                  <span>{t(`filter${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
                  {activeFilter === key && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Spacer */}
      <div className="mb-6" />

      {pendingReminders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Bell className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Link
            href="/app/reminders/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {t("emptyAction")}
          </Link>
        </div>
      ) : (
        <TooltipProvider delayDuration={300}>
          <div className="rounded-2xl bg-white shadow-sm dark:bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {displayReminders.map((reminder) => {
                const dueDate = new Date(reminder.due_at);
                const overdue = isPast(dueDate) && !isToday(dueDate);
                const dueToday = isToday(dueDate);

                return (
                  <Link
                    key={reminder.id}
                    href={`/app/reminders/${reminder.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        overdue
                          ? "bg-destructive/10 text-destructive"
                          : dueToday
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {reminder.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {format(dueDate, "MMM d, HH:mm")}
                        {dueToday && !overdue && `  ·  ${t("dueToday")}`}
                      </p>
                    </div>
                    {overdue ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex shrink-0 items-center">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>{t("overdueTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      )}

      {/* View all — bottom */}
      {pendingReminders.length > 0 && (
        <div className="mt-4 text-right">
          <Link
            href="/app/reminders"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
          </Link>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@home/ui";
import { cn } from "@home/ui";
import { Bell, Check, Plus, ChevronRight, Clock } from "lucide-react";
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

export async function RemindersWidget({ reminders }: RemindersWidgetProps) {
  const t = await getTranslations("dashboard.remindersWidget");

  const pendingReminders = reminders
    .filter((r) => !r.is_completed)
    .sort(
      (a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime(),
    );
  const displayReminders = pendingReminders.slice(0, 5);

  const overdueCount = pendingReminders.filter(
    (r) => isPast(new Date(r.due_at)) && !isToday(new Date(r.due_at)),
  ).length;

  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl font-bold">{t("title")}</h2>

      {/* Subtitle */}
      <div className="mt-1 mb-6 flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{t("pendingLabel")}</span>
        </div>
        {overdueCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {overdueCount} {t("overdue")}
          </Badge>
        )}
      </div>

      {pendingReminders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10">
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
        <div className="space-y-3">
          {displayReminders.map((reminder) => {
            const dueDate = new Date(reminder.due_at);
            const overdue = isPast(dueDate) && !isToday(dueDate);
            const dueToday = isToday(dueDate);

            return (
              <Link
                key={reminder.id}
                href={`/app/reminders/${reminder.id}`}
                className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-colors hover:bg-white/80 dark:bg-card dark:hover:bg-card/80"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background",
                    overdue
                      ? "text-destructive"
                      : dueToday
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground",
                  )}
                >
                  {reminder.is_completed ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium">
                    {reminder.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {format(dueDate, "MMM d, HH:mm")}
                    {overdue && `  ·  ${t("overdue")}`}
                    {dueToday && !overdue && `  ·  ${t("dueToday")}`}
                  </p>
                </div>
                <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground/40" />
              </Link>
            );
          })}
        </div>
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

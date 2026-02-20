import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, Badge } from "@home/ui";
import { Bell, Check, Plus } from "lucide-react";
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

  return (
    <Card className="h-full">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <Link
            href="/app/reminders"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
          </Link>
        </div>

        {pendingReminders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Link
              href="/app/reminders/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("emptyAction")}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {displayReminders.map((reminder) => {
              const dueDate = new Date(reminder.due_at);
              const overdue = isPast(dueDate) && !isToday(dueDate);
              const dueToday = isToday(dueDate);

              return (
                <Link
                  key={reminder.id}
                  href={`/app/reminders/${reminder.id}`}
                  className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-accent"
                >
                  <div className="shrink-0">
                    {reminder.is_completed ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Bell
                        className={`h-4 w-4 ${
                          overdue
                            ? "text-destructive"
                            : dueToday
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {reminder.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {format(dueDate, "MMM d, HH:mm")}
                    </span>
                  </div>
                  {overdue && (
                    <Badge variant="destructive" className="shrink-0 text-[10px]">
                      {t("overdue")}
                    </Badge>
                  )}
                  {dueToday && !overdue && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-amber-300 text-[10px] text-amber-600 dark:border-amber-700 dark:text-amber-400"
                    >
                      {t("dueToday")}
                    </Badge>
                  )}
                </Link>
              );
            })}

            {pendingReminders.length > 5 && (
              <Link
                href="/app/reminders"
                className="block pt-1 text-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                +{pendingReminders.length - 5}
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Badge } from "@home/ui";
import { cn } from "@home/ui";
import { getTranslations } from "next-intl/server";
import { getRecurrenceDescription } from "@/lib/cycle";
import type { RecurrenceMeta } from "@home/types";

interface RecurrenceBadgeProps {
  recurrence: string;
  recurrenceMeta?: RecurrenceMeta;
  className?: string;
}

const RECURRENCE_STYLES: Record<string, string> = {
  daily: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  weekly: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  monthly: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  weekdays: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  weekends: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  custom: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export async function RecurrenceBadge({ recurrence, recurrenceMeta, className }: RecurrenceBadgeProps) {
  const tEnums = await getTranslations("enums");

  const dayLabels = [0, 1, 2, 3, 4, 5, 6].map((d) => tEnums(`dayShort.${d}`));
  const unitLabels = {
    days: tEnums("intervalUnit.days"),
    weeks: tEnums("intervalUnit.weeks"),
    months: tEnums("intervalUnit.months"),
  };

  const customDesc = getRecurrenceDescription(recurrence, recurrenceMeta ?? null, dayLabels, unitLabels);
  const label = customDesc ?? tEnums(`recurrence.${recurrence}`);
  const style = RECURRENCE_STYLES[recurrence] ?? RECURRENCE_STYLES.custom;

  return (
    <Badge
      variant="outline"
      className={cn("border-none text-xs", style, className)}
    >
      {label}
    </Badge>
  );
}

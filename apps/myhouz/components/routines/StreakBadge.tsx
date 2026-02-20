import { Badge } from "@home/ui";
import { cn } from "@home/ui";
import { Flame } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface StreakBadgeProps {
  count: number;
  className?: string;
}

export async function StreakBadge({ count, className }: StreakBadgeProps) {
  if (count === 0) return null;

  const t = await getTranslations("routines");

  const style =
    count >= 30
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : count >= 7
        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";

  return (
    <Badge
      variant="outline"
      className={cn("border-none text-xs gap-1", style, className)}
    >
      <Flame className="h-3 w-3" />
      {t("streak", { count })}
    </Badge>
  );
}

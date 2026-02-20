import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";

interface TodayProgressProps {
  done: number;
  total: number;
}

export async function TodayProgress({ done, total }: TodayProgressProps) {
  const t = await getTranslations("routines");

  if (total === 0) return null;

  const allDone = done === total;
  const progress = (done / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {allDone ? (
            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              {t("allDoneToday")}
            </span>
          ) : (
            t("todayProgress", { done, total })
          )}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            allDone ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

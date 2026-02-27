import Link from "next/link";
import { cn } from "@home/ui";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface UrgentProblemRowProps {
  problem: {
    id: string;
    title: string;
    reported_by: string;
    is_active: boolean;
    created_at: string;
  };
  reporterName: string;
}

export function UrgentProblemRow({
  problem,
  reporterName,
}: UrgentProblemRowProps) {
  return (
    <Link
      href={`/app/urgent/${problem.id}`}
      className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-colors hover:bg-white/80 dark:bg-card dark:hover:bg-card/80"
    >
      <div
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background",
          problem.is_active ? "text-destructive" : "text-muted-foreground",
        )}
      >
        <AlertTriangle className="h-5 w-5" />
        {problem.is_active && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse-dot" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-base font-medium",
            !problem.is_active && "text-muted-foreground",
          )}
        >
          {problem.title}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {reporterName}  &middot;  {formatRelativeTime(problem.created_at)}
        </p>
      </div>
      <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground/40" />
    </Link>
  );
}

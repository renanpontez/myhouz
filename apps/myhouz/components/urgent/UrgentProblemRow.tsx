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
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
    >
      <div
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          problem.is_active ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        {problem.is_active && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive animate-pulse-dot" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            !problem.is_active && "text-muted-foreground",
          )}
        >
          {problem.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {reporterName}  &middot;  {formatRelativeTime(problem.created_at)}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30" />
    </Link>
  );
}

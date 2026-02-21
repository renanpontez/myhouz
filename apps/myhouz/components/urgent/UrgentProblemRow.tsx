import Link from "next/link";
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
      className={`block rounded-lg border p-3 transition-colors hover:bg-accent/50 ${
        problem.is_active
          ? "border-l-4 border-l-destructive"
          : "border-l-4 border-l-muted opacity-70"
      }`}
    >
      <div className="flex items-center gap-2">
        {problem.is_active && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-destructive animate-pulse-dot" />
        )}
        <span
          className={
            problem.is_active ? "text-sm font-medium" : "text-sm text-muted-foreground"
          }
        >
          {problem.title}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{reporterName}</span>
        <span>&middot;</span>
        <span>{formatRelativeTime(problem.created_at)}</span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface UrgentBannerProps {
  problems: {
    id: string;
    title: string;
    reported_by: string;
    created_at: string;
  }[];
  members: {
    id: string;
    name: string | null;
    email: string;
  }[];
}

export async function UrgentBanner({ problems, members }: UrgentBannerProps) {
  if (problems.length === 0) return null;

  const t = await getTranslations("dashboard.urgentBanner");

  const memberMap = new Map(members.map((m) => [m.id, m.name ?? m.email]));
  const displayed = problems.slice(0, 3);
  const remaining = problems.length - displayed.length;

  return (
    <div className="rounded-lg border border-destructive/20 border-l-4 border-l-destructive bg-destructive/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-destructive animate-pulse-dot" />
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-semibold text-destructive">
            {t("title")} ({problems.length})
          </span>
        </div>
        <Link
          href="/app/urgent"
          className="text-xs font-medium text-destructive hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {displayed.map((problem) => (
          <Link
            key={problem.id}
            href={`/app/urgent/${problem.id}`}
            className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-destructive/10"
          >
            <span className="font-medium">{problem.title}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {t("reportedBy", {
                name: memberMap.get(problem.reported_by) ?? "?",
              })}{" "}
              &middot; {formatRelativeTime(problem.created_at)}
            </span>
          </Link>
        ))}
        {remaining > 0 && (
          <p className="px-2 text-xs text-muted-foreground">
            {t("moreCount", { count: remaining })}
          </p>
        )}
      </div>
    </div>
  );
}

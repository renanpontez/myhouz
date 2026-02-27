import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AlertTriangle, ChevronRight } from "lucide-react";
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
    <div className="rounded-2xl bg-brand-accent p-5 text-brand-accent-foreground shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold">
            {t("title")} ({problems.length})
          </span>
        </div>
        <Link
          href="/app/urgent"
          className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          {t("viewAll")}
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 space-y-1.5">
        {displayed.map((problem) => (
          <Link
            key={problem.id}
            href={`/app/urgent/${problem.id}`}
            className="block rounded-xl bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/20"
          >
            <span className="font-medium">{problem.title}</span>
            <span className="ml-2 text-xs opacity-80">
              {t("reportedBy", {
                name: memberMap.get(problem.reported_by) ?? "?",
              })}{" "}
              &middot; {formatRelativeTime(problem.created_at)}
            </span>
          </Link>
        ))}
        {remaining > 0 && (
          <p className="px-3 text-xs opacity-70">
            {t("moreCount", { count: remaining })}
          </p>
        )}
      </div>
    </div>
  );
}

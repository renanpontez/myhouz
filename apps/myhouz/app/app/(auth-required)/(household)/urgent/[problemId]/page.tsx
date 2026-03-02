import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { Badge } from "@home/ui";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ResolveProblemButton } from "@/components/urgent/ResolveProblemButton";
import { UrgentDetailActions } from "@/components/urgent/UrgentDetailActions";
import { AlertTriangle, User } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ProblemDetailPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const { problemId } = await params;
  const t = await getTranslations("urgent");
  const tNav = await getTranslations("nav");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: problem } = await supabase
    .from("urgent_problem")
    .select(
      "id, title, description, reported_by, is_active, resolved_at, resolved_by, created_at",
    )
    .eq("id", problemId)
    .eq("household_id", householdId)
    .single();

  if (!problem) notFound();

  const { data: members } = await supabase
    .from("household_member")
    .select("user_id, profile:profile(id, name, email)")
    .eq("household_id", householdId);

  function resolveName(userId: string | null) {
    if (!userId) return null;
    const member = members?.find((m) => {
      const p = m.profile as {
        id: string;
        name: string | null;
        email: string;
      } | null;
      return p?.id === userId;
    });
    const profile = member?.profile as {
      id: string;
      name: string | null;
      email: string;
    } | null;
    return profile?.name ?? profile?.email ?? null;
  }

  const reporterName = resolveName(problem.reported_by);
  const resolverName = resolveName(problem.resolved_by);

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/urgent" },
        { label: problem.title },
      ]} />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            {problem.is_active && (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-destructive animate-pulse-dot" />
            )}
            <h1 className="truncate text-xl font-bold sm:text-2xl">{problem.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {problem.is_active ? (
              <Badge variant="destructive">{t("active")}</Badge>
            ) : (
              <Badge variant="default">{t("resolved")}</Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {problem.is_active && (
            <ResolveProblemButton
              householdId={householdId}
              problemId={problemId}
            />
          )}
          <UrgentDetailActions
            householdId={householdId}
            problemId={problemId}
          />
        </div>
      </div>

      {/* Description */}
      {problem.description && (
        <div className="mt-5">
          <p className="whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
            {problem.description}
          </p>
        </div>
      )}

      {/* Details card */}
      {(reporterName || (!problem.is_active && resolverName)) && (
        <div className="mt-5 rounded-2xl bg-white shadow-sm dark:bg-card">
          {reporterName && (
            <div className="px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {t("reportedBy")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {reporterName}
                <span className="text-xs font-normal text-muted-foreground">
                  {formatRelativeTime(problem.created_at)}
                </span>
              </p>
            </div>
          )}
          {!problem.is_active && resolverName && (
            <div className="border-t px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {t("resolvedBy")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {resolverName}
                {problem.resolved_at && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {formatRelativeTime(problem.resolved_at)}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

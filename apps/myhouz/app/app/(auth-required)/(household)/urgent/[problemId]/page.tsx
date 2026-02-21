import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { ResolveProblemButton } from "@/components/urgent/ResolveProblemButton";
import { DeleteProblemButton } from "@/components/urgent/DeleteProblemButton";
import { Badge, Button } from "@home/ui";
import { Pencil, AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ProblemDetailPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function ProblemDetailPage({
  params,
}: ProblemDetailPageProps) {
  const { problemId } = await params;
  const t = await getTranslations("urgent");
  const tCommon = await getTranslations("common");
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
    <div className="p-6">
      <BackLink href="/app/urgent" />

      <div className="mt-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {problem.is_active && (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-destructive animate-pulse-dot" />
            )}
            <h1 className="text-2xl font-bold">{problem.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {problem.is_active ? (
              <Badge variant="destructive">{t("active")}</Badge>
            ) : (
              <Badge variant="default">{t("resolved")}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {problem.is_active && (
            <ResolveProblemButton
              householdId={householdId}
              problemId={problemId}
            />
          )}
          <Link href={`/app/urgent/${problemId}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              {tCommon("edit")}
            </Button>
          </Link>
          <DeleteProblemButton
            householdId={householdId}
            problemId={problemId}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="whitespace-pre-wrap text-sm">{problem.description}</p>
      </div>

      {/* Reporter */}
      {reporterName && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("reportedBy")}
          </h3>
          <p className="mt-1 text-sm">
            {reporterName}
            <span className="ml-2 text-xs text-muted-foreground">
              {formatRelativeTime(problem.created_at)}
            </span>
          </p>
        </div>
      )}

      {/* Resolver */}
      {!problem.is_active && resolverName && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("resolvedBy")}
          </h3>
          <p className="mt-1 text-sm">
            {resolverName}
            {problem.resolved_at && (
              <span className="ml-2 text-xs text-muted-foreground">
                {formatRelativeTime(problem.resolved_at)}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

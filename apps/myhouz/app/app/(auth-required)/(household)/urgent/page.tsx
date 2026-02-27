import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { UrgentProblemRow } from "@/components/urgent/UrgentProblemRow";
import { UrgentFilterTabs } from "@/components/urgent/UrgentFilterTabs";

interface UrgentPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function UrgentPage({ searchParams }: UrgentPageProps) {
  const { filter = "active" } = await searchParams;
  const t = await getTranslations("urgent");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const [problemsResult, membersResult] = await Promise.all([
    supabase
      .from("urgent_problem")
      .select("id, title, description, reported_by, is_active, resolved_at, resolved_by, created_at")
      .eq("household_id", householdId)
      .order("created_at", { ascending: false }),

    supabase
      .from("household_member")
      .select("profile:profile(id, name, email)")
      .eq("household_id", householdId),
  ]);

  const allProblems = problemsResult.data ?? [];
  const memberMap = new Map(
    (membersResult.data ?? []).map((m) => {
      const p = m.profile as { id: string; name: string | null; email: string } | null;
      return [p?.id ?? "", p?.name ?? p?.email ?? ""] as const;
    }),
  );

  let filtered = allProblems;
  if (filter === "active") {
    filtered = allProblems.filter((p) => p.is_active);
  } else if (filter === "resolved") {
    filtered = allProblems.filter((p) => !p.is_active);
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link
            href="/app/urgent/new"
            className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
          >
            {t("addButton")}
          </Link>
        }
      />

      <div className="mt-4">
        <UrgentFilterTabs />
      </div>

      {allProblems.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={t("title")}
            description={t("empty")}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((problem) => (
            <UrgentProblemRow
              key={problem.id}
              problem={problem}
              reporterName={memberMap.get(problem.reported_by) ?? "?"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

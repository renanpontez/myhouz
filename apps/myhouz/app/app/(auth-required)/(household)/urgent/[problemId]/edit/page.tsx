import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { UrgentProblemForm } from "@/components/urgent/UrgentProblemForm";

interface EditProblemPageProps {
  params: Promise<{ problemId: string }>;
}

export default async function EditProblemPage({
  params,
}: EditProblemPageProps) {
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
    .select("id, title, description")
    .eq("id", problemId)
    .eq("household_id", householdId)
    .single();

  if (!problem) notFound();

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/urgent" },
        { label: problem.title, href: `/app/urgent/${problemId}` },
        { label: t("editTitle") },
      ]} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("editTitle")}</h1>
      </div>
      <div className="mt-6 max-w-md">
        <UrgentProblemForm
          mode="edit"
          problemId={problemId}
          defaultValues={{
            title: problem.title,
            description: problem.description,
          }}
        />
      </div>
    </div>
  );
}

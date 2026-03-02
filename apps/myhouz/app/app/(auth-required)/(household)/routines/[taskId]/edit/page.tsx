import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { TaskForm } from "@/components/routines/TaskForm";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

interface EditTaskPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { taskId } = await params;
  const t = await getTranslations("routines");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();
  const { data: task } = await supabase
    .from("routine_task")
    .select("id, title, recurrence, recurrence_meta, assigned_to, household_id, icon, starts_at")
    .eq("id", taskId)
    .eq("household_id", householdId)
    .single();

  if (!task) notFound();

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href={`/app/routines/${taskId}`} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("editTitle")}</h1>
      </div>
      <div className="mt-6 max-w-md">
        <TaskForm
          mode="edit"
          taskId={taskId}
          defaultValues={{
            title: task.title,
            recurrence: task.recurrence as RecurrenceType,
            recurrence_meta: task.recurrence_meta as RecurrenceMeta,
            assigned_to: task.assigned_to,
            icon: task.icon,
            starts_at: task.starts_at,
          }}
        />
      </div>
    </div>
  );
}

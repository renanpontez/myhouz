import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { ReminderForm } from "@/components/reminders/ReminderForm";

interface EditReminderPageProps {
  params: Promise<{ reminderId: string }>;
}

export default async function EditReminderPage({
  params,
}: EditReminderPageProps) {
  const { reminderId } = await params;
  const t = await getTranslations("reminders");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();
  const { data: reminder } = await supabase
    .from("reminder")
    .select("id, title, due_at, assigned_to")
    .eq("id", reminderId)
    .eq("household_id", householdId)
    .single();

  if (!reminder) notFound();

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href={`/app/reminders/${reminderId}`} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("editTitle")}</h1>
      </div>
      <div className="mt-6 max-w-md">
        <ReminderForm
          mode="edit"
          reminderId={reminderId}
          defaultValues={{
            title: reminder.title,
            due_at: reminder.due_at,
            assigned_to: reminder.assigned_to,
          }}
        />
      </div>
    </div>
  );
}

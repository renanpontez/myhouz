import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReminderRow } from "@/components/reminders/ReminderRow";
import { ReminderFilterTabs } from "@/components/reminders/ReminderFilterTabs";

interface RemindersPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function RemindersPage({
  searchParams,
}: RemindersPageProps) {
  const { filter = "upcoming" } = await searchParams;
  const t = await getTranslations("reminders");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: reminders } = await supabase
    .from("reminder")
    .select("id, title, due_at, assigned_to, is_completed, created_at")
    .eq("household_id", householdId)
    .order("due_at", { ascending: true });

  const allReminders = reminders ?? [];

  let filtered = allReminders;
  if (filter === "upcoming") {
    filtered = allReminders.filter((r) => !r.is_completed);
  } else if (filter === "completed") {
    filtered = allReminders.filter((r) => r.is_completed);
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link
            href="/app/reminders/new"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("addButton")}
          </Link>
        }
      />

      <div className="mt-4">
        <ReminderFilterTabs />
      </div>

      {allReminders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={t("title")}
            description={t("empty")}
            actionLabel={t("addButton")}
            actionHref="/app/reminders/new"
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {t("noReminders")}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((reminder) => (
            <ReminderRow key={reminder.id} reminder={reminder} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { DeleteReminderButton } from "@/components/reminders/DeleteReminderButton";
import { ToggleReminderButton } from "@/components/reminders/ToggleReminderButton";
import { Badge, Button } from "@home/ui";
import { Pencil, User, Clock, Calendar } from "lucide-react";

interface ReminderDetailPageProps {
  params: Promise<{ reminderId: string }>;
}

function getDueStatus(dueAt: string): "overdue" | "dueToday" | "future" {
  const now = new Date();
  const due = new Date(dueAt);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  if (due < todayStart) return "overdue";
  if (due < todayEnd) return "dueToday";
  return "future";
}

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { reminderId } = await params;
  const t = await getTranslations("reminders");
  const tCommon = await getTranslations("common");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: reminder } = await supabase
    .from("reminder")
    .select(
      "id, title, due_at, assigned_to, created_by, is_completed, completed_at, completed_by, created_at",
    )
    .eq("id", reminderId)
    .eq("household_id", householdId)
    .single();

  if (!reminder) notFound();

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

  const assigneeName = resolveName(reminder.assigned_to);
  const creatorName = resolveName(reminder.created_by);
  const completedByName = resolveName(reminder.completed_by);

  const dueStatus = getDueStatus(reminder.due_at);
  const dueDate = new Date(reminder.due_at);

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href="/app/reminders" />

      <div className="mt-4 flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{reminder.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {reminder.is_completed ? (
              <Badge variant="default">{t("completed")}</Badge>
            ) : dueStatus === "overdue" ? (
              <Badge variant="destructive">{t("overdue")}</Badge>
            ) : dueStatus === "dueToday" ? (
              <Badge
                variant="outline"
                className="border-amber-500/30 text-amber-600 dark:text-amber-500"
              >
                {t("dueToday")}
              </Badge>
            ) : null}

            {assigneeName && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {assigneeName}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/app/reminders/${reminderId}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              {tCommon("edit")}
            </Button>
          </Link>
          <DeleteReminderButton
            householdId={householdId}
            reminderId={reminderId}
          />
        </div>
      </div>

      {/* Toggle action */}
      <div className="mt-6">
        <ToggleReminderButton
          householdId={householdId}
          reminderId={reminderId}
          isCompleted={reminder.is_completed}
        />
      </div>

      {/* Due date */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("dueAtLabel")}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {dueDate.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
          {dueDate.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Creator */}
      {creatorName && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("createdBy")}
          </h3>
          <p className="mt-1 text-sm">{creatorName}</p>
        </div>
      )}

      {/* Completed by */}
      {reminder.is_completed && completedByName && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("completedBy")}
          </h3>
          <p className="mt-1 text-sm">
            {completedByName}
            {reminder.completed_at && (
              <span className="ml-2 text-xs text-muted-foreground">
                {new Date(reminder.completed_at).toLocaleString()}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

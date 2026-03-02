import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { cn } from "@home/ui";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ReminderDetailActions } from "@/components/reminders/ReminderDetailActions";
import { ToggleReminderButton } from "@/components/reminders/ToggleReminderButton";
import { Bell, User, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface ReminderDetailPageProps {
  params: Promise<{ reminderId: string }>;
}

function getDueStatus(dueAt: string, isCompleted: boolean): "completed" | "overdue" | "dueToday" | "future" {
  if (isCompleted) return "completed";
  const now = new Date();
  const due = new Date(dueAt);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);

  if (due < todayStart) return "overdue";
  if (due < todayEnd) return "dueToday";
  return "future";
}

const STATUS_STYLES = {
  completed: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/10 text-destructive",
  dueToday: "bg-muted text-foreground",
  future: "bg-muted text-muted-foreground",
} as const;

export default async function ReminderDetailPage({
  params,
}: ReminderDetailPageProps) {
  const { reminderId } = await params;
  const t = await getTranslations("reminders");
  const tNav = await getTranslations("nav");
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

  const dueStatus = getDueStatus(reminder.due_at, reminder.is_completed);
  const dueDate = new Date(reminder.due_at);

  const StatusIcon = dueStatus === "completed" ? CheckCircle2 : Bell;

  return (
    <div className="px-4 py-6 sm:p-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("title"), href: "/app/reminders" },
        { label: reminder.title },
      ]} />

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              STATUS_STYLES[dueStatus],
            )}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-2xl">
              {reminder.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {dueStatus === "completed"
                ? t("completed")
                : dueStatus === "overdue"
                  ? t("overdue")
                  : dueStatus === "dueToday"
                    ? t("dueToday")
                    : t("upcoming")}
              {assigneeName && (
                <>
                  <span className="mx-1.5 text-muted-foreground/40">&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <User className="inline h-3 w-3" />
                    {assigneeName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <ReminderDetailActions
          householdId={householdId}
          reminderId={reminderId}
        />
      </div>

      {/* Toggle action */}
      <div className="mt-5">
        <ToggleReminderButton
          householdId={householdId}
          reminderId={reminderId}
          isCompleted={reminder.is_completed}
        />
      </div>

      {/* Details card */}
      <div className="mt-5 rounded-2xl bg-white shadow-sm dark:bg-card">
        {/* Due date */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {t("dueAtLabel")}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {dueDate.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <Clock className="ml-1 h-4 w-4 text-muted-foreground" />
            {dueDate.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Creator & Assignee */}
        {(creatorName || assigneeName) && (
          <div className="grid grid-cols-2 gap-4 border-t px-5 py-4">
            {creatorName && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {t("createdBy")}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {creatorName}
                </p>
              </div>
            )}
            {assigneeName && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {t("assignedToLabel")}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {assigneeName}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Completed by */}
        {reminder.is_completed && completedByName && (
          <div className="border-t px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {t("completedBy")}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {completedByName}
              {reminder.completed_at && (
                <span className="text-xs font-normal text-muted-foreground">
                  {new Date(reminder.completed_at).toLocaleString()}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

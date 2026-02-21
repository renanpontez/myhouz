"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { createReminder, updateReminder } from "@/actions/reminders";
import { toast } from "sonner";

interface ReminderFormProps {
  mode: "create" | "edit";
  reminderId?: string;
  defaultValues?: {
    title: string;
    due_at: string;
    assigned_to?: string | null;
  };
}

function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function toISODatetime(local: string): string {
  return new Date(local).toISOString();
}

export function ReminderForm({
  mode,
  reminderId,
  defaultValues,
}: ReminderFormProps) {
  const t = useTranslations("reminders");
  const { household, members } = useHousehold();
  const [isPending, startTransition] = useTransition();

  const [assignedTo, setAssignedTo] = useState(
    defaultValues?.assigned_to ?? "",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Convert local datetime to ISO for Zod validation
    const localDueAt = formData.get("due_at_local") as string;
    if (localDueAt) {
      formData.set("due_at", toISODatetime(localDueAt));
    }
    formData.delete("due_at_local");

    if (assignedTo) {
      formData.set("assigned_to", assignedTo);
    }

    startTransition(async () => {
      if (mode === "create") {
        const result = await createReminder(household.id, formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else if (reminderId) {
        const result = await updateReminder(household.id, reminderId, formData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(t("saveButton"));
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          {t("titleLabel")} <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          placeholder={t("titlePlaceholder")}
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      {/* Due date */}
      <div className="space-y-1.5">
        <label htmlFor="due_at_local" className="text-sm font-medium">
          {t("dueAtLabel")} <span className="text-destructive">*</span>
        </label>
        <Input
          id="due_at_local"
          name="due_at_local"
          type="datetime-local"
          defaultValue={
            defaultValues?.due_at ? toLocalDatetime(defaultValues.due_at) : ""
          }
          required
        />
      </div>

      {/* Assigned to */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("assignedToLabel")}</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("unassigned")}</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name ?? member.email}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? t("createButton") : t("saveButton")}
      </Button>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { deleteReminder } from "@/actions/reminders";
import { toast } from "sonner";
import { DetailActions } from "@/components/shared/DetailActions";

interface ReminderDetailActionsProps {
  householdId: string;
  reminderId: string;
}

export function ReminderDetailActions({
  householdId,
  reminderId,
}: ReminderDetailActionsProps) {
  const t = useTranslations("reminders");
  const tCommon = useTranslations("common");
  const [, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteReminder(householdId, reminderId);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <DetailActions
      items={[
        {
          label: tCommon("edit"),
          icon: <Pencil className="h-4 w-4" />,
          href: `/app/reminders/${reminderId}/edit`,
        },
        {
          label: t("deleteButton"),
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleDelete,
          destructive: true,
        },
      ]}
    />
  );
}

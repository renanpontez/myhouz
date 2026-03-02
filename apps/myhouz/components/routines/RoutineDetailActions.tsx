"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTask } from "@/actions/routines";
import { toast } from "sonner";
import { DetailActions } from "@/components/shared/DetailActions";

interface RoutineDetailActionsProps {
  householdId: string;
  taskId: string;
}

export function RoutineDetailActions({
  householdId,
  taskId,
}: RoutineDetailActionsProps) {
  const t = useTranslations("routines");
  const tCommon = useTranslations("common");
  const [, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteTask(householdId, taskId);
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
          href: `/app/routines/${taskId}/edit`,
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

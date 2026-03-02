"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { deleteUrgentProblem } from "@/actions/urgent";
import { toast } from "sonner";
import { DetailActions } from "@/components/shared/DetailActions";

interface UrgentDetailActionsProps {
  householdId: string;
  problemId: string;
}

export function UrgentDetailActions({
  householdId,
  problemId,
}: UrgentDetailActionsProps) {
  const t = useTranslations("urgent");
  const tCommon = useTranslations("common");
  const [, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteUrgentProblem(householdId, problemId);
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
          href: `/app/urgent/${problemId}/edit`,
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

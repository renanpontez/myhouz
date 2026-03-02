"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { deleteItem } from "@/actions/items";
import { toast } from "sonner";
import { DetailActions } from "@/components/shared/DetailActions";

interface ItemDetailActionsProps {
  householdId: string;
  itemId: string;
}

export function ItemDetailActions({
  householdId,
  itemId,
}: ItemDetailActionsProps) {
  const t = useTranslations("items");
  const tCommon = useTranslations("common");
  const [, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteItem(householdId, itemId);
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
          href: `/app/items/${itemId}/edit`,
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

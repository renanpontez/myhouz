"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { Loader2, Trash2 } from "lucide-react";
import { deleteTask } from "@/actions/routines";
import { toast } from "sonner";

interface DeleteTaskButtonProps {
  householdId: string;
  taskId: string;
}

export function DeleteTaskButton({
  householdId,
  taskId,
}: DeleteTaskButtonProps) {
  const t = useTranslations("routines");
  const [isPending, startTransition] = useTransition();

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
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-destructive hover:text-destructive"
    >
      {isPending ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
      )}
      {t("deleteButton")}
    </Button>
  );
}

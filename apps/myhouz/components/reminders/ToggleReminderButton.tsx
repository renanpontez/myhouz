"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { Loader2, Check, RotateCcw } from "lucide-react";
import { toggleReminderComplete } from "@/actions/reminders";
import { toast } from "sonner";

interface ToggleReminderButtonProps {
  householdId: string;
  reminderId: string;
  isCompleted: boolean;
}

export function ToggleReminderButton({
  householdId,
  reminderId,
  isCompleted,
}: ToggleReminderButtonProps) {
  const t = useTranslations("reminders");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleReminderComplete(householdId, reminderId);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      variant={isCompleted ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : isCompleted ? (
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <Check className="mr-1.5 h-3.5 w-3.5" />
      )}
      {isCompleted ? t("markIncomplete") : t("markComplete")}
    </Button>
  );
}

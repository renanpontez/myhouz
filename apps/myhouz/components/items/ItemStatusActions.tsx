"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { Loader2, Circle, Clock, Check } from "lucide-react";
import { changeItemStatus } from "@/actions/items";
import { toast } from "sonner";

interface ItemStatusActionsProps {
  householdId: string;
  itemId: string;
  currentStatus: string;
}

const STATUS_CONFIG = [
  { value: "pending", icon: Circle },
  { value: "in_progress", icon: Clock },
  { value: "done", icon: Check },
] as const;

export function ItemStatusActions({
  householdId,
  itemId,
  currentStatus,
}: ItemStatusActionsProps) {
  const t = useTranslations("items");
  const tEnums = useTranslations("enums");
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: string) {
    if (status === currentStatus) return;
    startTransition(async () => {
      const result = await changeItemStatus(householdId, itemId, status);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{t("statusLabel")}</label>
      <div className="flex flex-wrap gap-2">
        {STATUS_CONFIG.map(({ value, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={currentStatus === value ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => handleStatusChange(value)}
          >
            {isPending && currentStatus !== value ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Icon className="mr-1.5 h-3.5 w-3.5" />
            )}
            {tEnums(`status.${value}`)}
          </Button>
        ))}
      </div>
    </div>
  );
}

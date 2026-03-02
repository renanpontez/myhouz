"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@home/ui";
import { Circle, Clock, Check } from "lucide-react";
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
  const tEnums = useTranslations("enums");
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(currentStatus);

  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  function handleStatusChange(status: string) {
    if (status === localStatus) return;
    setLocalStatus(status);
    startTransition(async () => {
      const result = await changeItemStatus(householdId, itemId, status);
      if (result.error) {
        toast.error(result.error);
        setLocalStatus(currentStatus);
      }
    });
  }

  return (
    <div className="flex rounded-xl bg-muted/50 p-1">
      {STATUS_CONFIG.map(({ value, icon: StatusIcon }) => {
        const isActive = localStatus === value;
        return (
          <button
            key={value}
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange(value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              isPending && "pointer-events-none",
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {tEnums(`status.${value}`)}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { cn } from "@home/ui";
import {
  ShoppingCart,
  Wrench,
  Settings2,
  Check,
  ChevronRight,
} from "lucide-react";
import { markItemDone, changeItemStatus } from "@/actions/items";
import { toast } from "sonner";

const TYPE_ICONS = {
  buy: ShoppingCart,
  repair: Wrench,
  fix: Settings2,
} as const;

const PRIORITY_STYLES = {
  high: "text-destructive",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-muted-foreground",
} as const;

interface ItemRowProps {
  item: {
    id: string;
    name: string;
    type: "buy" | "repair" | "fix";
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "done";
    assigned_to: string | null;
    price: number | null;
    photos: string[] | null;
    tags: string[] | null;
    link: string | null;
  };
}

export function ItemRow({ item }: ItemRowProps) {
  const t = useTranslations("items");
  const tEnums = useTranslations("enums");
  const { members, household } = useHousehold();
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useOptimistic(
    item.status === "done",
  );

  const Icon = TYPE_ICONS[item.type];
  const assignee = item.assigned_to
    ? members.find((m) => m.id === item.assigned_to)
    : null;

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const newDone = !optimisticDone;
      setOptimisticDone(newDone);
      const result = newDone
        ? await markItemDone(household.id, item.id)
        : await changeItemStatus(household.id, item.id, "pending");
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm transition-opacity dark:bg-card",
        isPending && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          optimisticDone
            ? "border-primary bg-primary"
            : "border-muted-foreground/30 bg-background",
        )}
        aria-label={optimisticDone ? t("markPending") : t("markDone")}
      >
        {optimisticDone && (
          <Check className="h-4 w-4 text-primary-foreground" />
        )}
      </button>

      <Link
        href={`/app/items/${item.id}`}
        className="flex flex-1 items-center gap-4 min-w-0"
      >
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background",
            PRIORITY_STYLES[item.priority],
          )}
        >
          {optimisticDone ? (
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-base font-medium",
              optimisticDone && "text-muted-foreground line-through",
            )}
          >
            {item.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {tEnums(`itemType.${item.type}`)}
            {item.price != null && `  ·  R$ ${item.price.toFixed(2)}`}
            {assignee && `  ·  ${assignee.name ?? assignee.email}`}
          </p>
        </div>
        <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground/40" />
      </Link>
    </div>
  );
}

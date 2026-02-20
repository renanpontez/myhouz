"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Badge } from "@home/ui";
import {
  ShoppingCart,
  Wrench,
  Settings2,
  User,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { markItemDone, changeItemStatus } from "@/actions/items";
import { toast } from "sonner";

const TYPE_ICONS = {
  buy: ShoppingCart,
  repair: Wrench,
  fix: Settings2,
} as const;

const PRIORITY_STYLES = {
  high: "border-destructive/30 bg-destructive/5",
  medium: "",
  low: "opacity-80",
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
  const photoCount = item.photos?.length ?? 0;

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
      className={`flex items-center gap-3 rounded-lg border p-3 transition-opacity ${
        isPending ? "opacity-70" : ""
      } ${PRIORITY_STYLES[item.priority]}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="shrink-0"
        aria-label={optimisticDone ? "Mark as pending" : "Mark as done"}
      >
        <input
          type="checkbox"
          checked={optimisticDone}
          readOnly
          className="h-4 w-4 rounded border-input accent-primary pointer-events-none"
          tabIndex={-1}
        />
      </button>

      <Link href={`/app/items/${item.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span
            className={
              optimisticDone
                ? "text-sm text-muted-foreground line-through"
                : "text-sm font-medium"
            }
          >
            {item.name}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="shrink-0 border-none text-[10px]"
          >
            {tEnums(`itemType.${item.type}`)}
          </Badge>

          <Badge
            variant="outline"
            className="shrink-0 border-none text-[10px]"
          >
            {tEnums(`priority.${item.priority}`)}
          </Badge>

          {item.price != null && (
            <span className="text-xs font-medium text-muted-foreground">
              R$ {item.price.toFixed(2)}
            </span>
          )}

          {assignee && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {assignee.name ?? assignee.email}
            </span>
          )}

          {photoCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              {t("photoCount", { count: photoCount })}
            </span>
          )}

          {item.link && (
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          )}

          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent px-2 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}

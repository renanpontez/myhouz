"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@home/ui";
import { cn } from "@home/ui";
import {
  ShoppingCart,
  Wrench,
  Settings2,
  ExternalLink,
  Circle,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import { changeItemStatus } from "@/actions/items";
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

const STATUS_CONFIG = [
  { value: "pending", icon: Circle },
  { value: "in_progress", icon: Clock },
  { value: "done", icon: Check },
] as const;

interface PreviewItem {
  id: string;
  name: string;
  type: "buy" | "repair" | "fix";
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "done";
  price: number | null;
  notes: string | null;
  link: string | null;
  assigned_to: string | null;
}

interface ItemPreviewModalProps {
  item: PreviewItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemPreviewModal({
  item,
  open,
  onOpenChange,
}: ItemPreviewModalProps) {
  const t = useTranslations("items");
  const tEnums = useTranslations("enums");
  const tWidget = useTranslations("dashboard.itemsWidget");
  const { household, members } = useHousehold();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    item?.status ?? "pending",
  );

  if (!item) return null;

  const Icon = TYPE_ICONS[item.type];

  const assignee = item.assigned_to
    ? members.find((m) => m.id === item.assigned_to)
    : null;

  function handleStatusChange(newStatus: string) {
    if (newStatus === optimisticStatus || !item) return;
    startTransition(async () => {
      setOptimisticStatus(newStatus as "pending" | "in_progress" | "done");
      const result = await changeItemStatus(household.id, item.id, newStatus);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background",
                PRIORITY_STYLES[item.priority],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">{item.name}</DialogTitle>
              <DialogDescription>
                {tEnums(`itemType.${item.type}`)}
                {item.price != null &&
                  `  ·  R$ ${Number(item.price).toFixed(2)}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{tEnums(`itemType.${item.type}`)}</Badge>
          <Badge variant="outline">
            {tEnums(`priority.${item.priority}`)}
          </Badge>
          <Badge variant={optimisticStatus === "done" ? "default" : "outline"}>
            {tEnums(`status.${optimisticStatus}`)}
          </Badge>
          {assignee && (
            <Badge variant="secondary">
              {assignee.name ?? assignee.email}
            </Badge>
          )}
        </div>

        {/* Status change buttons */}
        <div className="flex flex-wrap gap-2">
          {STATUS_CONFIG.map(({ value, icon: StatusIcon }) => (
            <Button
              key={value}
              type="button"
              variant={optimisticStatus === value ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => handleStatusChange(value)}
            >
              {isPending && optimisticStatus !== value ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
              )}
              {tEnums(`status.${value}`)}
            </Button>
          ))}
        </div>

        {item.price != null && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("priceLabel")}
            </p>
            <p className="text-lg font-semibold">
              R$ {Number(item.price).toFixed(2)}
            </p>
          </div>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("openLink")}
          </a>
        )}

        {item.notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("notesLabel")}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{item.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/app/items/${item.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              {tWidget("viewDetails")}
            </Button>
          </Link>
          <Link href={`/app/items/${item.id}/edit`} className="flex-1">
            <Button className="w-full">{t("editTitle")}</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

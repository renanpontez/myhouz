"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import {
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
  User,
} from "lucide-react";
import { changeItemStatus } from "@/actions/items";
import { toast } from "sonner";

const TYPE_ICONS = {
  buy: ShoppingCart,
  repair: Wrench,
  fix: Settings2,
} as const;

const PRIORITY_BG = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-muted text-muted-foreground",
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
      <DialogContent className="gap-0 p-0">
        {/* Header with priority-tinted icon */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                PRIORITY_BG[item.priority],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg">{item.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5">
                {tEnums(`itemType.${item.type}`)}
                <span className="text-muted-foreground/40">·</span>
                {tEnums(`priority.${item.priority}`)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Status segmented control */}
        <div className="px-6 pb-4">
          <div className="flex rounded-xl bg-muted/50 p-1">
            {STATUS_CONFIG.map(({ value, icon: StatusIcon }) => {
              const isActive = optimisticStatus === value;
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
                  <span className="hidden sm:inline">
                    {tEnums(`status.${value}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metadata grid */}
        {(assignee || item.price != null) && (
          <div className="grid grid-cols-2 gap-4 border-t px-6 py-4">
            {assignee && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {t("assignedToLabel")}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {assignee.name ?? assignee.email}
                </p>
              </div>
            )}
            {item.price != null && (
              <div className={assignee ? "text-right" : ""}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {t("priceLabel")}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  R$ {Number(item.price).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Link */}
        {item.link && (
          <div className="border-t px-6 py-3">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("openLink")}
            </a>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="border-t px-6 py-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {t("notesLabel")}
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
              {item.notes}
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 border-t px-6 py-4">
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

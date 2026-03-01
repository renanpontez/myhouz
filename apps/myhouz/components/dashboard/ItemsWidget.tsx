"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@home/ui";
import {
  ShoppingCart,
  Wrench,
  Settings2,
  Check,
  Plus,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import { ItemPreviewModal } from "@/components/items/ItemPreviewModal";

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

type ItemType = "buy" | "repair" | "fix";

interface Item {
  id: string;
  name: string;
  type: ItemType;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "done";
  price: number | null;
  notes: string | null;
  link: string | null;
  assigned_to: string | null;
}

interface ItemsWidgetProps {
  items: Item[];
}

const TYPE_FILTERS: (ItemType | "all")[] = ["all", "buy", "repair", "fix"];

export function ItemsWidget({ items }: ItemsWidgetProps) {
  const t = useTranslations("dashboard.itemsWidget");
  const tEnums = useTranslations("enums");

  const [activeFilter, setActiveFilter] = useState<ItemType | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const pendingItems = items.filter((i) => i.status !== "done");
  const filteredItems =
    activeFilter === "all"
      ? pendingItems
      : pendingItems.filter((i) => i.type === activeFilter);
  const displayItems = filteredItems.slice(0, 5);

  const activeFilterLabel =
    activeFilter === "all"
      ? `${t("all")} ${t("title").toLowerCase()}`
      : tEnums(`itemType.${activeFilter}`);

  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl font-bold">{t("title")}</h2>

      {/* Filter subtitle */}
      {pendingItems.length > 0 && (
        <div className="relative mt-1 mb-6">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>{activeFilterLabel}</span>
          </button>

          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 z-20 mt-1.5 rounded-xl border bg-card p-1 shadow-md">
                {TYPE_FILTERS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveFilter(type);
                      setFilterOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-6 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                      activeFilter === type && "font-medium",
                    )}
                  >
                    <span>
                      {type === "all"
                        ? `${t("all")} ${t("title").toLowerCase()}`
                        : tEnums(`itemType.${type}`)}
                    </span>
                    {activeFilter === type && (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {pendingItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Link
            href="/app/items/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            {t("emptyAction")}
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm dark:bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {displayItems.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              const isDone = item.status === "done";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      PRIORITY_STYLES[item.priority],
                      isDone ? "bg-muted" : "bg-background",
                    )}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {tEnums(`itemType.${item.type}`)}
                      {item.price != null &&
                        `  ·  R$ ${item.price.toFixed(2)}`}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View all — bottom */}
      {pendingItems.length > 0 && (
        <div className="mt-4 text-right">
          <Link
            href="/app/items"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
          </Link>
        </div>
      )}

      {/* Item detail modal */}
      <ItemPreviewModal
        item={selectedItem}
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      />
    </div>
  );
}

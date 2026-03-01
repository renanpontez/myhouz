"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Popover, PopoverTrigger, PopoverContent } from "@home/ui";
import { cn } from "@home/ui";
import {
  ShoppingCart,
  Wrench,
  Settings2,
  Check,
  Plus,
  ChevronRight,
  SlidersHorizontal,
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

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

type ItemType = "buy" | "repair" | "fix";
type SortKey = "priority" | "newest" | "price";
type FilterKey = ItemType | "all";

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

const TYPE_FILTERS: FilterKey[] = ["all", "buy", "repair", "fix"];
const SORT_OPTIONS: SortKey[] = ["priority", "newest", "price"];

export function ItemsWidget({ items }: ItemsWidgetProps) {
  const t = useTranslations("dashboard.itemsWidget");
  const tEnums = useTranslations("enums");

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [activeSort, setActiveSort] = useState<SortKey>("priority");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const pendingItems = items.filter((i) => i.status !== "done");

  const filteredItems =
    activeFilter === "all"
      ? pendingItems
      : pendingItems.filter((i) => i.type === activeFilter);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (activeSort === "priority") {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    if (activeSort === "price") {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    return 0; // newest — items arrive pre-sorted by created_at desc
  });

  const displayItems = sortedItems.slice(0, 5);

  const hasActiveFilters = activeFilter !== "all" || activeSort !== "priority";

  return (
    <div>
      {/* Title + filter icon */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        {pendingItems.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-accent",
                  hasActiveFilters
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-1">
              {/* Sort section */}
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {t("sortBy")}
              </p>
              {SORT_OPTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSort(key)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    activeSort === key && "font-medium",
                  )}
                >
                  <span>{t(`sort${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
                  {activeSort === key && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}

              <div className="mx-2 my-1 h-px bg-border" />

              {/* Filter section */}
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {t("filterBy")}
              </p>
              {TYPE_FILTERS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    activeFilter === type && "font-medium",
                  )}
                >
                  <span>
                    {type === "all"
                      ? t("all")
                      : tEnums(`itemType.${type}`)}
                  </span>
                  {activeFilter === type && (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  )}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Spacer */}
      <div className="mb-6" />

      {pendingItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
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

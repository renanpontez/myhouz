"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ItemRow } from "@/components/items/ItemRow";
import { ItemPreviewModal } from "@/components/items/ItemPreviewModal";

interface Item {
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
  notes: string | null;
  created_at: string;
}

interface ItemsListProps {
  items: Item[];
}

export function ItemsList({ items }: ItemsListProps) {
  const t = useTranslations("items");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const pendingItems = items.filter((i) => i.status !== "done");
  const doneItems = items.filter((i) => i.status === "done");

  return (
    <div className="mt-6 space-y-6">
      {pendingItems.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm dark:bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {pendingItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onPreview={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </div>
      )}

      {doneItems.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            {t("doneSection")}
          </h3>
          <div className="rounded-2xl bg-white shadow-sm dark:bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {doneItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onPreview={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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

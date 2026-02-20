import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, Badge } from "@home/ui";
import { ShoppingCart, Wrench, Settings2, Check, Plus } from "lucide-react";

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

interface Item {
  id: string;
  name: string;
  type: "buy" | "repair" | "fix";
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "done";
  price: number | null;
}

interface ItemsWidgetProps {
  items: Item[];
}

export async function ItemsWidget({ items }: ItemsWidgetProps) {
  const t = await getTranslations("dashboard.itemsWidget");
  const tEnums = await getTranslations("enums");

  const pendingItems = items.filter((i) => i.status !== "done");
  const displayItems = pendingItems.slice(0, 5);

  return (
    <Card className="h-full">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <Link
            href="/app/items"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("viewAll")}
          </Link>
        </div>

        {pendingItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Link
              href="/app/items/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("emptyAction")}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              const isDone = item.status === "done";

              return (
                <Link
                  key={item.id}
                  href={`/app/items/${item.id}`}
                  className="flex items-center gap-3 rounded-lg border p-2.5 transition-colors hover:bg-accent"
                >
                  <div className={`shrink-0 ${PRIORITY_STYLES[item.priority]}`}>
                    {isDone ? (
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="flex-1 truncate text-sm font-medium">
                    {item.name}
                  </span>
                  {item.price != null && (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      R$ {item.price.toFixed(2)}
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className="shrink-0 border-none text-[10px]"
                  >
                    {tEnums(`itemType.${item.type}`)}
                  </Badge>
                </Link>
              );
            })}

            {pendingItems.length > 5 && (
              <Link
                href="/app/items"
                className="block pt-1 text-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {t("pendingCount", { count: pendingItems.length })}
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

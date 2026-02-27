import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ItemRow } from "@/components/items/ItemRow";

export default async function ItemsPage() {
  const t = await getTranslations("items");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: items } = await supabase
    .from("household_item")
    .select(
      "id, name, type, priority, status, assigned_to, price, photos, link, tags, created_at",
    )
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  const allItems = items ?? [];
  const pendingItems = allItems.filter((i) => i.status !== "done");
  const doneItems = allItems.filter((i) => i.status === "done");

  return (
    <div className="p-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Link
            href="/app/items/new"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("addButton")}
          </Link>
        }
      />

      {allItems.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={t("title")}
            description={t("empty")}
            actionLabel={t("addButton")}
            actionHref="/app/items/new"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {pendingItems.length > 0 && (
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {doneItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("doneSection")}
              </h3>
              <div className="space-y-3">
                {doneItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

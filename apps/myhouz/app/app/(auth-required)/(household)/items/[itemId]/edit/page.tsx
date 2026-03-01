import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { ItemForm } from "@/components/items/ItemForm";

interface EditItemPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { itemId } = await params;
  const t = await getTranslations("items");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  await getUserWithRole(householdId);

  const supabase = createServerClient();
  const { data: item } = await supabase
    .from("household_item")
    .select(
      "id, name, type, priority, assigned_to, notes, price, photos, link, tags, household_id",
    )
    .eq("id", itemId)
    .eq("household_id", householdId)
    .single();

  if (!item) notFound();

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href={`/app/items/${itemId}`} />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("editTitle")}</h1>
      </div>
      <div className="mt-6 max-w-md">
        <ItemForm
          mode="edit"
          itemId={itemId}
          defaultValues={{
            name: item.name,
            type: item.type,
            priority: item.priority,
            assigned_to: item.assigned_to,
            notes: item.notes,
            price: item.price ? Number(item.price) : null,
            photos: item.photos,
            link: item.link,
            tags: item.tags,
          }}
        />
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";

interface ItemDetailPageProps {
  params: Promise<{ itemId: string }>;
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { itemId } = await params;
  const t = await getTranslations("items");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Item ID: {itemId}</p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("detailPlaceholder")}
      </div>
    </div>
  );
}

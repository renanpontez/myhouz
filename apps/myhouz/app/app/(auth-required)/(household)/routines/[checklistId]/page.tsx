import { getTranslations } from "next-intl/server";

interface ChecklistDetailPageProps {
  params: Promise<{ checklistId: string }>;
}

export default async function ChecklistDetailPage({
  params,
}: ChecklistDetailPageProps) {
  const { checklistId } = await params;
  const t = await getTranslations("routines");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Checklist ID: {checklistId}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("detailPlaceholder")}
      </div>
    </div>
  );
}

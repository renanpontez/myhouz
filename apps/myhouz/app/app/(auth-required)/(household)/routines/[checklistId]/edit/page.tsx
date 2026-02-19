"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditChecklistPage() {
  const params = useParams<{ checklistId: string }>();
  const t = useTranslations("routines");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("editTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Checklist ID: {params.checklistId}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("editPlaceholder")}
      </div>
    </div>
  );
}

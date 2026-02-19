"use client";

import { useTranslations } from "next-intl";

export default function ReportProblemPage() {
  const t = useTranslations("urgent");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("newTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("newSubtitle")}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("formPlaceholder")}
      </div>
    </div>
  );
}

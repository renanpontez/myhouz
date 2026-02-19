import { getTranslations } from "next-intl/server";
import { LanguageSelector } from "@/components/settings/LanguageSelector";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("subtitle")}
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("profileSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("profilePlaceholder")}
          </p>
        </div>
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("languageSection")}</h2>
          <div className="mt-3">
            <LanguageSelector />
          </div>
        </div>
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("appearanceSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("appearancePlaceholder")}
          </p>
        </div>
      </div>
    </div>
  );
}

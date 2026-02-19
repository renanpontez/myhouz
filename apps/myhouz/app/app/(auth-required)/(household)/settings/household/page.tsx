import { getTranslations } from "next-intl/server";

export default async function HouseholdSettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("householdTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("householdSubtitle")}
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("householdInfoSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("householdInfoPlaceholder")}
          </p>
        </div>
        <div className="rounded-2xl border border-destructive p-6">
          <h2 className="text-lg font-semibold text-destructive">
            {t("dangerZone")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dangerZonePlaceholder")}
          </p>
        </div>
      </div>
    </div>
  );
}

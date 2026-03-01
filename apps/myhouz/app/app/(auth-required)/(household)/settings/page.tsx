import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronRight, Home } from "lucide-react";
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
        <Link
          href="/app/settings/household"
          className="flex items-center gap-4 rounded-2xl border p-6 transition-colors hover:bg-accent/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Home className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">{t("householdSettingsLink")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("householdSettingsLinkDescription")}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/30" />
        </Link>
      </div>
    </div>
  );
}

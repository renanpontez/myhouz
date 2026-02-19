"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export function LanguageSelector() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(newLocale: string) {
    if (newLocale === locale) return;

    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t("languageDescription")}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleChange("pt-BR")}
          disabled={isPending}
          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            locale === "pt-BR"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-accent"
          }`}
        >
          {t("languagePortuguese")}
        </button>
        <button
          type="button"
          onClick={() => handleChange("en-US")}
          disabled={isPending}
          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            locale === "en-US"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-accent"
          }`}
        >
          {t("languageEnglish")}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const locales = {
  "pt-BR": { flag: "🇧🇷", label: "PT" },
  "en-US": { flag: "🇺🇸", label: "EN" },
} as const;

type Locale = keyof typeof locales;

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const alternate: Locale = locale === "pt-BR" ? "en-US" : "pt-BR";
  const { flag, label } = locales[alternate];

  function handleSwitch() {
    startTransition(() => {
      document.cookie = `locale=${alternate};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={`Switch to ${alternate}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/60 dark:bg-card/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-card/80 transition-colors disabled:opacity-50"
    >
      <span aria-hidden="true">{flag}</span>
      {label}
    </button>
  );
}

"use client";

import { useTranslations } from "next-intl";

export default function ItemsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold">{t("failedToLoadItems")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        {tCommon("tryAgain")}
      </button>
    </div>
  );
}

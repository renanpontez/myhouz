"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const FILTERS = ["active", "resolved"] as const;

export function UrgentFilterTabs() {
  const t = useTranslations("urgent");
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("filter") ?? "active";

  const labels: Record<string, string> = {
    active: t("filterActive"),
    resolved: t("filterResolved"),
  };

  function handleFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-full bg-muted p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => handleFilter(filter)}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            current === filter
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          {labels[filter]}
        </button>
      ))}
    </div>
  );
}

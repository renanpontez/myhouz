"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const FILTERS = ["upcoming", "completed", "all"] as const;

export function ReminderFilterTabs() {
  const t = useTranslations("reminders");
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("filter") ?? "upcoming";

  const labels: Record<string, string> = {
    upcoming: t("filterUpcoming"),
    completed: t("filterCompleted"),
    all: t("filterAll"),
  };

  function handleFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-lg border p-1">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => handleFilter(filter)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
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

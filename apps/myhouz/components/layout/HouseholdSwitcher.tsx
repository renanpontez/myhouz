"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useHousehold, useUserHouseholds } from "@home/auth/hooks";
import { Button } from "@home/ui";
import { ChevronDown, Check, Plus } from "lucide-react";
import { switchHousehold } from "@/actions/household";

export function HouseholdSwitcher() {
  const t = useTranslations("common");
  const { household } = useHousehold();
  const households = useUserHouseholds();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSwitch(id: string) {
    if (id === household.id) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      await switchHousehold(id);
    });
  }

  // If only one household, no dropdown needed
  if (households.length <= 1) {
    return (
      <div className="rounded-lg border px-3 py-1.5 text-sm font-medium">
        {household.name}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="gap-1.5"
      >
        {household.name}
        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-1 w-56 rounded-lg border bg-popover p-1 shadow-md">
            {households.map((h) => (
              <button
                key={h.id}
                onClick={() => handleSwitch(h.id)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <span>{h.name}</span>
                {h.id === household.id && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </button>
            ))}
            <div className="my-1 border-t" />
            <Link
              href="/app/onboarding/create"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("createNewHousehold")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useHousehold } from "@home/auth/hooks";

export function HouseholdSwitcher() {
  const { household } = useHousehold();

  return (
    <div className="rounded-md border px-3 py-1.5 text-sm font-medium">
      {household.name}
    </div>
  );
}

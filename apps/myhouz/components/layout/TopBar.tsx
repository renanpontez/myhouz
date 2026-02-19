"use client";

import { HouseholdSwitcher } from "./HouseholdSwitcher";
import { UserMenu } from "./UserMenu";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold lg:hidden">MyHouz</span>
        <HouseholdSwitcher />
      </div>
      <UserMenu />
    </header>
  );
}

"use client";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
      <span className="text-lg font-semibold">MyHouz</span>
      <div className="flex items-center gap-2">
        {/* HouseholdSwitcher + UserMenu will go here */}
      </div>
    </header>
  );
}

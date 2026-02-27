"use client";

import Link from "next/link";
import { Menu, AlertTriangle } from "lucide-react";
import { HouseholdSwitcher } from "./HouseholdSwitcher";
import { UserMenu } from "./UserMenu";

interface TopBarProps {
  urgentCount: number;
}

export function TopBar({ urgentCount }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src="/myhouz-logo.svg" alt="myhouz" className="hidden h-6 w-auto lg:block" />
        <HouseholdSwitcher />
      </div>
      <div className="flex items-center gap-2">
        {urgentCount > 0 && (
          <Link
            href="/app/urgent"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 transition-colors hover:bg-destructive/15"
          >
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {urgentCount}
            </span>
          </Link>
        )}
        <UserMenu />
      </div>
    </header>
  );
}

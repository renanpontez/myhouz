"use client";

import { useUser } from "@home/auth";

export function UserMenu() {
  const user = useUser();

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
        {user.name ? user.name[0]?.toUpperCase() : "?"}
      </div>
    </div>
  );
}

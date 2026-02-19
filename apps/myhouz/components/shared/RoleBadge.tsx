"use client";

import { Badge } from "@home/ui";
import { cn } from "@home/ui";
import { useTranslations } from "next-intl";

interface RoleBadgeProps {
  role: "owner" | "member" | "guest";
  className?: string;
}

const ROLE_STYLES = {
  owner: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  member: "bg-info/15 text-info dark:bg-info/25",
  guest: "bg-muted text-muted-foreground",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const t = useTranslations("enums");

  return (
    <Badge
      variant="outline"
      className={cn("border-none text-xs", ROLE_STYLES[role], className)}
    >
      {t(`role.${role}`)}
    </Badge>
  );
}

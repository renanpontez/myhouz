"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@home/ui";
import type { LucideIcon } from "lucide-react";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  expanded?: boolean;
  onClick?: () => void;
}

export function SidebarNavLink({
  href,
  label,
  icon: Icon,
  expanded,
  onClick,
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg transition-colors",
        expanded ? "h-10 px-3" : "h-10 w-10 justify-center",
        isActive
          ? "bg-primary/10 text-primary font-medium dark:bg-primary/15 dark:text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      title={expanded ? undefined : label}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && (
        <span className="truncate text-sm">{label}</span>
      )}
    </Link>
  );
}

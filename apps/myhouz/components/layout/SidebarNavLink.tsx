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
        "flex items-center gap-3 rounded-full text-primary-foreground/60 transition-all hover:bg-white/15 hover:text-primary-foreground/90",
        expanded ? "h-11 px-4" : "h-11 w-11 justify-center",
        isActive &&
          "bg-white/25 text-primary-foreground shadow-sm shadow-black/10",
      )}
      title={expanded ? undefined : label}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {expanded && (
        <span className="truncate text-sm font-medium">{label}</span>
      )}
    </Link>
  );
}

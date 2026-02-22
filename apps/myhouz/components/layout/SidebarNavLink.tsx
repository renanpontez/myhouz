"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@home/ui";
import type { LucideIcon } from "lucide-react";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarNavLink({ href, label, icon: Icon }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground/70 transition-colors hover:bg-white/15",
        isActive && "bg-white/20 text-primary-foreground",
      )}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

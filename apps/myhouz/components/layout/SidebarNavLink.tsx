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
        "flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground/60 transition-all hover:bg-white/15 hover:text-primary-foreground/90",
        isActive && "bg-white/25 text-primary-foreground shadow-sm shadow-black/10",
      )}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

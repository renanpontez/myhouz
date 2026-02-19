"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@home/ui";
import {
  LayoutDashboard,
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/app/items", label: "Itens", icon: ShoppingCart },
  { href: "/app/routines", label: "Rotinas", icon: ListChecks },
  { href: "/app/reminders", label: "Lembretes", icon: Bell },
  { href: "/app/urgent", label: "Urgente", icon: AlertTriangle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

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

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/app/dashboard", icon: LayoutDashboard },
    { href: "/app/items", icon: ShoppingCart },
    { href: "/app/routines", icon: ListChecks },
    { href: "/app/reminders", icon: Bell },
    { href: "/app/urgent", icon: AlertTriangle },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-full border border-border/50 bg-card/85 backdrop-blur-xl shadow-lg lg:hidden">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-3",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

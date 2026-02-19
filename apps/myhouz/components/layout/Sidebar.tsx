"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  Users,
  Settings,
} from "lucide-react";
import { SidebarNavLink } from "./SidebarNavLink";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/items", label: "Itens", icon: ShoppingCart },
  { href: "/app/routines", label: "Rotinas", icon: ListChecks },
  { href: "/app/reminders", label: "Lembretes", icon: Bell },
  { href: "/app/urgent", label: "Urgente", icon: AlertTriangle },
  { href: "/app/members", label: "Membros", icon: Users },
  { href: "/app/settings", label: "Config", icon: Settings },
];

export function Sidebar() {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {NAV_ITEMS.map((item) => (
        <SidebarNavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </nav>
  );
}

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
import { useTranslations } from "next-intl";
import { SidebarNavLink } from "./SidebarNavLink";

export function Sidebar() {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/app/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/app/items", label: t("items"), icon: ShoppingCart },
    { href: "/app/routines", label: t("routines"), icon: ListChecks },
    { href: "/app/reminders", label: t("reminders"), icon: Bell },
    { href: "/app/urgent", label: t("urgent"), icon: AlertTriangle },
    { href: "/app/members", label: t("members"), icon: Users },
    { href: "/app/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => (
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

"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  Users,
  Settings,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@home/ui";
import { SidebarNavLink } from "./SidebarNavLink";
import { useSidebar } from "./SidebarContext";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

function useNavGroups(): NavGroup[] {
  const t = useTranslations("nav");
  return [
    {
      // Main group — no section header
      items: [
        { href: "/app/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/app/items", label: t("items"), icon: ShoppingCart },
        { href: "/app/routines", label: t("routines"), icon: ListChecks },
        { href: "/app/reminders", label: t("reminders"), icon: Bell },
        { href: "/app/urgent", label: t("urgent"), icon: AlertTriangle },
      ],
    },
    {
      label: t("sectionHousehold"),
      items: [
        { href: "/app/members", label: t("members"), icon: Users },
      ],
    },
    {
      label: t("sectionSystem"),
      items: [
        { href: "/app/settings", label: t("settings"), icon: Settings },
      ],
    },
  ];
}

function SidebarGroupHeader({
  label,
  expanded,
}: {
  label: string;
  expanded: boolean;
}) {
  if (!expanded) {
    return <div className="mx-auto my-1 h-px w-5 bg-border" />;
  }

  return (
    <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
      {label}
    </p>
  );
}

function SidebarContent({
  expanded,
  onLinkClick,
}: {
  expanded: boolean;
  onLinkClick?: () => void;
}) {
  const navGroups = useNavGroups();

  return (
    <nav
      className={cn(
        "flex flex-1 flex-col gap-0.5 py-2",
        expanded ? "items-stretch px-3" : "items-center px-2",
      )}
    >
      {navGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.label && (
            <SidebarGroupHeader label={group.label} expanded={expanded} />
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <SidebarNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                expanded={expanded}
                onClick={onLinkClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function DesktopSidebar() {
  const { isExpanded, toggleExpanded } = useSidebar();
  const t = useTranslations("nav");

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 border-r border-border bg-card lg:flex lg:flex-col transition-all duration-300",
        isExpanded ? "w-60" : "w-[68px]",
      )}
    >
      {/* Toggle handle — center of right edge */}
      <button
        type="button"
        onClick={toggleExpanded}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label={isExpanded ? t("collapseSidebar") : t("expandSidebar")}
      >
        <ChevronsRight
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Logo */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-border",
          isExpanded ? "px-4" : "justify-center px-2",
        )}
      >
        <img
          src="/myhouz-symbol.svg"
          alt="myhouz"
          className="h-7 w-7"
        />
      </div>

      {/* Navigation */}
      <SidebarContent expanded={isExpanded} />
    </aside>
  );
}

export function MobileSidebar() {
  const { isOpen, close, toggle } = useSidebar();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}
      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <img
            src="/myhouz-logo.svg"
            alt="myhouz"
            className="h-6 w-auto dark:brightness-0 dark:invert"
          />
        </div>

        {/* Navigation */}
        <SidebarContent expanded onLinkClick={close} />
      </aside>
    </>
  );
}

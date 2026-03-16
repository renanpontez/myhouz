import {
  ShoppingCart,
  ListChecks,
  Bell,
  Home,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@home/ui";

/**
 * PhoneMockup — a pure CSS/Tailwind iPhone frame showing mock app screens.
 * Server Component — no images, pure Tailwind.
 */

interface PhoneMockupProps {
  screen?: "dashboard" | "items";
  className?: string;
}

export async function PhoneMockup({ screen = "dashboard", className = "" }: PhoneMockupProps) {
  const t = await getTranslations("landing.mockup");

  return (
    <div
      className={cn("relative w-[260px] sm:w-[280px] flex-shrink-0", className)}
      aria-hidden="true"
      role="presentation"
    >
      {/* Phone shell */}
      <div className="bg-foreground rounded-[2.5rem] p-2 shadow-2xl shadow-black/20">
        {/* Screen */}
        <div className="bg-white dark:bg-card rounded-[2rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="flex justify-center pt-2.5 pb-1">
            <div className="w-[90px] h-[22px] bg-foreground rounded-full" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1.5">
            <span className="text-[10px] font-semibold text-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <StatusSignal />
              <StatusWifi />
              <StatusBattery />
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[380px] sm:min-h-[420px]">
            {screen === "dashboard" ? (
              <DashboardScreen t={t} />
            ) : (
              <ItemsScreen t={t} />
            )}
          </div>

          {/* Bottom tab bar */}
          <div className="border-t border-border/40 px-6 py-2.5 flex items-center justify-around">
            <TabIcon icon={Home} active={screen === "dashboard"} />
            <TabIcon icon={ShoppingCart} active={screen === "items"} />
            <TabIcon icon={ListChecks} active={false} />
            <TabIcon icon={MoreHorizontal} active={false} />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-[100px] h-[4px] bg-foreground/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (key: string) => string;

function DashboardScreen({ t }: { t: T }) {
  return (
    <div className="px-4 py-2 space-y-3">
      {/* Greeting */}
      <div>
        <p className="text-[15px] font-semibold text-foreground">Good morning! ☀️</p>
        <p className="text-[11px] text-muted-foreground">
          {t("householdName")} · {t("memberCount")}
        </p>
      </div>

      {/* Urgent banner */}
      <div className="px-3 py-2 bg-destructive/8 rounded-xl flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse flex-shrink-0" />
        <p className="text-[10px] font-medium text-destructive truncate">
          {t("urgentBanner")}
        </p>
      </div>

      {/* Items section */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          {t("itemsToBuy")}
        </p>
        <div className="space-y-1">
          <MockItem label={t("item1")} type={t("item1Type")} color="bg-destructive" />
          <MockItem label={t("item2")} type={t("item2Type")} color="bg-warning" />
          <MockItem label={t("item3")} type={t("item3Type")} color="bg-success" />
        </div>
      </div>

      {/* Routines section */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          {t("routines")}
        </p>
        <div className="space-y-1.5">
          <div className="bg-secondary/50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-foreground font-medium">{t("routine1")}</span>
              <span className="text-[9px] text-muted-foreground">4/6</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>
          </div>
          <div className="bg-secondary/50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-foreground font-medium">{t("routine2")}</span>
              <span className="text-[9px] text-success font-medium">{t("routineDone")}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full w-full bg-success rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemsScreen({ t }: { t: T }) {
  return (
    <div className="px-4 py-2 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-foreground">{t("itemsToBuy")}</p>
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <span className="text-[11px] font-bold text-primary-foreground">+</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5">
        <FilterChip label="All" active />
        <FilterChip label={t("item1Type")} />
        <FilterChip label={t("item2Type")} />
      </div>

      {/* Items list */}
      <div className="space-y-1.5">
        <ItemCard
          label={t("item1")}
          type={t("item1Type")}
          color="bg-destructive"
          priority="high"
        />
        <ItemCard
          label={t("item2")}
          type={t("item2Type")}
          color="bg-warning"
          priority="medium"
        />
        <ItemCard
          label={t("item3")}
          type={t("item3Type")}
          color="bg-success"
          priority="low"
        />
      </div>

      {/* Urgent section */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
          <AlertTriangle size={10} className="text-destructive" />
          Urgent
        </p>
        <div className="bg-destructive/8 rounded-xl px-3 py-2">
          <p className="text-[10px] font-medium text-destructive">{t("urgentBanner")}</p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function MockItem({ label, type, color }: { label: string; type: string; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
      <div className={`w-1 h-4 rounded-full ${color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-foreground font-medium block truncate">{label}</span>
      </div>
      <span className="text-[8px] text-muted-foreground uppercase tracking-wide flex-shrink-0">{type}</span>
    </div>
  );
}

function ItemCard({ label, type, color, priority }: { label: string; type: string; color: string; priority: string }) {
  const priorityColors = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-warning/10 text-warning",
    low: "bg-success/10 text-success",
  };
  const pColor = priorityColors[priority as keyof typeof priorityColors] || priorityColors.low;

  return (
    <div className="bg-white dark:bg-card border border-border/40 rounded-xl px-3 py-2.5 flex items-center gap-2">
      <div className={`w-1 h-5 rounded-full ${color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-foreground font-medium block truncate">{label}</span>
        <span className="text-[8px] text-muted-foreground">{type}</span>
      </div>
      <span className={`text-[7px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${pColor}`}>
        {priority}
      </span>
    </div>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-2.5 py-1 rounded-full text-[9px] font-medium ${
        active
          ? "bg-foreground text-background"
          : "bg-secondary/60 text-muted-foreground"
      }`}
    >
      {label}
    </div>
  );
}

function TabIcon({ icon: Icon, active }: { icon: React.ElementType; active: boolean }) {
  return (
    <div className={`p-1 ${active ? "text-primary" : "text-muted-foreground/50"}`}>
      <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
    </div>
  );
}

// ── Status bar icons ──

function StatusSignal() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" className="text-foreground" fill="currentColor">
      <rect x="0" y="7" width="2.5" height="3" rx="0.5" />
      <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" />
      <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" />
      <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" />
    </svg>
  );
}

function StatusWifi() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" className="text-foreground" fill="currentColor">
      <path d="M6.5 8.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
      <path d="M3.5 7a4.5 4.5 0 016 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1.5 4.5a7.5 7.5 0 0110 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StatusBattery() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" className="text-foreground">
      <rect x="0" y="0.5" width="19" height="9" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="1.5" y="2" width="14" height="6" rx="1" fill="currentColor" />
      <rect x="20" y="3" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

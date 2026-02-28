import {
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * DesktopMockup — a pure CSS/Tailwind illustration of the myhouz dashboard
 * as it would appear on a desktop/laptop browser. Shows a sidebar + content area.
 * Server Component — no images, pure Tailwind.
 */

export async function DesktopMockup() {
  const t = await getTranslations("landing.mockup");

  return (
    <div
      className="relative w-full max-w-[440px] mx-auto"
      aria-hidden="true"
      role="presentation"
    >
      {/* Browser chrome */}
      <div className="bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/10 border border-white/60 dark:border-white/10 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white/60 dark:bg-card/60 rounded-md px-3 py-1 max-w-[200px] mx-auto">
              <span className="text-[9px] text-muted-foreground">myhouz.app/dashboard</span>
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="flex min-h-[260px]">
          {/* Sidebar */}
          <div className="w-[52px] shrink-0 border-r border-border/30 py-3 flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center mb-1">
              <span className="text-[8px] font-bold text-primary-foreground">M</span>
            </div>
            <SidebarIcon icon={LayoutDashboard} active />
            <SidebarIcon icon={ShoppingCart} />
            <SidebarIcon icon={ListChecks} />
            <SidebarIcon icon={Bell} />
            <SidebarIcon icon={AlertTriangle} />
            <div className="flex-1" />
            <SidebarIcon icon={Users} />
            <SidebarIcon icon={Settings} />
          </div>

          {/* Main content */}
          <div className="flex-1 p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold text-foreground">{t("householdName")}</p>
                <p className="text-[8px] text-muted-foreground">{t("memberCount")}</p>
              </div>
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-white dark:border-card text-[7px] font-bold text-primary flex items-center justify-center">R</div>
                <div className="w-5 h-5 rounded-full bg-success/20 border border-white dark:border-card text-[7px] font-bold text-success flex items-center justify-center">A</div>
                <div className="w-5 h-5 rounded-full bg-brand-accent/20 border border-white dark:border-card text-[7px] font-bold text-brand-accent flex items-center justify-center">M</div>
              </div>
            </div>

            {/* Urgent banner */}
            <div className="px-2 py-1.5 bg-destructive/8 rounded-lg flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse flex-shrink-0" />
              <p className="text-[8px] font-medium text-destructive truncate">
                {t("urgentBanner")}
              </p>
            </div>

            {/* Two-column dashboard */}
            <div className="grid grid-cols-2 gap-2">
              {/* Items column */}
              <div>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  {t("itemsToBuy")}
                </p>
                <div className="space-y-1">
                  <DashItem label={t("item1")} color="bg-destructive" />
                  <DashItem label={t("item2")} color="bg-warning" />
                  <DashItem label={t("item3")} color="bg-success" />
                </div>
              </div>

              {/* Routines column */}
              <div>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  {t("routines")}
                </p>
                <div className="space-y-1.5">
                  <div className="bg-secondary/50 rounded-md px-2 py-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] text-foreground">{t("routine1")}</span>
                      <span className="text-[7px] text-muted-foreground">4/6</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-md px-2 py-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] text-foreground">{t("routine2")}</span>
                      <span className="text-[7px] text-success font-medium">{t("routineDone")}</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full w-full bg-success rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon({ icon: Icon, active }: { icon: React.ElementType; active?: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-md flex items-center justify-center ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground/60 hover:text-muted-foreground"
      }`}
    >
      <Icon size={13} />
    </div>
  );
}

function DashItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
      <div className={`w-0.5 h-3 rounded-full ${color} flex-shrink-0`} />
      <span className="text-[8px] text-foreground truncate">{label}</span>
    </div>
  );
}

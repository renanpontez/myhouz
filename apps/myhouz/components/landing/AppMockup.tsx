import { getTranslations } from "next-intl/server";

/**
 * AppMockup — a pure CSS/Tailwind illustration of the myhouz dashboard.
 * No images, no external assets.
 * Server Component.
 */

export async function AppMockup() {
  const t = await getTranslations("landing.mockup");

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      aria-hidden="true"
      role="presentation"
    >
      {/* Device frame */}
      <div className="relative bg-card rounded-2xl shadow-xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-card">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">M</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">
                {t("householdName")}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                {t("memberCount")}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <div className="w-3 h-0.5 bg-muted-foreground rounded" />
            </div>
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="w-6 h-6 rounded-full bg-primary/20" />
          </div>
        </div>

        {/* Urgent banner */}
        <div className="mx-3 mt-3 px-3 py-2 bg-destructive/10 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse-dot flex-shrink-0" />
          <p className="text-xs font-medium text-destructive flex-1">
            {t("urgentBanner")}
          </p>
        </div>

        {/* Section heading */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("itemsToBuy")}
          </p>
        </div>

        {/* Item cards */}
        <div className="px-3 space-y-2">
          <MockItem
            label={t("item1")}
            type={t("item1Type")}
            typeColor="bg-info/10 text-info"
            priority="high"
            assignee="L"
            assigneeColor="bg-primary/20 text-primary"
          />
          <MockItem
            label={t("item2")}
            type={t("item2Type")}
            typeColor="bg-destructive/10 text-destructive"
            priority="medium"
            assignee="A"
            assigneeColor="bg-brand-accent/20 text-brand-accent"
          />
          <MockItem
            label={t("item3")}
            type={t("item3Type")}
            typeColor="bg-info/10 text-info"
            priority="low"
            assignee="M"
            assigneeColor="bg-success/20 text-success"
          />
        </div>

        {/* Section heading */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("routines")}
          </p>
        </div>

        {/* Routine card */}
        <div className="px-3 pb-3 space-y-2">
          <div className="bg-secondary rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-foreground">
                {t("routine1")}
              </p>
              <span className="text-xs text-muted-foreground">4/6</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>
          </div>

          <div className="bg-secondary rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-foreground">
                {t("routine2")}
              </p>
              <span className="text-xs text-success font-medium">{t("routineDone")}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full w-full bg-success rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent elements for depth */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 bg-primary/8 rounded-full blur-xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl"
        aria-hidden="true"
      />
    </div>
  );
}

interface MockItemProps {
  label: string;
  type: string;
  typeColor: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  assigneeColor: string;
}

function MockItem({
  label,
  type,
  typeColor,
  priority,
  assignee,
  assigneeColor,
}: MockItemProps) {
  const priorityColors: Record<string, string> = {
    high: "bg-destructive",
    medium: "bg-warning",
    low: "bg-success",
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
      <div
        className={`w-1.5 h-8 rounded-full flex-shrink-0 ${priorityColors[priority]}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{label}</p>
        <span
          className={`inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium ${typeColor}`}
        >
          {type}
        </span>
      </div>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${assigneeColor}`}
      >
        {assignee}
      </div>
    </div>
  );
}

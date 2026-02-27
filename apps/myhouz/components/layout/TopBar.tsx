"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, AlertTriangle } from "lucide-react";
import { HouseholdSwitcher } from "./HouseholdSwitcher";
import { useSidebar } from "./SidebarContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

interface UrgentProblem {
  id: string;
  title: string;
  created_at: string;
}

interface TopBarProps {
  urgentCount: number;
  urgentProblems: UrgentProblem[];
}

const DATE_FNS_LOCALES: Record<string, import("date-fns").Locale> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

export function TopBar({ urgentCount, urgentProblems }: TopBarProps) {
  const { toggle } = useSidebar();
  const [urgentOpen, setUrgentOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const dateFnsLocale = DATE_FNS_LOCALES[locale] ?? enUS;

  return (
    <header className="flex h-14 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src="/myhouz-logo.svg" alt="myhouz" className="hidden h-6 w-auto lg:block" />
        <HouseholdSwitcher />
      </div>
      <div className="flex items-center gap-2">
        {urgentCount > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setUrgentOpen(!urgentOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 transition-colors hover:bg-destructive/15"
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {urgentCount}
              </span>
            </button>

            {urgentOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUrgentOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-72 rounded-xl border bg-card p-2 shadow-lg">
                  <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("urgentProblems")}
                  </p>
                  {urgentProblems.slice(0, 3).map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/app/urgent/${problem.id}`}
                      onClick={() => setUrgentOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{problem.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(problem.created_at), {
                            addSuffix: true,
                            locale: dateFnsLocale,
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/app/urgent"
                    onClick={() => setUrgentOpen(false)}
                    className="mt-1 block rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive transition-colors hover:bg-destructive/15"
                  >
                    {t("showAll")} ({urgentCount})
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

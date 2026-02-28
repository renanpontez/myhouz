"use client";

import { useEffect, useRef } from "react";
import {
  ShoppingCart,
  ListChecks,
  Bell,
  AlertTriangle,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * AppMockup — floating feature cards with gentle idle animation.
 * Each card bobs at a slightly different speed/amplitude for organic movement.
 * Client Component for animation.
 */

interface CardConfig {
  className: string;
  speed: number;
  amplitude: number;
  phase: number;
}

const CARDS: CardConfig[] = [
  // Row 1 — Items (top-left, largest)
  { className: "top-0 left-0 w-[185px]", speed: 0.7, amplitude: 4, phase: 0 },
  // Row 1 — Routines (top-right)
  { className: "top-4 right-0 w-[175px]", speed: 0.9, amplitude: 3.5, phase: 1.2 },
  // Row 2 — Reminders (mid-left)
  { className: "top-[195px] left-2 w-[165px]", speed: 0.8, amplitude: 5, phase: 2.4 },
  // Row 2 — Urgent (mid-right)
  { className: "top-[185px] right-1 w-[170px]", speed: 1.0, amplitude: 3, phase: 3.6 },
  // Row 3 — Members (bottom-left)
  { className: "bottom-[30px] left-0 w-[155px]", speed: 0.75, amplitude: 4, phase: 4.8 },
  // Row 3 — Dashboard (bottom-right)
  { className: "bottom-[20px] right-2 w-[155px]", speed: 1.1, amplitude: 3, phase: 0.8 },
];

export function AppMockup() {
  const t = useTranslations("landing.mockup");
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) / 1000;

      for (let i = 0; i < CARDS.length; i++) {
        const card = CARDS[i];
        const el = cardsRef.current[i];
        if (!card || !el) continue;
        const y = Math.sin(elapsed * card.speed + card.phase) * card.amplitude;
        el.style.transform = `translateY(${y}px)`;
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  const cardBase =
    "absolute bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/60 dark:border-white/10 will-change-transform transition-shadow";

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto h-[420px] md:h-[460px]"
      aria-hidden="true"
      role="presentation"
    >
      {/* Card 0: Items to Buy */}
      <div ref={setRef(0)} className={`${cardBase} ${CARDS[0]?.className} p-3.5 z-10`}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-info/10 flex items-center justify-center">
            <ShoppingCart size={14} className="text-info" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-foreground leading-none">
              {t("itemsToBuy")}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              3 {t("item1Type") === "Buy" ? "pending" : "pendentes"}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <MockRow label={t("item1")} color="bg-destructive" />
          <MockRow label={t("item2")} color="bg-warning" />
          <MockRow label={t("item3")} color="bg-success" />
        </div>
      </div>

      {/* Card 1: Routines */}
      <div ref={setRef(1)} className={`${cardBase} ${CARDS[1]?.className} p-3.5 z-20`}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center">
            <ListChecks size={14} className="text-success" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-foreground leading-none">
              {t("routines")}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">4/6</p>
          </div>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
          <div className="h-full w-2/3 bg-success rounded-full" />
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{t("routine1")}</p>
      </div>

      {/* Card 2: Reminders */}
      <div ref={setRef(2)} className={`${cardBase} ${CARDS[2]?.className} p-3.5 z-10`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
            <Bell size={14} className="text-warning" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-foreground leading-none">
              {t("routine2")}
            </p>
            <p className="text-[10px] text-success font-medium mt-0.5">{t("routineDone")}</p>
          </div>
        </div>
      </div>

      {/* Card 3: Urgent */}
      <div
        ref={setRef(3)}
        className={`${cardBase} ${CARDS[3]?.className} p-3.5 z-30 !border-destructive/20`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center relative">
            <AlertTriangle size={14} className="text-destructive" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-foreground leading-none truncate">
              {t("urgentBanner")}
            </p>
            <p className="text-[10px] text-destructive font-medium mt-0.5">Urgent</p>
          </div>
        </div>
      </div>

      {/* Card 4: Members */}
      <div ref={setRef(4)} className={`${cardBase} ${CARDS[4]?.className} p-3 z-10`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users size={12} className="text-primary" />
          </div>
          <p className="text-[10px] font-medium text-foreground">{t("memberCount")}</p>
        </div>
        <div className="flex -space-x-1.5">
          <Avatar letter="R" color="bg-primary/20 text-primary" />
          <Avatar letter="A" color="bg-success/20 text-success" />
          <Avatar letter="M" color="bg-brand-accent/20 text-brand-accent" />
          <Avatar letter="+1" color="bg-muted text-muted-foreground" />
        </div>
      </div>

      {/* Card 5: Dashboard */}
      <div ref={setRef(5)} className={`${cardBase} ${CARDS[5]?.className} p-3 z-10`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-brand-accent/10 flex items-center justify-center">
            <LayoutDashboard size={12} className="text-brand-accent" />
          </div>
          <p className="text-[10px] font-medium text-foreground">{t("householdName")}</p>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-4 rounded bg-primary/15" />
          <div className="h-4 rounded bg-success/15" />
          <div className="h-4 rounded bg-warning/15" />
        </div>
      </div>
    </div>
  );
}

function MockRow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
      <div className={`w-1 h-3.5 rounded-full ${color} flex-shrink-0`} />
      <span className="text-[10px] text-foreground truncate">{label}</span>
    </div>
  );
}

function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 border-white dark:border-card flex items-center justify-center text-[8px] font-bold ${color}`}
    >
      {letter}
    </div>
  );
}

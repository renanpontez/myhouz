"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { Button } from "@home/ui";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/landing/LocaleSwitcher";

const APP_STORE_URL = "https://apps.apple.com/br/app/myhouz/id6760033780";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("landing.nav");

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:bg-muted transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-card/95 backdrop-blur-lg shadow-lg border-b border-border/40 z-40">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href="#features"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-full transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-full transition-colors"
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="#pricing"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-full transition-colors"
            >
              {t("pricing")}
            </Link>
            <Link
              href="#faq"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-full transition-colors"
            >
              {t("faq")}
            </Link>
            <div className="pt-2 border-t border-border/40 mt-1 space-y-3">
              <Button
                asChild
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
                size="default"
              >
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {t("downloadApp")}
                </a>
              </Button>
              <div className="flex justify-center pt-1">
                <LocaleSwitcher />
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { Button } from "@home/ui";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-11 h-11 rounded-lg text-foreground hover:bg-muted transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-md z-40">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href="#features"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <div className="pt-2 border-t border-border mt-1">
              <Button asChild className="w-full" size="default">
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

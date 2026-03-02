"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@home/ui";
import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface DropdownItem {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  destructive?: boolean;
}

interface DetailActionsProps {
  items: DropdownItem[];
}

export function DetailActions({ items }: DetailActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-md">
            {items.map((item, i) =>
              item.href ? (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                    item.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "hover:bg-accent"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@home/auth/hooks";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@home/ui";
import { LogOut, Loader2 } from "lucide-react";

export function UserMenu() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {user.name ? user.name[0]?.toUpperCase() : "?"}
        </div>
        <span className="hidden text-sm font-medium lg:inline">{user.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-48 rounded-md border bg-card py-1 shadow-lg">
            <div className="border-b px-3 py-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-none px-3"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sair
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

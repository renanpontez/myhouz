"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button } from "@home/ui";
import { MoreVertical, UserMinus, Shield } from "lucide-react";
import { removeMember, changeRole } from "@/actions/members";
import { toast } from "sonner";
import type { HouseholdMember } from "@home/types";

interface MemberActionsProps {
  membership: HouseholdMember;
  memberName: string | null;
}

export function MemberActions({ membership, memberName }: MemberActionsProps) {
  const t = useTranslations("members");
  const tError = useTranslations("error");
  const { household } = useHousehold();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    const confirmed = window.confirm(
      t("removeConfirm", { name: memberName ?? "" }),
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await removeMember(household.id, membership.id);
      if (result.error) {
        toast.error(result.error);
      }
      setOpen(false);
    });
  }

  function handleChangeRole() {
    const newRole = membership.role === "member" ? "guest" : "member";
    startTransition(async () => {
      const result = await changeRole(household.id, membership.id, newRole as "member" | "guest");
      if (result.error) {
        toast.error(result.error);
      }
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(!open)}
        disabled={isPending}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-md">
            <button
              onClick={handleRemove}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              <UserMinus className="h-4 w-4" />
              {t("removeMember")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

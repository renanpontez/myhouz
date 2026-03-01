"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@home/ui";
import { Loader2, LogOut } from "lucide-react";
import { leaveHousehold } from "@/actions/members";
import { toast } from "sonner";

export function LeaveHouseholdButton() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { household } = useHousehold();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLeave() {
    startTransition(async () => {
      const result = await leaveHousehold(household.id);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setShowConfirm(true)}>
        <LogOut className="mr-2 h-4 w-4" />
        {t("leaveHousehold")}
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("leaveHousehold")}</DialogTitle>
            <DialogDescription>
              {t("leaveHouseholdWarning")}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            {t("leaveHouseholdConfirm")}
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("leaveHousehold")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2, Trash2 } from "lucide-react";
import { deleteHousehold } from "@/actions/household";
import { toast } from "sonner";

export function DeleteHouseholdButton() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { household } = useHousehold();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const canDelete = confirmText === household.name;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteHousehold(household.id);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  if (!showConfirm) {
    return (
      <Button
        variant="destructive"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t("deleteHousehold")}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-destructive">{t("deleteHouseholdWarning")}</p>
      <p className="text-sm text-muted-foreground">
        {t("deleteHouseholdConfirm", { name: household.name })}
      </p>
      <Input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={household.name}
      />
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={!canDelete || isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("deleteHousehold")}
        </Button>
        <Button variant="outline" onClick={() => setShowConfirm(false)}>
          {tCommon("cancel")}
        </Button>
      </div>
    </div>
  );
}

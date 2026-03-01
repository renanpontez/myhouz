"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useHousehold, useUser } from "@home/auth/hooks";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@home/ui";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

export function TransferOwnershipSection() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { household, members } = useHousehold();
  const user = useUser();
  const router = useRouter();

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  const otherMembers = members.filter((m) => m.id !== user.id);
  const canTransfer = confirmText === household.name && selectedMemberId;

  function handleTransfer() {
    startTransition(async () => {
      const res = await fetch(
        `/api/household/${household.id}/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_owner_id: selectedMemberId }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Transfer failed");
        return;
      }

      toast.success(t("transferOwnershipSuccess"));
      setShowConfirm(false);
      router.push("/app/settings");
      router.refresh();
    });
  }

  if (otherMembers.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold">{t("transferOwnership")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("noOtherMembers")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">{t("transferOwnership")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("transferOwnershipDescription")}
      </p>

      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="new-owner" className="text-sm font-medium">
            {t("transferTo")}
          </label>
          <select
            id="new-owner"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">—</option>
            {otherMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? member.email}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setConfirmText("");
            setShowConfirm(true);
          }}
          disabled={!selectedMemberId}
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          {t("transferOwnership")}
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("transferOwnership")}</DialogTitle>
            <DialogDescription>
              {t("transferOwnershipWarning")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("transferOwnershipConfirm", { name: household.name })}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={household.name}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!canTransfer || isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("transferOwnership")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

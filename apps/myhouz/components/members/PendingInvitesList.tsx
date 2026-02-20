"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Card } from "@home/ui";
import { Mail, Link2, X } from "lucide-react";
import { revokeInvite } from "@/actions/invite";
import { toast } from "sonner";
import type { HouseholdInvite } from "@home/types";

interface PendingInvitesListProps {
  invites: HouseholdInvite[];
}

export function PendingInvitesList({ invites }: PendingInvitesListProps) {
  const t = useTranslations("members");
  const { isOwner } = useHousehold();

  if (invites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("noPendingInvites")}</p>
    );
  }

  return (
    <div className="space-y-2">
      {invites.map((invite) => (
        <PendingInviteRow key={invite.id} invite={invite} isOwner={isOwner} />
      ))}
    </div>
  );
}

function PendingInviteRow({
  invite,
  isOwner,
}: {
  invite: HouseholdInvite;
  isOwner: boolean;
}) {
  const t = useTranslations("members");
  const { household } = useHousehold();
  const [isPending, startTransition] = useTransition();

  function handleRevoke() {
    const confirmed = window.confirm(t("revokeConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await revokeInvite(household.id, invite.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {invite.email ? (
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm">
            {invite.email ?? t("linkInvite")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("inviteExpiry")}
          </p>
        </div>
      </div>
      {isOwner && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRevoke}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          {t("revoke")}
        </Button>
      )}
    </Card>
  );
}

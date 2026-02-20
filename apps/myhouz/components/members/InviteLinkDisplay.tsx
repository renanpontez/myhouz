"use client";

import { useTranslations } from "next-intl";
import { Button, Input, useCopyToClipboard } from "@home/ui";
import { Check, Copy, Link2 } from "lucide-react";

interface InviteLinkDisplayProps {
  inviteUrl: string;
  email: string | null;
  onReset: () => void;
}

export function InviteLinkDisplay({
  inviteUrl,
  email,
  onReset,
}: InviteLinkDisplayProps) {
  const t = useTranslations("members");
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
        <Link2 className="h-4 w-4 shrink-0 text-success" />
        <p className="text-sm font-medium text-success">
          {t("linkGenerated")}
        </p>
      </div>

      {email && (
        <p className="text-sm text-muted-foreground">
          {t("inviteSent", { email })}
        </p>
      )}

      <div className="flex gap-2">
        <Input
          value={inviteUrl}
          readOnly
          className="font-mono text-xs"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => copy(inviteUrl)}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{t("inviteExpiry")}</p>

      <Button variant="outline" onClick={onReset} className="w-full">
        {t("sendAnother")}
      </Button>
    </div>
  );
}

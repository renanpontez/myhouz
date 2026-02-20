"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { generateInvite } from "@/actions/invite";
import { toast } from "sonner";
import { InviteLinkDisplay } from "./InviteLinkDisplay";

export function InviteForm() {
  const t = useTranslations("members");
  const tError = useTranslations("error");
  const { household } = useHousehold();

  const [isPending, setIsPending] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await generateInvite(household.id, formData);

    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.inviteUrl) {
      setInviteUrl(result.inviteUrl);
      setSentEmail(email || null);
      if (email) {
        toast.success(t("inviteSent", { email }));
      }
    }
  }

  function handleReset() {
    setInviteUrl(null);
    setSentEmail(null);
  }

  if (inviteUrl) {
    return (
      <InviteLinkDisplay
        inviteUrl={inviteUrl}
        email={sentEmail}
        onReset={handleReset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {t("emailLabel")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <input type="hidden" name="role" value="member" />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("generateLink")}
      </Button>
    </form>
  );
}

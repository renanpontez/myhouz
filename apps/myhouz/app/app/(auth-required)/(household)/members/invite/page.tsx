"use client";

import { useTranslations } from "next-intl";

export default function InviteMemberPage() {
  const t = useTranslations("members");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t("inviteTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("inviteSubtitle")}
      </p>
      <div className="mt-6 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        {t("invitePlaceholder")}
      </div>
    </div>
  );
}

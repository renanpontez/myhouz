"use client";

import { useActionState } from "react";
import { Input, Label } from "@home/ui";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { BackLink } from "@/components/shared/BackLink";
import { createHousehold } from "@/actions/household";
import { useTranslations } from "next-intl";

export default function CreateHouseholdPage() {
  const [state, formAction] = useActionState(createHousehold, undefined);
  const t = useTranslations("onboarding");

  return (
    <div className="space-y-6">
      <BackLink href="/app/onboarding" />

      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("createTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("createSubtitle")}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("householdNameLabel")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("householdNamePlaceholder")}
            required
            autoFocus
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <SubmitButton className="w-full">{t("createButton")}</SubmitButton>
      </form>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { Input, Label } from "@home/ui";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { createHousehold } from "@/actions/household";
import { useTranslations } from "next-intl";

export default function CreateHouseholdPage() {
  const [state, formAction] = useActionState(createHousehold, undefined);
  const t = useTranslations("onboarding");
  const tNav = useTranslations("nav");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: tNav("dashboard"), href: "/app/dashboard" },
        { label: t("createHousehold"), href: "/app/onboarding" },
        { label: t("createTitle") },
      ]} />

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

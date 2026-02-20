"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { updateHousehold } from "@/actions/household";
import { toast } from "sonner";

export function HouseholdNameForm() {
  const t = useTranslations("settings");
  const tValidation = useTranslations("validation");
  const { household } = useHousehold();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateHousehold(household.id, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("householdNameSaved"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          {t("householdNameLabel")}
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={household.name}
          placeholder={tValidation("householdNameRequired")}
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("householdNameSaved").replace(" updated", "")}
      </Button>
    </form>
  );
}

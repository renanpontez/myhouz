"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { createUrgentProblem, updateUrgentProblem } from "@/actions/urgent";
import { toast } from "sonner";

interface UrgentProblemFormProps {
  mode: "create" | "edit";
  problemId?: string;
  defaultValues?: {
    title: string;
    description: string;
  };
}

export function UrgentProblemForm({
  mode,
  problemId,
  defaultValues,
}: UrgentProblemFormProps) {
  const t = useTranslations("urgent");
  const { household } = useHousehold();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (mode === "create") {
        const result = await createUrgentProblem(household.id, formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else if (problemId) {
        const result = await updateUrgentProblem(
          household.id,
          problemId,
          formData,
        );
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(t("saveButton"));
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          {t("titleLabel")} <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          placeholder={t("titlePlaceholder")}
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          {t("descriptionLabel")} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          placeholder={t("descriptionPlaceholder")}
          defaultValue={defaultValues?.description}
          rows={5}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? t("createButton") : t("saveButton")}
      </Button>
    </form>
  );
}

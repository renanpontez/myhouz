"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { Loader2, CheckCircle } from "lucide-react";
import { resolveUrgentProblem } from "@/actions/urgent";
import { toast } from "sonner";

interface ResolveProblemButtonProps {
  householdId: string;
  problemId: string;
}

export function ResolveProblemButton({
  householdId,
  problemId,
}: ResolveProblemButtonProps) {
  const t = useTranslations("urgent");
  const [isPending, startTransition] = useTransition();

  function handleResolve() {
    const confirmed = window.confirm(t("resolveConfirm"));
    if (!confirmed) return;

    startTransition(async () => {
      const result = await resolveUrgentProblem(householdId, problemId);
      if (result.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleResolve}
      disabled={isPending}
      className="bg-green-600 text-white hover:bg-green-700"
    >
      {isPending ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
      )}
      {t("resolveButton")}
    </Button>
  );
}

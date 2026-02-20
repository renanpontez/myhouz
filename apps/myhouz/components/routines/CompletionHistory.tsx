"use client";

import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

interface CompletionRecord {
  id: string;
  completed_at: string;
  completed_by: string;
}

interface CompletionHistoryProps {
  completions: CompletionRecord[];
}

export function CompletionHistory({ completions }: CompletionHistoryProps) {
  const t = useTranslations("routines");
  const { members } = useHousehold();

  if (completions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("noCompletions")}</p>
    );
  }

  return (
    <div className="space-y-2">
      {completions.map((completion) => {
        const member = members.find((m) => m.id === completion.completed_by);
        return (
          <div
            key={completion.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            <div className="flex-1 min-w-0">
              <span className="text-sm">
                {member?.name ?? member?.email ?? "Unknown"}
              </span>
              <p className="text-xs text-muted-foreground">
                {format(new Date(completion.completed_at), "PPp")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

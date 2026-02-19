"use client";

import { cn } from "@home/ui";
import { useTranslations } from "next-intl";

interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

const PRIORITY_STYLES = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
};

export function PriorityIndicator({
  priority,
  className,
}: PriorityIndicatorProps) {
  const t = useTranslations("enums");

  return (
    <span className={cn("text-xs font-medium", PRIORITY_STYLES[priority], className)}>
      {t(`priority.${priority}`)}
    </span>
  );
}

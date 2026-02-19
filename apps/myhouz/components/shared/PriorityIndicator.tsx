import { cn } from "@home/ui";

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
  return (
    <span className={cn("text-xs font-medium capitalize", PRIORITY_STYLES[priority], className)}>
      {priority}
    </span>
  );
}

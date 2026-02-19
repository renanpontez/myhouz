import { cn } from "@home/ui";

interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

const PRIORITY_STYLES = {
  low: "text-gray-500",
  medium: "text-yellow-500",
  high: "text-red-500",
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

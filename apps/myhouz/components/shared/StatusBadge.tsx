import { Badge } from "@home/ui";
import { cn } from "@home/ui";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  active: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  resolved: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-none text-xs",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  );
}

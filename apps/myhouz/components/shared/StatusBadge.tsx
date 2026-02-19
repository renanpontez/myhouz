import { Badge } from "@home/ui";
import { cn } from "@home/ui";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  in_progress: "bg-info/15 text-info dark:bg-info/25",
  done: "bg-success/15 text-success dark:bg-success/25",
  active: "bg-destructive/15 text-destructive dark:bg-destructive/25",
  resolved: "bg-muted text-muted-foreground",
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

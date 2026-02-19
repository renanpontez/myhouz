import { Badge } from "@home/ui";
import { cn } from "@home/ui";

interface RoleBadgeProps {
  role: "owner" | "member" | "guest";
  className?: string;
}

const ROLE_STYLES = {
  owner: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  member: "bg-info/15 text-info dark:bg-info/25",
  guest: "bg-muted text-muted-foreground",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-none text-xs capitalize", ROLE_STYLES[role], className)}
    >
      {role}
    </Badge>
  );
}

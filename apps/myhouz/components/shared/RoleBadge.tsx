import { Badge } from "@home/ui";
import { cn } from "@home/ui";

interface RoleBadgeProps {
  role: "owner" | "member" | "guest";
  className?: string;
}

const ROLE_STYLES = {
  owner: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  member: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  guest: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
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

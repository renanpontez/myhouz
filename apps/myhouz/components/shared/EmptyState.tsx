import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      {icon}
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

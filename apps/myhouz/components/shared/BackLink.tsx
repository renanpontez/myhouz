"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  const t = useTranslations("common");

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {label ?? t("back")}
    </Link>
  );
}

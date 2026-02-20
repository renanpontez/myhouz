"use client";

import { useTranslations } from "next-intl";
import { Button } from "@home/ui";
import { ListChecks, X } from "lucide-react";
import {
  IconPicker as ShadcnIconPicker,
  Icon,
  type IconName,
} from "@/components/ui/icon-picker";

interface TaskIconPickerProps {
  value: string | null;
  onChange: (icon: string | null) => void;
}

export function IconPicker({ value, onChange }: TaskIconPickerProps) {
  const t = useTranslations("routines");

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{t("iconLabel")}</label>
      <div className="flex items-center gap-2">
        <ShadcnIconPicker
          value={value as IconName | undefined}
          onValueChange={(icon: string) => onChange(icon)}
          searchPlaceholder={t("selectIcon")}
          triggerPlaceholder={t("selectIcon")}
          categorized={false}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {value ? (
              <>
                <Icon name={value as IconName} className="h-4 w-4" />
                <span className="text-xs text-muted-foreground">{value}</span>
              </>
            ) : (
              <>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                <span>{t("selectIcon")}</span>
              </>
            )}
          </Button>
        </ShadcnIconPicker>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-3 w-3" />
            {t("noIcon")}
          </button>
        )}
      </div>
    </div>
  );
}

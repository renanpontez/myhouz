"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { createTask, updateTask } from "@/actions/routines";
import { toast } from "sonner";
import { IconPicker } from "./IconPicker";
import type { RecurrenceType, RecurrenceMeta } from "@home/types";

interface TaskFormProps {
  mode: "create" | "edit";
  taskId?: string;
  defaultValues?: {
    title: string;
    recurrence: RecurrenceType;
    recurrence_meta?: RecurrenceMeta;
    assigned_to?: string | null;
    icon?: string | null;
    starts_at?: string | null;
  };
}

const UI_RECURRENCE_OPTIONS = ["daily", "monthly", "custom"] as const;

// 0=Sun, 1=Mon, ..., 6=Sat — display order starts Monday
const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0];

type CustomMode = "days_of_week" | "interval";
type IntervalUnit = "days" | "weeks" | "months";

function parseDefaultMeta(meta?: RecurrenceMeta): {
  customMode: CustomMode;
  selectedDays: number[];
  intervalEvery: number;
  intervalUnit: IntervalUnit;
} {
  if (meta?.type === "days_of_week") {
    return {
      customMode: "days_of_week",
      selectedDays: meta.days,
      intervalEvery: 2,
      intervalUnit: "weeks",
    };
  }
  if (meta?.type === "interval") {
    return {
      customMode: "interval",
      selectedDays: [1, 3, 5],
      intervalEvery: meta.every,
      intervalUnit: meta.unit,
    };
  }
  return {
    customMode: "days_of_week",
    selectedDays: [1, 3, 5],
    intervalEvery: 2,
    intervalUnit: "weeks",
  };
}

export function TaskForm({ mode, taskId, defaultValues }: TaskFormProps) {
  const t = useTranslations("routines");
  const tEnums = useTranslations("enums");
  const { household, members } = useHousehold();
  const [isPending, startTransition] = useTransition();

  const [icon, setIcon] = useState<string | null>(
    defaultValues?.icon ?? null,
  );
  const [assignedTo, setAssignedTo] = useState(
    defaultValues?.assigned_to ?? "",
  );
  const [startsAt, setStartsAt] = useState(
    defaultValues?.starts_at ?? "",
  );

  // Determine initial recurrence: map legacy values to closest match
  const initialRecurrence = (() => {
    const r = defaultValues?.recurrence ?? "daily";
    if (r === "weekly" || r === "weekdays" || r === "weekends") return "custom";
    if (r === "daily" || r === "monthly" || r === "custom") return r;
    return "daily";
  })();

  const [recurrence, setRecurrence] = useState<string>(initialRecurrence);

  // Custom sub-mode state
  const defaults = parseDefaultMeta(defaultValues?.recurrence_meta);
  const [customMode, setCustomMode] = useState<CustomMode>(
    defaults.customMode,
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    defaults.selectedDays,
  );
  const [intervalEvery, setIntervalEvery] = useState<number>(
    defaults.intervalEvery,
  );
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(
    defaults.intervalUnit,
  );

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function buildRecurrenceMeta(): RecurrenceMeta {
    if (recurrence !== "custom") return null;

    if (customMode === "days_of_week") {
      return { type: "days_of_week", days: selectedDays };
    }

    return { type: "interval", every: intervalEvery, unit: intervalUnit };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Set recurrence fields
    formData.set("recurrence", recurrence);
    const meta = buildRecurrenceMeta();
    formData.set("recurrence_meta", meta ? JSON.stringify(meta) : "");

    // Set icon
    formData.set("icon", icon ?? "");

    // Set assigned_to
    if (assignedTo) {
      formData.set("assigned_to", assignedTo);
    }

    // Set starts_at
    if (startsAt) {
      formData.set("starts_at", startsAt);
    }

    startTransition(async () => {
      if (mode === "create") {
        const result = await createTask(household.id, formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else if (taskId) {
        const result = await updateTask(household.id, taskId, formData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(t("saveButton"));
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          {t("titleLabel")} <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          name="title"
          placeholder={t("titlePlaceholder")}
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      {/* Icon picker */}
      <IconPicker value={icon} onChange={setIcon} />

      {/* Recurrence selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("recurrenceLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {UI_RECURRENCE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRecurrence(r)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                recurrence === r
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {tEnums(`recurrence.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom recurrence config */}
      {recurrence === "custom" && (
        <div className="space-y-4 rounded-lg border p-4">
          {/* Custom mode tabs */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCustomMode("days_of_week")}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                customMode === "days_of_week"
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {t("customDaysOfWeek")}
            </button>
            <button
              type="button"
              onClick={() => setCustomMode("interval")}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                customMode === "interval"
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {t("customInterval")}
            </button>
          </div>

          {/* Days of week picker */}
          {customMode === "days_of_week" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t("selectDaysHint")}
              </p>
              <div className="flex gap-1.5">
                {DAYS_ORDER.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "border hover:bg-accent"
                    }`}
                  >
                    {tEnums(`dayShort.${day}`)}
                  </button>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <p className="text-xs text-destructive">
                  {t("selectAtLeastOneDay")}
                </p>
              )}
            </div>
          )}

          {/* Interval picker */}
          {customMode === "interval" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t("intervalHint")}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">{t("every")}</span>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={intervalEvery}
                  onChange={(e) =>
                    setIntervalEvery(
                      Math.max(1, parseInt(e.target.value) || 1),
                    )
                  }
                  className="w-20"
                />
                <select
                  value={intervalUnit}
                  onChange={(e) =>
                    setIntervalUnit(e.target.value as IntervalUnit)
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="days">{tEnums("intervalUnit.days")}</option>
                  <option value="weeks">{tEnums("intervalUnit.weeks")}</option>
                  <option value="months">
                    {tEnums("intervalUnit.months")}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Start date */}
      <div className="space-y-1.5">
        <label htmlFor="starts_at" className="text-sm font-medium">
          {t("startsAtLabel")}
        </label>
        <input
          id="starts_at"
          type="date"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground">{t("startsAtHint")}</p>
      </div>

      {/* Assigned to */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("assignedToLabel")}</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("unassigned")}</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name ?? member.email}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? t("createButton") : t("saveButton")}
      </Button>
    </form>
  );
}

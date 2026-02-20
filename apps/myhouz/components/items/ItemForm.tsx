"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button, Input } from "@home/ui";
import { Loader2 } from "lucide-react";
import { createItem, updateItem } from "@/actions/items";
import { toast } from "sonner";
import { ImagePicker } from "./ImagePicker";
import { TagInput } from "./TagInput";

interface ItemFormProps {
  mode: "create" | "edit";
  itemId?: string;
  defaultValues?: {
    name: string;
    type: "buy" | "repair" | "fix";
    priority: "low" | "medium" | "high";
    assigned_to?: string | null;
    notes?: string | null;
    price?: number | null;
    photos?: string[] | null;
    link?: string | null;
    tags?: string[] | null;
  };
}

const TYPE_OPTIONS = ["buy", "repair", "fix"] as const;
const PRIORITY_OPTIONS = ["low", "medium", "high"] as const;

export function ItemForm({ mode, itemId, defaultValues }: ItemFormProps) {
  const t = useTranslations("items");
  const tEnums = useTranslations("enums");
  const { household, members } = useHousehold();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState(defaultValues?.type ?? "buy");
  const [priority, setPriority] = useState(defaultValues?.priority ?? "medium");
  const [assignedTo, setAssignedTo] = useState(
    defaultValues?.assigned_to ?? "",
  );
  const [photos, setPhotos] = useState<string[]>(
    defaultValues?.photos ?? [],
  );
  const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set("type", type);
    formData.set("priority", priority);

    if (assignedTo) {
      formData.set("assigned_to", assignedTo);
    }

    formData.set("photos", JSON.stringify(photos));
    formData.set("tags", JSON.stringify(tags));

    startTransition(async () => {
      if (mode === "create") {
        const result = await createItem(household.id, formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else if (itemId) {
        const result = await updateItem(household.id, itemId, formData);
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
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          {t("nameLabel")} <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          defaultValue={defaultValues?.name}
          required
        />
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("typeLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t_) => (
            <button
              key={t_}
              type="button"
              onClick={() => setType(t_)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                type === t_
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {tEnums(`itemType.${t_}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("priorityLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                priority === p
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {tEnums(`priority.${p}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <label htmlFor="price" className="text-sm font-medium">
          {t("priceLabel")}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            R$
          </span>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder={t("pricePlaceholder")}
            defaultValue={defaultValues?.price ?? ""}
            className="pl-10"
          />
        </div>
      </div>

      {/* Link */}
      <div className="space-y-1.5">
        <label htmlFor="link" className="text-sm font-medium">
          {t("linkLabel")}
        </label>
        <Input
          id="link"
          name="link"
          type="url"
          placeholder={t("linkPlaceholder")}
          defaultValue={defaultValues?.link ?? ""}
        />
      </div>

      {/* Photos */}
      <ImagePicker value={photos} onChange={setPhotos} />

      {/* Tags */}
      <TagInput value={tags} onChange={setTags} />

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

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          {t("notesLabel")}
        </label>
        <textarea
          id="notes"
          name="notes"
          placeholder={t("notesPlaceholder")}
          defaultValue={defaultValues?.notes ?? ""}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? t("createButton") : t("saveButton")}
      </Button>
    </form>
  );
}

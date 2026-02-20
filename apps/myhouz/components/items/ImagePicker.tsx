"use client";

import { useState, useRef, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useHousehold } from "@home/auth/hooks";
import { Button } from "@home/ui";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { toast } from "sonner";

interface ImagePickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImagePicker({ value, onChange, max = 5 }: ImagePickerProps) {
  const t = useTranslations("items");
  const { household } = useHousehold();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [uploadingCount, setUploadingCount] = useState(0);

  function handleClick() {
    if (value.length >= max) return;
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = max - value.length;
    const toUpload = files.slice(0, remaining);

    startUpload(async () => {
      setUploadingCount(toUpload.length);

      try {
        // Compress all files
        const compressed = await Promise.all(
          toUpload.map((f) => compressImage(f)),
        );

        const formData = new FormData();
        for (const file of compressed) {
          formData.append("files", file);
        }
        formData.append("bucket", "item-images");
        formData.append("householdId", household.id);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          toast.error(t("uploadError"));
          return;
        }

        const json = await res.json();
        const newUrls = json.data?.urls ?? [];
        onChange([...value, ...newUrls]);
      } catch {
        toast.error(t("uploadError"));
      } finally {
        setUploadingCount(0);
        // Reset input so same file can be selected again
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{t("photosLabel")}</label>

      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div
            key={url}
            className="group relative h-20 w-20 overflow-hidden rounded-lg border"
          >
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed transition-colors hover:bg-accent disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-0.5">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {uploadingCount}
                </span>
              </div>
            ) : (
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {value.length >= max ? t("photosMaxReached") : t("photosHint")}
      </p>
    </div>
  );
}

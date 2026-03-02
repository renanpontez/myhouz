"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@home/ui";
import { Loader2, Check } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import { cn } from "@home/ui";

const DICEBEAR_BASE = "https://api.dicebear.com/9.x";

const AVATAR_OPTIONS = [
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Aiden` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Lily` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Milo` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Sophie` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Oliver` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Emma` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Margaret` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Robert` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Dorothy` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Arthur` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Helen` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Walter` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Felix` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Clara` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=James` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Nina` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Leo` },
  { url: `${DICEBEAR_BASE}/lorelei/svg?seed=Rosa` },
] as const;

interface ProfileFormProps {
  initialName: string;
  initialAvatarUrl: string | null;
}

export function ProfileForm({
  initialName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const t = useTranslations("settings");
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialName);
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialAvatarUrl ?? AVATAR_OPTIONS[0].url,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("avatar_url", selectedAvatar);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("profileSaved"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar preview + Name */}
      <div className="flex items-start gap-5">
        <img
          src={selectedAvatar}
          alt=""
          className="h-20 w-20 shrink-0 rounded-full bg-muted"
        />
        <div className="flex-1 space-y-1.5">
          <label htmlFor="profile-name" className="text-sm font-medium">
            {t("profileNameLabel")}
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("profileNamePlaceholder")}
            required
          />
        </div>
      </div>

      {/* Avatar picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("profileAvatarLabel")}</label>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {AVATAR_OPTIONS.map(({ url }) => {
            const isSelected = selectedAvatar === url;
            return (
              <button
                key={url}
                type="button"
                onClick={() => setSelectedAvatar(url)}
                className={cn(
                  "relative flex items-center justify-center rounded-xl border-2 p-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-border",
                )}
              >
                <img src={url} alt="" className="h-14 w-14 rounded-full" />
                {isSelected && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("profileSave")}
      </Button>
    </form>
  );
}

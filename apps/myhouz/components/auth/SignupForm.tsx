"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@home/types";
import { createSignupSchema } from "@home/types";
import { Button, Input, Label } from "@home/ui";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("auth");
  const tValidation = useTranslations("validation");

  const inviteCode = searchParams.get("invite");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const signupSchema = createSignupSchema(tValidation);
    const parsed = signupSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? t("invalidData"));
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error: authError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { name: parsed.data.name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError(t("emailAlreadyRegistered"));
        } else {
          setError(t("signupError"));
        }
        return;
      }

      if (inviteCode) {
        router.push(`/invite/${inviteCode}`);
      } else {
        router.push("/app/onboarding");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder={t("namePlaceholder")}
          required
          autoComplete="name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t("passwordMinPlaceholder")}
          required
          autoComplete="new-password"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("signup")}
      </Button>
    </form>
  );
}

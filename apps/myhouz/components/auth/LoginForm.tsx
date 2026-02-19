"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@home/types";
import { loginSchema } from "@home/types";
import { Button, Input, Label } from "@home/ui";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const inviteCode = searchParams.get("invite");
  const redirectTo = searchParams.get("redirect");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Dados invalidos");
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        console.error("[LoginForm] Supabase auth error:", authError.message, authError.status);
        if (authError.message.includes("Email not confirmed")) {
          setError("E-mail nao confirmado. Verifique sua caixa de entrada.");
        } else {
          setError("E-mail ou senha incorretos");
        }
        return;
      }

      if (inviteCode) {
        router.push(`/invite/${inviteCode}`);
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/app/dashboard");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Sua senha"
          required
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}

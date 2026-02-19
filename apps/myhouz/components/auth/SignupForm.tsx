"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@home/types";
import { signupSchema } from "@home/types";
import { Button, Input, Label } from "@home/ui";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const inviteCode = searchParams.get("invite");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      name: formData.get("name"),
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
      const { error: authError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { name: parsed.data.name },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Este e-mail ja esta cadastrado");
        } else {
          setError("Erro ao criar conta. Tente novamente.");
        }
        return;
      }

      if (inviteCode) {
        router.push(`/invite/${inviteCode}`);
      } else {
        router.push("/onboarding");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Seu nome"
          required
          autoComplete="name"
        />
      </div>
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
          placeholder="Minimo 6 caracteres"
          required
          autoComplete="new-password"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar conta
      </Button>
    </form>
  );
}

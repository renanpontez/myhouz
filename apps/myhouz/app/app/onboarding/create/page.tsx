"use client";

import { useActionState } from "react";
import { Input, Label } from "@home/ui";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { BackLink } from "@/components/shared/BackLink";
import { createHousehold } from "@/actions/household";

export default function CreateHouseholdPage() {
  const [state, formAction] = useActionState(createHousehold, undefined);

  return (
    <div className="space-y-6">
      <BackLink href="/app/onboarding" label="Voltar" />

      <div className="text-center">
        <h1 className="text-2xl font-bold">Crie sua casa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          De um nome para sua casa para comecar
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome da casa</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Apartamento 301"
            required
            autoFocus
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <SubmitButton className="w-full">Criar casa</SubmitButton>
      </form>
    </div>
  );
}

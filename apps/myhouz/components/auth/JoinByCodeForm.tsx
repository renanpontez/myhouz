"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@home/ui";

export function JoinByCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      router.push(`/invite/${trimmed}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="invite-code">Codigo do convite</Label>
        <Input
          id="invite-code"
          placeholder="Cole o codigo aqui"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <Button type="submit" variant="outline" className="w-full">
        Entrar
      </Button>
    </form>
  );
}

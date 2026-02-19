"use client";

import { useState, useTransition } from "react";
import { Button } from "@home/ui";
import { Loader2 } from "lucide-react";
import { acceptInvite } from "@/actions/invite";
import { toast } from "sonner";

interface AcceptInviteButtonProps {
  code: string;
}

export function AcceptInviteButton({ code }: AcceptInviteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAccept() {
    setError("");
    startTransition(async () => {
      const result = await acceptInvite(code);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAccept} className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Aceitar convite
      </Button>
      {error && <p className="text-sm text-center text-destructive">{error}</p>}
    </div>
  );
}

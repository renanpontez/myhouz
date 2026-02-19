"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@home/ui";
import { Loader2 } from "lucide-react";
import type { ButtonProps } from "@home/ui";

interface SubmitButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

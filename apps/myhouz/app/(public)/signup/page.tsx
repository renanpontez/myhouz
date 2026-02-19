import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { InviteNotice } from "@/components/auth/InviteNotice";

interface SignupPageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { invite } = await searchParams;

  const loginHref = invite ? `/login?invite=${invite}` : "/login";

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Gerencie sua casa com o MyHouz"
      footer={
        <p className="text-sm text-muted-foreground">
          Ja tem conta?{" "}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {invite && (
          <Suspense>
            <InviteNotice inviteCode={invite} />
          </Suspense>
        )}
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </AuthCard>
  );
}

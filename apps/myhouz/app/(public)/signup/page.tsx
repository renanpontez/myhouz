import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { InviteNotice } from "@/components/auth/InviteNotice";

interface SignupPageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { invite } = await searchParams;
  const t = await getTranslations("auth");

  const loginHref = invite ? `/login?invite=${invite}` : "/login";

  return (
    <AuthCard
      title={t("createAccount")}
      subtitle={t("signupSubtitle")}
      footer={
        <p className="text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            {t("login")}
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

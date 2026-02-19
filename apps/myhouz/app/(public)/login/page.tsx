import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { InviteNotice } from "@/components/auth/InviteNotice";

interface LoginPageProps {
  searchParams: Promise<{ invite?: string; redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { invite, error } = await searchParams;
  const t = await getTranslations("auth");

  const signupHref = invite ? `/signup?invite=${invite}` : "/signup";

  return (
    <AuthCard
      title={t("welcomeBack")}
      subtitle={t("loginSubtitle")}
      footer={
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href={signupHref} className="font-medium text-primary hover:underline">
            {t("signup")}
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
        {error === "auth_callback_error" && (
          <p className="text-sm text-center text-destructive">
            {t("authError")}
          </p>
        )}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </AuthCard>
  );
}

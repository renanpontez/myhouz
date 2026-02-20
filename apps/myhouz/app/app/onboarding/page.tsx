import Link from "next/link";
import { Home, UserPlus } from "lucide-react";
import { Card, CardContent } from "@home/ui";
import { getTranslations } from "next-intl/server";
import { JoinByCodeForm } from "@/components/auth/JoinByCodeForm";
import { OrDivider } from "@/components/auth/OrDivider";

export default async function OnboardingPage() {
  const t = await getTranslations("onboarding");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src="/myhouz-logo.svg" alt="myhouz" className="h-10 w-auto" />
        <p className="text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/app/onboarding/create">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{t("createHousehold")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("createHouseholdDescription")}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <OrDivider />

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{t("hasInvite")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("hasInviteDescription")}
                </p>
              </div>
            </div>
            <JoinByCodeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

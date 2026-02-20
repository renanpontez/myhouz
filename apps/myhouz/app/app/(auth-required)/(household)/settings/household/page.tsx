import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { HouseholdNameForm } from "@/components/settings/HouseholdNameForm";
import { DeleteHouseholdButton } from "@/components/settings/DeleteHouseholdButton";

export default async function HouseholdSettingsPage() {
  const t = await getTranslations("settings");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) redirect("/app/onboarding");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") redirect("/app/settings");

  return (
    <div className="p-6">
      <BackLink href="/app/settings" />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("householdTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("householdSubtitle")}
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="max-w-md rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("householdInfoSection")}</h2>
          <div className="mt-4">
            <HouseholdNameForm />
          </div>
        </div>

        <div className="max-w-md rounded-2xl border border-destructive p-6">
          <h2 className="text-lg font-semibold text-destructive">
            {t("dangerZone")}
          </h2>
          <div className="mt-4">
            <DeleteHouseholdButton />
          </div>
        </div>
      </div>
    </div>
  );
}

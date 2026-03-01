import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { HouseholdNameForm } from "@/components/settings/HouseholdNameForm";
import { DeleteHouseholdButton } from "@/components/settings/DeleteHouseholdButton";
import { TransferOwnershipSection } from "@/components/settings/TransferOwnershipSection";
import { LeaveHouseholdButton } from "@/components/settings/LeaveHouseholdButton";

export default async function HouseholdSettingsPage() {
  const t = await getTranslations("settings");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) redirect("/app/onboarding");

  const { role } = await getUserWithRole(householdId);
  const isOwner = role === "owner";

  const supabase = createServerClient();
  const { data: household } = await supabase
    .from("household")
    .select("name")
    .eq("id", householdId)
    .single();

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
        {/* Household Info */}
        <div className="max-w-md rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">{t("householdInfoSection")}</h2>
          <div className="mt-4">
            {isOwner ? (
              <HouseholdNameForm />
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">{t("householdNameLabel")}</p>
                <p className="text-sm text-muted-foreground">
                  {household?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("householdReadOnly")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Ownership — owner only */}
        {isOwner && (
          <div className="max-w-md rounded-2xl border p-6">
            <TransferOwnershipSection />
          </div>
        )}

        {/* Danger Zone */}
        <div className="max-w-md rounded-2xl border border-destructive p-6">
          <h2 className="text-lg font-semibold text-destructive">
            {t("dangerZone")}
          </h2>
          <div className="mt-4">
            {isOwner ? <DeleteHouseholdButton /> : <LeaveHouseholdButton />}
          </div>
        </div>
      </div>
    </div>
  );
}

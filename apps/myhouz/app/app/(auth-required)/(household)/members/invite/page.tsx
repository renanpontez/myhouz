import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserWithRole } from "@home/auth";
import { BackLink } from "@/components/shared/BackLink";
import { InviteForm } from "@/components/members/InviteForm";

export default async function InviteMemberPage() {
  const t = await getTranslations("members");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) redirect("/app/onboarding");

  const { role } = await getUserWithRole(householdId);
  if (role !== "owner") redirect("/app/members");

  return (
    <div className="px-4 py-6 sm:p-6">
      <BackLink href="/app/members" />
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{t("inviteTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("inviteSubtitle")}
        </p>
      </div>
      <div className="mt-6 max-w-md">
        <InviteForm />
      </div>
    </div>
  );
}

import { createAdminClient } from "@home/db";
import { getTranslations } from "next-intl/server";

interface InviteNoticeProps {
  inviteCode: string;
}

export async function InviteNotice({ inviteCode }: InviteNoticeProps) {
  const supabase = createAdminClient();

  const { data: invite } = await supabase
    .from("household_invite")
    .select("household_id")
    .eq("code", inviteCode)
    .eq("status", "pending")
    .single();

  if (!invite) return null;

  const { data: household } = await supabase
    .from("household")
    .select("name")
    .eq("id", invite.household_id)
    .single();

  if (!household) return null;

  const t = await getTranslations("invite");

  return (
    <div className="rounded-lg bg-primary/10 px-4 py-3 text-center text-sm">
      {t("joinHousehold", { householdName: household.name })}
    </div>
  );
}

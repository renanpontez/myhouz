import { createAdminClient } from "@home/db";

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

  return (
    <div className="rounded-md bg-primary/10 px-4 py-3 text-center text-sm">
      Entre para se juntar a <span className="font-semibold">{household.name}</span>
    </div>
  );
}

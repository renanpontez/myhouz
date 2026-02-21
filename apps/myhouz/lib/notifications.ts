import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@home/types";

interface NotifyParams {
  supabase: SupabaseClient<Database>;
  householdId: string;
  excludeUserId: string;
  type: string;
  title: string;
  body?: string;
  referenceId?: string;
  referenceType?: string;
}

export async function notifyHouseholdMembers({
  supabase,
  householdId,
  excludeUserId,
  type,
  title,
  body,
  referenceId,
  referenceType,
}: NotifyParams) {
  const { data: members } = await supabase
    .from("household_member")
    .select("user_id")
    .eq("household_id", householdId);

  if (!members || members.length === 0) return;

  const notifications = members
    .filter((m) => m.user_id !== excludeUserId)
    .map((m) => ({
      user_id: m.user_id,
      household_id: householdId,
      type,
      title,
      body: body ?? null,
      reference_id: referenceId ?? null,
      reference_type: referenceType ?? null,
    }));

  if (notifications.length === 0) return;

  await supabase.from("notification").insert(notifications);
}

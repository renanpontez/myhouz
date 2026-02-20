import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@home/db";
import { getUserWithRole } from "@home/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { MemberCard } from "@/components/members/MemberCard";
import { PendingInvitesList } from "@/components/members/PendingInvitesList";
import type { Profile, HouseholdMember } from "@home/types";

export default async function MembersPage() {
  const t = await getTranslations("members");
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) return null;

  const { role } = await getUserWithRole(householdId);
  const supabase = createServerClient();

  // Fetch members with their profiles
  const { data: memberships } = await supabase
    .from("household_member")
    .select("id, user_id, household_id, role, joined_at, created_at, updated_at")
    .eq("household_id", householdId)
    .order("joined_at", { ascending: true });

  const memberIds = memberships?.map((m) => m.user_id) ?? [];

  const { data: profiles } = await supabase
    .from("profile")
    .select("id, name, email, avatar_url, created_at, updated_at")
    .in("id", memberIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Fetch pending invites (owner only)
  let pendingInvites: Array<{
    id: string;
    email: string | null;
    code: string;
    role: string;
    status: string;
    expires_at: string;
    created_at: string;
    household_id: string;
    invited_by: string;
    accepted_by: string | null;
    accepted_at: string | null;
    updated_at: string;
  }> = [];

  if (role === "owner") {
    const { data } = await supabase
      .from("household_invite")
      .select("id, email, code, role, status, expires_at, created_at, household_id, invited_by, accepted_by, accepted_at, updated_at")
      .eq("household_id", householdId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    pendingInvites = data ?? [];
  }

  const isOwner = role === "owner";

  return (
    <div className="p-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          isOwner ? (
            <Link
              href="/app/members/invite"
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              {t("inviteButton")}
            </Link>
          ) : undefined
        }
      />

      <div className="mt-6 space-y-3">
        {(memberships ?? []).map((membership) => {
          const profile = profileMap.get(membership.user_id);
          if (!profile) return null;
          return (
            <MemberCard
              key={membership.id}
              member={profile as Profile}
              membership={membership as HouseholdMember}
            />
          );
        })}
      </div>

      {isOwner && pendingInvites.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">{t("pendingInvites")}</h2>
          <PendingInvitesList invites={pendingInvites as any} />
        </div>
      )}
    </div>
  );
}

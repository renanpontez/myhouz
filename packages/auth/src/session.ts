import { createServerClient } from "@home/db";
import { redirect } from "next/navigation";
import type { Profile, HouseholdMember, MemberRole } from "@home/types";

/**
 * Returns the current Supabase session. Returns null if not authenticated.
 * Use in Server Components and Server Actions.
 */
export async function getSession() {
  const supabase = createServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Failed to get session:", error.message);
    return null;
  }

  return session;
}

/**
 * Returns the current user's profile from the `profile` table.
 * Redirects to /login if not authenticated.
 * Use in Server Components that require authentication.
 */
export async function getUser(): Promise<Profile> {
  const supabase = createServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profile")
    .select()
    .eq("id", authUser.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  return profile;
}

/**
 * Returns the user's profile along with their role in the specified household.
 * Redirects to /login if not authenticated, or /onboarding if not a member.
 */
export async function getUserWithRole(
  householdId: string,
): Promise<{
  profile: Profile;
  membership: HouseholdMember;
  role: MemberRole;
}> {
  const supabase = createServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profile")
    .select()
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("household_member")
    .select()
    .eq("household_id", householdId)
    .eq("user_id", authUser.id)
    .single();

  if (!membership) {
    redirect("/onboarding");
  }

  return {
    profile,
    membership,
    role: membership.role,
  };
}

import { redirect } from "next/navigation";
import { getUser } from "@home/auth";
import { UserProvider } from "@home/auth";
import { createServerClient } from "@home/db";
import type { MemberRole } from "@home/types";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const supabase = createServerClient();

  // Fetch all households the user belongs to
  const { data: memberships } = await supabase
    .from("household_member")
    .select("household_id, role")
    .eq("user_id", user.id);

  if (!memberships || memberships.length === 0) {
    redirect("/app/onboarding");
  }

  const householdIds = memberships.map((m) => m.household_id);

  const { data: householdsData } = await supabase
    .from("household")
    .select("id, name")
    .in("id", householdIds);

  const roleMap = new Map(
    memberships.map((m) => [m.household_id, m.role as MemberRole]),
  );

  const households = (householdsData ?? []).map((h) => ({
    id: h.id,
    name: h.name,
    role: roleMap.get(h.id) ?? ("member" as MemberRole),
  }));

  return (
    <UserProvider user={user} households={households}>
      {children}
    </UserProvider>
  );
}

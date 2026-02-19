import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserWithRole } from "@home/auth";
import { HouseholdProvider } from "@home/auth";
import { createServerClient } from "@home/db";

export default async function HouseholdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) {
    redirect("/onboarding");
  }

  const { membership, role } = await getUserWithRole(householdId);

  const supabase = createServerClient();

  const { data: memberRows } = await supabase
    .from("household_member")
    .select("user_id")
    .eq("household_id", householdId);

  const memberIds = memberRows?.map((m) => m.user_id) ?? [];

  const { data: members } = await supabase
    .from("profile")
    .select()
    .in("id", memberIds);

  const { data: household } = await supabase
    .from("household")
    .select()
    .eq("id", householdId)
    .single();

  if (!household) {
    redirect("/onboarding");
  }

  return (
    <HouseholdProvider
      household={household}
      membership={membership}
      role={role}
      members={members ?? []}
    >
      <div className="flex min-h-screen">
        {/* Sidebar placeholder — will be implemented */}
        <aside className="hidden w-64 border-r bg-card lg:block">
          <div className="p-4 font-semibold">MyHouz</div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </HouseholdProvider>
  );
}

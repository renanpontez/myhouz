import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserWithRole } from "@home/auth";
import { HouseholdProvider } from "@home/auth";
import { createServerClient } from "@home/db";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

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
        <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
          <div className="p-4 text-lg font-semibold">MyHouz</div>
          <Sidebar />
        </aside>

        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <BottomNav />
        </div>
      </div>
    </HouseholdProvider>
  );
}

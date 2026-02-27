import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserWithRole } from "@home/auth";
import { HouseholdProvider } from "@home/auth";
import { createServerClient } from "@home/db";
import { DesktopSidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default async function HouseholdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const householdId = cookieStore.get("activeHouseholdId")?.value;

  if (!householdId) {
    redirect("/app/onboarding");
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

  const [{ data: household }, { count: urgentCount }, { data: urgentProblems }] =
    await Promise.all([
      supabase
        .from("household")
        .select()
        .eq("id", householdId)
        .single(),
      supabase
        .from("urgent_problem")
        .select("*", { count: "exact", head: true })
        .eq("household_id", householdId)
        .eq("is_active", true),
      supabase
        .from("urgent_problem")
        .select("id, title, created_at")
        .eq("household_id", householdId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  if (!household) {
    redirect("/app/onboarding");
  }

  return (
    <HouseholdProvider
      household={household}
      membership={membership}
      role={role}
      members={members ?? []}
    >
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DesktopSidebar />
          <MobileSidebar />

          <div className="flex flex-1 flex-col">
            <TopBar
              urgentCount={urgentCount ?? 0}
              urgentProblems={urgentProblems ?? []}
            />
            <main className="flex-1 pb-24 lg:pb-0">{children}</main>
            <BottomNav />
          </div>
        </div>
      </SidebarProvider>
    </HouseholdProvider>
  );
}

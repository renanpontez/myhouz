import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";

export const GET = withAuth(async (_request, { user, supabase }) => {
  const { data: memberships, error } = await supabase
    .from("household_member")
    .select("role, household:household(id, name, owner_id, created_at, updated_at)")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch households" },
      { status: 500 },
    );
  }

  const households = (memberships ?? []).map((m) => ({
    household: m.household,
    role: m.role,
  }));

  return NextResponse.json({ data: households });
});

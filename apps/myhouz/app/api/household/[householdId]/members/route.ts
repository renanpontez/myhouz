import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }) => {
    const { data: members, error } = await supabase
      .from("household_member")
      .select("id, role, joined_at, user_id, profile:profile(id, name, email, avatar_url)")
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch members" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: members });
  },
);

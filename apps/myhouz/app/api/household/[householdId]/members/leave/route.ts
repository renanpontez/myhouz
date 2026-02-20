import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const POST = withHouseholdAuth(
  async (_request, { household, membership, user, supabase }) => {
    if (membership.role === "owner") {
      return NextResponse.json(
        { error: "Owner cannot leave household" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("household_member")
      .delete()
      .eq("household_id", household.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to leave household" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { left: true } });
  },
);

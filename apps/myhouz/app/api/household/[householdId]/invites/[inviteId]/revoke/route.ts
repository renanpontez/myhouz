import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const POST = withHouseholdAuth(
  async (_request, { household, membership, supabase }, params) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const inviteId = params.inviteId;
    if (!inviteId) {
      return NextResponse.json(
        { error: "Missing inviteId" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("household_invite")
      .update({ status: "revoked" })
      .eq("id", inviteId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to revoke invite" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { revoked: true } });
  },
);

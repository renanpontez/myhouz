import { NextResponse } from "next/server";
import { z } from "zod";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody } from "@/lib/api-helpers";

const transferSchema = z.object({
  new_owner_id: z.string().uuid(),
});

export const POST = withHouseholdAuth(
  async (request, { user, household, membership, supabase }) => {
    if (membership.role !== "owner") {
      return NextResponse.json(
        { error: "Only the owner can transfer ownership" },
        { status: 403 },
      );
    }

    const result = await parseJsonBody(request, transferSchema);
    if (result.error) return result.error;

    const newOwnerId = result.data.new_owner_id;

    if (newOwnerId === user.id) {
      return NextResponse.json(
        { error: "You are already the owner" },
        { status: 400 },
      );
    }

    // Verify new owner is a member
    const { data: newOwnerMembership } = await supabase
      .from("household_member")
      .select("id")
      .eq("household_id", household.id)
      .eq("user_id", newOwnerId)
      .single();

    if (!newOwnerMembership) {
      return NextResponse.json(
        { error: "User is not a member of this household" },
        { status: 400 },
      );
    }

    // Update household owner
    const { error: updateError } = await supabase
      .from("household")
      .update({ owner_id: newOwnerId })
      .eq("id", household.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to transfer ownership" },
        { status: 500 },
      );
    }

    // Swap roles: new owner becomes "owner", old owner becomes "member"
    await supabase
      .from("household_member")
      .update({ role: "owner" as const })
      .eq("household_id", household.id)
      .eq("user_id", newOwnerId);

    await supabase
      .from("household_member")
      .update({ role: "member" as const })
      .eq("household_id", household.id)
      .eq("user_id", user.id);

    return NextResponse.json({ data: { transferred: true } });
  },
);

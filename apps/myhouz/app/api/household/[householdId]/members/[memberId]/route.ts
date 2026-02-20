import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const PATCH = withHouseholdAuth(
  async (request, { household, membership, user, supabase }, params) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const memberId = params.memberId;
    if (!memberId) {
      return NextResponse.json(
        { error: "Missing memberId" },
        { status: 400 },
      );
    }

    let body: { role?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (body.role !== "owner" && body.role !== "member") {
      return NextResponse.json(
        { error: "Validation failed", details: { role: ["Must be 'owner' or 'member'"] } },
        { status: 400 },
      );
    }

    // Cannot change own role
    const { data: targetMember } = await supabase
      .from("household_member")
      .select("user_id")
      .eq("id", memberId)
      .eq("household_id", household.id)
      .single();

    if (!targetMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 },
      );
    }

    if (targetMember.user_id === user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("household_member")
      .update({ role: body.role })
      .eq("id", memberId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to change role" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { memberId, role: body.role } });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, membership, user, supabase }, params) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const memberId = params.memberId;
    if (!memberId) {
      return NextResponse.json(
        { error: "Missing memberId" },
        { status: 400 },
      );
    }

    // Cannot remove self
    const { data: targetMember } = await supabase
      .from("household_member")
      .select("user_id")
      .eq("id", memberId)
      .eq("household_id", household.id)
      .single();

    if (!targetMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 },
      );
    }

    if (targetMember.user_id === user.id) {
      return NextResponse.json(
        { error: "Cannot remove yourself" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("household_member")
      .delete()
      .eq("id", memberId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to remove member" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { deleted: true } });
  },
);

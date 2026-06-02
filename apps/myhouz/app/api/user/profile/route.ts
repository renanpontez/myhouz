import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateProfileSchema, type TablesUpdate } from "@home/types";
import { createAdminClient } from "@home/db";

export const GET = withAuth(async (_request, { user, supabase }) => {
  const { data: profile, error } = await supabase
    .from("profile")
    .select("id, name, email, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: profile });
});

export const PATCH = withAuth(async (request, { user, supabase }) => {
  const schema = createUpdateProfileSchema(apiTranslator);
  const result = await parseJsonBody(request, schema);
  if (result.error) return result.error;

  const updateData: TablesUpdate<"profile"> = {};
  if (result.data.name !== undefined) updateData.name = result.data.name;
  if (result.data.avatar_url !== undefined) updateData.avatar_url = result.data.avatar_url;

  const { data: profile, error } = await supabase
    .from("profile")
    .update(updateData)
    .eq("id", user.id)
    .select("id, name, email, avatar_url, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: profile });
});

export const DELETE = withAuth(async (_request, { user, supabase }) => {
  // Handle owned households automatically
  const { data: ownedHouseholds } = await supabase
    .from("household")
    .select("id")
    .eq("owner_id", user.id);

  for (const household of ownedHouseholds ?? []) {
    const { count } = await supabase
      .from("household_member")
      .select("id", { count: "exact", head: true })
      .eq("household_id", household.id)
      .neq("user_id", user.id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: "Transfer household ownership before deleting your account" },
        { status: 400 },
      );
    }

    // Sole member — delete the household (cascades to members, items, etc.)
    await supabase.from("household").delete().eq("id", household.id);
  }

  // Remove any remaining memberships (non-owned households)
  await supabase
    .from("household_member")
    .delete()
    .eq("user_id", user.id);

  // Delete profile
  await supabase
    .from("profile")
    .delete()
    .eq("id", user.id);

  // Delete auth user via admin client
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
});

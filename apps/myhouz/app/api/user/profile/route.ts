import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateProfileSchema } from "@home/types";
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

  const updateData: Record<string, unknown> = {};
  if (result.data.name !== undefined) updateData.name = result.data.name;

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
  // Check user doesn't own any households
  const { data: ownedHouseholds } = await supabase
    .from("household")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1);

  if (ownedHouseholds && ownedHouseholds.length > 0) {
    return NextResponse.json(
      { error: "Transfer household ownership before deleting your account" },
      { status: 400 },
    );
  }

  // Remove memberships
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

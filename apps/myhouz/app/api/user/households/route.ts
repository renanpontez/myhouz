import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createHouseholdSchema } from "@home/types";

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

export const POST = withAuth(async (request, { user, supabase }) => {
  const schema = createHouseholdSchema(apiTranslator);
  const result = await parseJsonBody(request, schema);
  if (result.error) return result.error;

  const { error: insertError } = await supabase
    .from("household")
    .insert({ name: result.data.name, owner_id: user.id });

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to create household" },
      { status: 500 },
    );
  }

  // Trigger auto-adds owner as member — query the new household
  const { data: household, error: selectError } = await supabase
    .from("household")
    .select("id, name, owner_id, created_at, updated_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (selectError || !household) {
    return NextResponse.json(
      { error: "Failed to create household" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: household }, { status: 201 });
});

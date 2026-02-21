import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUrgentProblemSchema } from "@home/types";
import { notifyHouseholdMembers } from "@/lib/notifications";

export const GET = withHouseholdAuth(
  async (request, { household, supabase }) => {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    let query = supabase
      .from("urgent_problem")
      .select(
        "id, title, description, reported_by, is_active, resolved_at, resolved_by, created_at",
      )
      .eq("household_id", household.id)
      .order("created_at", { ascending: false });

    if (active === "true") {
      query = query.eq("is_active", true);
    } else if (active === "false") {
      query = query.eq("is_active", false);
    }

    const { data: problems, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch urgent problems" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: problems });
  },
);

export const POST = withHouseholdAuth(
  async (request, { household, user, supabase }) => {
    const schema = createUrgentProblemSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const { data: profile } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user.id)
      .single();

    const profileId = profile?.id ?? user.id;

    const { data: problem, error } = await supabase
      .from("urgent_problem")
      .insert({
        household_id: household.id,
        title: result.data.title,
        description: result.data.description,
        reported_by: profileId,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create urgent problem" },
        { status: 500 },
      );
    }

    await notifyHouseholdMembers({
      supabase,
      householdId: household.id,
      excludeUserId: profileId,
      type: "urgent_problem_reported",
      title: result.data.title,
      referenceId: problem.id,
      referenceType: "urgent_problem",
    });

    return NextResponse.json({ data: problem }, { status: 201 });
  },
);

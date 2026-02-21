import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateUrgentProblemSchema } from "@home/types";
import { notifyHouseholdMembers } from "@/lib/notifications";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const problemId = params.problemId!;

    const { data: problem, error } = await supabase
      .from("urgent_problem")
      .select(
        "id, title, description, reported_by, is_active, resolved_at, resolved_by, created_at, updated_at",
      )
      .eq("id", problemId)
      .eq("household_id", household.id)
      .single();

    if (error || !problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: problem });
  },
);

export const PATCH = withHouseholdAuth(
  async (request, { household, user, supabase }, params) => {
    const problemId = params.problemId!;

    const body = await request.clone().json().catch(() => ({}));

    // Handle resolve via is_active: false
    if (body.is_active === false) {
      const { data: profile } = await supabase
        .from("profile")
        .select("id")
        .eq("id", user.id)
        .single();

      const profileId = profile?.id ?? user.id;

      const { data: existing } = await supabase
        .from("urgent_problem")
        .select("title")
        .eq("id", problemId)
        .eq("household_id", household.id)
        .single();

      const { data: problem, error } = await supabase
        .from("urgent_problem")
        .update({
          is_active: false,
          resolved_at: new Date().toISOString(),
          resolved_by: profileId,
        })
        .eq("id", problemId)
        .eq("household_id", household.id)
        .select()
        .single();

      if (error || !problem) {
        return NextResponse.json(
          { error: "Failed to resolve problem" },
          { status: 500 },
        );
      }

      await notifyHouseholdMembers({
        supabase,
        householdId: household.id,
        excludeUserId: profileId,
        type: "urgent_problem_resolved",
        title: existing?.title ?? "Problem resolved",
        referenceId: problemId,
        referenceType: "urgent_problem",
      });

      return NextResponse.json({ data: problem });
    }

    // Handle title/description update
    const schema = createUpdateUrgentProblemSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const updateData: Record<string, unknown> = {};
    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.description !== undefined)
      updateData.description = result.data.description;

    const { data: problem, error } = await supabase
      .from("urgent_problem")
      .update(updateData)
      .eq("id", problemId)
      .eq("household_id", household.id)
      .select()
      .single();

    if (error || !problem) {
      return NextResponse.json(
        { error: "Failed to update problem" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: problem });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, user, supabase }, params) => {
    const problemId = params.problemId!;

    // Only the reporter can delete
    const { data: problem } = await supabase
      .from("urgent_problem")
      .select("reported_by")
      .eq("id", problemId)
      .eq("household_id", household.id)
      .single();

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 },
      );
    }

    if (problem.reported_by !== user.id) {
      return NextResponse.json(
        { error: "Only the reporter can delete this problem" },
        { status: 403 },
      );
    }

    const { error } = await supabase
      .from("urgent_problem")
      .delete()
      .eq("id", problemId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete problem" },
        { status: 500 },
      );
    }

    return new NextResponse(null, { status: 204 });
  },
);

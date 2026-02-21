import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateReminderSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const reminderId = params.reminderId!;

    const { data: reminder, error } = await supabase
      .from("reminder")
      .select(
        "id, title, due_at, assigned_to, created_by, is_completed, completed_at, completed_by, created_at, updated_at",
      )
      .eq("id", reminderId)
      .eq("household_id", household.id)
      .single();

    if (error || !reminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: reminder });
  },
);

export const PATCH = withHouseholdAuth(
  async (request, { household, supabase }, params) => {
    const reminderId = params.reminderId!;

    const schema = createUpdateReminderSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const updateData: Record<string, unknown> = {};
    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.due_at !== undefined) updateData.due_at = result.data.due_at;
    if (result.data.assigned_to !== undefined)
      updateData.assigned_to = result.data.assigned_to;

    const { data: reminder, error } = await supabase
      .from("reminder")
      .update(updateData)
      .eq("id", reminderId)
      .eq("household_id", household.id)
      .select()
      .single();

    if (error || !reminder) {
      return NextResponse.json(
        { error: "Failed to update reminder" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: reminder });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const reminderId = params.reminderId!;

    const { error } = await supabase
      .from("reminder")
      .delete()
      .eq("id", reminderId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete reminder" },
        { status: 500 },
      );
    }

    return new NextResponse(null, { status: 204 });
  },
);

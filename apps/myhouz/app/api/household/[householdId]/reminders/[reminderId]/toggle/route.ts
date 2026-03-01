import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const POST = withHouseholdAuth(
  async (_request, { user, household, supabase }, params) => {
    const reminderId = params.reminderId;

    if (!reminderId) {
      return NextResponse.json({ error: "Missing reminderId" }, { status: 400 });
    }

    const { data: reminder } = await supabase
      .from("reminder")
      .select("is_completed")
      .eq("id", reminderId)
      .eq("household_id", household.id)
      .single();

    if (!reminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 },
      );
    }

    const nowCompleted = !reminder.is_completed;

    const { data: updated, error } = await supabase
      .from("reminder")
      .update({
        is_completed: nowCompleted,
        completed_at: nowCompleted ? new Date().toISOString() : null,
        completed_by: nowCompleted ? user.id : null,
      })
      .eq("id", reminderId)
      .eq("household_id", household.id)
      .select(
        "id, title, due_at, is_completed, completed_at, completed_by, assigned_to, created_by, household_id, created_at, updated_at",
      )
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to toggle reminder" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: updated });
  },
);

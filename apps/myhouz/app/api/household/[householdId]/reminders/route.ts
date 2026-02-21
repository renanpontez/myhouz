import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createReminderSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (request, { household, supabase }) => {
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get("completed");

    let query = supabase
      .from("reminder")
      .select(
        "id, title, due_at, assigned_to, created_by, is_completed, completed_at, completed_by, created_at",
      )
      .eq("household_id", household.id)
      .order("due_at", { ascending: true });

    if (completed === "true") {
      query = query.eq("is_completed", true);
    } else if (completed === "false") {
      query = query.eq("is_completed", false);
    }

    const { data: reminders, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch reminders" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: reminders });
  },
);

export const POST = withHouseholdAuth(
  async (request, { household, user, supabase }) => {
    const schema = createReminderSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const { data: profile } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user.id)
      .single();

    const { data: reminder, error } = await supabase
      .from("reminder")
      .insert({
        household_id: household.id,
        title: result.data.title,
        due_at: result.data.due_at,
        assigned_to: result.data.assigned_to ?? null,
        created_by: profile?.id ?? user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create reminder" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: reminder }, { status: 201 });
  },
);

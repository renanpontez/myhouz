import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateHouseholdSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (_request, { household, membership }) => {
    return NextResponse.json({
      data: { household, membership },
    });
  },
);

export const PATCH = withHouseholdAuth(
  async (request, { household, membership, supabase }) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const schema = createUpdateHouseholdSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const { error } = await supabase
      .from("household")
      .update({ name: result.data.name })
      .eq("id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update household" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: { ...household, name: result.data.name },
    });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, membership, supabase }) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { count } = await supabase
      .from("household_member")
      .select("id", { count: "exact", head: true })
      .eq("household_id", household.id);

    if (count && count > 1) {
      return NextResponse.json(
        { error: "Cannot delete household with other members" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("household")
      .delete()
      .eq("id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete household" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { deleted: true } });
  },
);

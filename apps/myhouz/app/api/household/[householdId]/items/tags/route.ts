import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }) => {
    const { data: items, error } = await supabase
      .from("household_item")
      .select("tags")
      .eq("household_id", household.id)
      .not("tags", "eq", "{}");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch tags" },
        { status: 500 },
      );
    }

    const tagSet = new Set<string>();
    for (const item of items ?? []) {
      if (item.tags) {
        for (const tag of item.tags) {
          tagSet.add(tag);
        }
      }
    }

    const tags = Array.from(tagSet).sort();
    return NextResponse.json({ data: tags });
  },
);

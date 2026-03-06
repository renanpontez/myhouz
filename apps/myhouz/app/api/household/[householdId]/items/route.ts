export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createItemSchema } from "@home/types";
import type { Database } from "@home/types";

type ItemStatus = Database["public"]["Enums"]["item_status"];
type ItemType = Database["public"]["Enums"]["item_type"];

export const GET = withHouseholdAuth(
  async (request, { household, supabase }) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    let query = supabase
      .from("household_item")
      .select(
        "id, name, type, priority, status, assigned_to, notes, price, photos, link, tags, icon, added_by, created_at, resolved_at",
      )
      .eq("household_id", household.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status as ItemStatus);
    }
    if (type) {
      query = query.eq("type", type as ItemType);
    }
    if (tag) {
      query = query.contains("tags", [tag]);
    }
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: items, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch items" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: items });
  },
);

export const POST = withHouseholdAuth(
  async (request, { household, user, supabase }) => {
    const schema = createItemSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const { data: profile } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user.id)
      .single();

    const { data: item, error } = await supabase
      .from("household_item")
      .insert({
        household_id: household.id,
        name: result.data.name,
        type: result.data.type,
        priority: result.data.priority,
        assigned_to: result.data.assigned_to ?? null,
        notes: result.data.notes ?? null,
        price: result.data.price ?? null,
        photos: result.data.photos ?? [],
        link: result.data.link || null,
        tags: result.data.tags ?? [],
        icon: result.data.icon ?? null,
        added_by: profile?.id ?? user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create item" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: item }, { status: 201 });
  },
);

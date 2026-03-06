import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createUpdateItemSchema } from "@home/types";

export const GET = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const itemId = params.itemId!;

    const { data: item, error } = await supabase
      .from("household_item")
      .select(
        "id, name, type, priority, status, assigned_to, notes, price, photos, link, tags, icon, added_by, created_at, resolved_at, updated_at",
      )
      .eq("id", itemId)
      .eq("household_id", household.id)
      .single();

    if (error || !item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  },
);

export const PATCH = withHouseholdAuth(
  async (request, { household, supabase }, params) => {
    const itemId = params.itemId!;

    const schema = createUpdateItemSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const updateData: Record<string, unknown> = {};
    if (result.data.name !== undefined) updateData.name = result.data.name;
    if (result.data.type !== undefined) updateData.type = result.data.type;
    if (result.data.priority !== undefined)
      updateData.priority = result.data.priority;
    if (result.data.status !== undefined)
      updateData.status = result.data.status;
    if (result.data.assigned_to !== undefined)
      updateData.assigned_to = result.data.assigned_to;
    if (result.data.notes !== undefined) updateData.notes = result.data.notes;
    if (result.data.price !== undefined) updateData.price = result.data.price;
    if (result.data.photos !== undefined)
      updateData.photos = result.data.photos;
    if (result.data.link !== undefined) updateData.link = result.data.link;
    if (result.data.tags !== undefined) updateData.tags = result.data.tags;
    if (result.data.icon !== undefined) updateData.icon = result.data.icon;

    const { data: item, error } = await supabase
      .from("household_item")
      .update(updateData)
      .eq("id", itemId)
      .eq("household_id", household.id)
      .select()
      .single();

    if (error || !item) {
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: item });
  },
);

export const DELETE = withHouseholdAuth(
  async (_request, { household, supabase }, params) => {
    const itemId = params.itemId!;

    // Fetch photos for storage cleanup
    const { data: item } = await supabase
      .from("household_item")
      .select("photos")
      .eq("id", itemId)
      .eq("household_id", household.id)
      .single();

    const { error } = await supabase
      .from("household_item")
      .delete()
      .eq("id", itemId)
      .eq("household_id", household.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete item" },
        { status: 500 },
      );
    }

    // Best-effort storage cleanup
    if (item?.photos && item.photos.length > 0) {
      const paths = item.photos
        .map((url: string) => {
          const match = url.match(/item-images\/(.+)$/);
          return match?.[1];
        })
        .filter(Boolean) as string[];

      if (paths.length > 0) {
        await supabase.storage.from("item-images").remove(paths);
      }
    }

    return new NextResponse(null, { status: 204 });
  },
);

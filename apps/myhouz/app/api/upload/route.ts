import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@home/db";
import { nanoid } from "nanoid";

const ALLOWED_BUCKETS = ["item-images"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const bucket = (formData.get("bucket") as string) || "item-images";
    const householdId = formData.get("householdId") as string;

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    if (!householdId) {
      return NextResponse.json(
        { error: "Missing householdId" },
        { status: 400 },
      );
    }

    // Verify membership
    const { data: membership } = await supabase
      .from("household_member")
      .select("id")
      .eq("household_id", householdId)
      .eq("user_id", session.user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}` },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max: 10MB` },
          { status: 400 },
        );
      }
    }

    const urls: string[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `${householdId}/${session.user.id}/${timestamp}-${nanoid(8)}.${extension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}` },
          { status: 500 },
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      urls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({ data: { urls } });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 },
    );
  }
}

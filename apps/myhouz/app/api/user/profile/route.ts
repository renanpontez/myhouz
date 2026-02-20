import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";

export const GET = withAuth(async (_request, { user, supabase }) => {
  const { data: profile, error } = await supabase
    .from("profile")
    .select("id, name, email, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: profile });
});

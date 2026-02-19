import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@home/db";

export async function GET() {
  const supabase = createRouteHandlerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return NextResponse.json({ session });
}

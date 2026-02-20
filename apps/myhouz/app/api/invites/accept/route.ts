import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/api-middleware";
import { parseJsonBody } from "@/lib/api-helpers";

const acceptInviteSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const POST = withAuth(async (request, { supabase }) => {
  const result = await parseJsonBody(request, acceptInviteSchema);
  if (result.error) return result.error;

  const { data, error } = await supabase.rpc("accept_invite", {
    p_invite_code: result.data.code,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 400 },
    );
  }

  const rpcResult = data as { household_id?: string } | null;
  const householdId = rpcResult?.household_id;

  if (!householdId) {
    return NextResponse.json(
      { error: "Invalid or expired invite" },
      { status: 400 },
    );
  }

  return NextResponse.json({ data: { householdId } });
});

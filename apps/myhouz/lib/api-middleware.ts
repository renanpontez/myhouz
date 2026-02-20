import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@home/db";
import type { Household, HouseholdMember } from "@home/types";

interface UserAuthContext {
  user: { id: string; email?: string };
  supabase: ReturnType<typeof createRouteHandlerClient>;
}

type UserRouteHandler = (
  request: NextRequest,
  context: UserAuthContext,
  params: Record<string, string>,
) => Promise<NextResponse>;

/**
 * Auth middleware without household scoping.
 * Used for routes like /api/user/households that only need a valid session.
 */
export function withAuth(handler: UserRouteHandler) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    const supabase = createRouteHandlerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;

    return handler(
      request,
      {
        user: session.user,
        supabase,
      },
      resolvedParams,
    );
  };
}

interface AuthContext {
  user: { id: string; email?: string };
  household: Household;
  membership: HouseholdMember;
  supabase: ReturnType<typeof createRouteHandlerClient>;
}

type RouteHandler = (
  request: NextRequest,
  context: AuthContext,
  params: Record<string, string>,
) => Promise<NextResponse>;

export function withHouseholdAuth(handler: RouteHandler) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    const supabase = createRouteHandlerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const householdId = resolvedParams.householdId;

    if (!householdId) {
      return NextResponse.json(
        { error: "Missing householdId" },
        { status: 400 },
      );
    }

    const { data: membership } = await supabase
      .from("household_member")
      .select()
      .eq("household_id", householdId)
      .eq("user_id", session.user.id)
      .single();

    if (!membership)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: household } = await supabase
      .from("household")
      .select()
      .eq("id", householdId)
      .single();

    if (!household)
      return NextResponse.json(
        { error: "Household not found" },
        { status: 404 },
      );

    return handler(
      request,
      {
        user: session.user,
        household,
        membership,
        supabase,
      },
      resolvedParams,
    );
  };
}

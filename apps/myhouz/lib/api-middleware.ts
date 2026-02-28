import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@home/db";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@home/types";
import type { Household, HouseholdMember } from "@home/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type TypedSupabaseClient = SupabaseClient<Database>;

interface UserAuthContext {
  user: { id: string; email?: string };
  supabase: TypedSupabaseClient;
}

type UserRouteHandler = (
  request: NextRequest,
  context: UserAuthContext,
  params: Record<string, string>,
) => Promise<NextResponse>;

/**
 * Extract Bearer token from Authorization header.
 */
function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/**
 * Create a Supabase client authenticated with a Bearer token (for mobile clients).
 */
function createTokenClient(token: string): TypedSupabaseClient {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    },
  );
}

/**
 * Resolve the authenticated user from either Bearer token or cookie session.
 * Returns the user and a properly authenticated Supabase client.
 */
async function resolveAuth(
  request: NextRequest,
): Promise<
  | { user: { id: string; email?: string }; supabase: TypedSupabaseClient }
  | { error: NextResponse }
> {
  const token = getBearerToken(request);

  if (token) {
    // Mobile/API client: validate Bearer token
    const supabase = createTokenClient(token);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    return { user, supabase };
  }

  // Web client: use cookie-based session
  const supabase = createRouteHandlerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user: session.user, supabase };
}

/**
 * Auth middleware without household scoping.
 * Used for routes like /api/user/households that only need a valid session.
 */
export function withAuth(handler: UserRouteHandler) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    const auth = await resolveAuth(request);
    if ("error" in auth) return auth.error;

    const resolvedParams = await params;

    return handler(request, { user: auth.user, supabase: auth.supabase }, resolvedParams);
  };
}

interface AuthContext {
  user: { id: string; email?: string };
  household: Household;
  membership: HouseholdMember;
  supabase: TypedSupabaseClient;
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
    const auth = await resolveAuth(request);
    if ("error" in auth) return auth.error;

    const { user, supabase } = auth;
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
      .eq("user_id", user.id)
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
        user,
        household,
        membership,
        supabase,
      },
      resolvedParams,
    );
  };
}

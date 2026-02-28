import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { handlePreflight, setCorsHeaders } from "@/lib/cors";

const PUBLIC_ROUTE_PREFIXES = ["/login", "/signup", "/invite", "/auth/callback"];

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight for API routes
  if (pathname.startsWith("/api/") && request.method === "OPTIONS") {
    return handlePreflight(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublicRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const inviteCode = request.nextUrl.searchParams.get("invite");
    if (inviteCode) {
      return NextResponse.redirect(new URL(`/invite/${inviteCode}`, request.url));
    }
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  // Auto-set activeHouseholdId cookie if missing on household routes
  if (user && pathname.startsWith("/app/") && !pathname.startsWith("/app/onboarding")) {
    const activeId = request.cookies.get("activeHouseholdId")?.value;
    if (!activeId) {
      const { data: memberships } = await supabase
        .from("household_member")
        .select("household_id")
        .eq("user_id", user.id)
        .limit(1);

      const firstId = memberships?.[0]?.household_id;
      if (firstId) {
        response.cookies.set("activeHouseholdId", firstId, {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
    }
  }

  // Add CORS headers to API responses
  if (pathname.startsWith("/api/")) {
    setCorsHeaders(response, request);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

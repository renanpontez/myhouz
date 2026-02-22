import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@home/db";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const invite = searchParams.get("invite");
  const next = searchParams.get("next");

  if (code) {
    const supabase = createRouteHandlerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If invite code, redirect to accept it
      if (invite) {
        return NextResponse.redirect(`${origin}/invite/${invite}`);
      }

      // If explicit next URL, go there
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Check if user has any households
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: memberships } = await supabase
          .from("household_member")
          .select("household_id")
          .eq("user_id", user.id)
          .limit(1);

        if (!memberships || memberships.length === 0) {
          return NextResponse.redirect(`${origin}/app/onboarding`);
        }

        const firstHouseholdId = memberships[0]?.household_id;
        const response = NextResponse.redirect(
          `${origin}/app/dashboard`,
        );
        if (firstHouseholdId) {
          response.cookies.set("activeHouseholdId", firstHouseholdId, {
          path: "/",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
          });
        }
        return response;
      }

      return NextResponse.redirect(`${origin}/app/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

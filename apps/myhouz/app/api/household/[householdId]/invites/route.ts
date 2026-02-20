import { NextResponse } from "next/server";
import { withHouseholdAuth } from "@/lib/api-middleware";
import { parseJsonBody, apiTranslator } from "@/lib/api-helpers";
import { createGenerateInviteSchema } from "@home/types";
import { nanoid } from "nanoid";

export const GET = withHouseholdAuth(
  async (_request, { household, membership, supabase }) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: invites, error } = await supabase
      .from("household_invite")
      .select("id, code, email, role, status, expires_at, created_at")
      .eq("household_id", household.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch invites" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: invites });
  },
);

export const POST = withHouseholdAuth(
  async (request, { household, membership, user, supabase }) => {
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const schema = createGenerateInviteSchema(apiTranslator);
    const result = await parseJsonBody(request, schema);
    if (result.error) return result.error;

    const code = nanoid(12);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Get profile for invite email
    const { data: profile } = await supabase
      .from("profile")
      .select("id, name")
      .eq("id", user.id)
      .single();

    const invitedBy = profile?.id ?? user.id;

    const { error: insertError } = await supabase
      .from("household_invite")
      .insert({
        household_id: household.id,
        invited_by: invitedBy,
        code,
        email: result.data.email || null,
        role: result.data.role,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to generate invite" },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const inviteUrl = `${appUrl}/invite/${code}`;

    // Send email if provided
    if (result.data.email) {
      try {
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "myhouz <noreply@myhouz.app>",
              to: [result.data.email],
              subject: "You've been invited to join a household on myhouz",
              html: `<p>${profile?.name ?? "Someone"} invited you to join their household on myhouz.</p><p><a href="${inviteUrl}">Accept invite</a></p><p>This invite expires in 7 days.</p>`,
            }),
          });
        }
      } catch {
        // Email sending is best-effort
        console.error("Failed to send invite email");
      }
    }

    return NextResponse.json(
      { data: { code, inviteUrl } },
      { status: 201 },
    );
  },
);

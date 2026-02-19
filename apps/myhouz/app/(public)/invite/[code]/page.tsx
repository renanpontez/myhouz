import Link from "next/link";
import { createAdminClient } from "@home/db";
import { getSession } from "@home/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AcceptInviteButton } from "@/components/auth/AcceptInviteButton";
import { Users } from "lucide-react";

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const supabase = createAdminClient();

  // Fetch invite details (bypass RLS via admin client)
  const { data: invite } = await supabase
    .from("household_invite")
    .select("id, household_id, invited_by, status, expires_at")
    .eq("code", code)
    .single();

  // Invalid or not found
  if (!invite) {
    return (
      <AuthCard title="Convite invalido">
        <p className="text-center text-sm text-muted-foreground">
          Este convite nao existe ou ja foi utilizado.
        </p>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Ir para o login
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Expired or not pending
  const isExpired = invite.status !== "pending" || new Date(invite.expires_at) < new Date();
  if (isExpired) {
    return (
      <AuthCard title="Convite expirado">
        <p className="text-center text-sm text-muted-foreground">
          Este convite ja expirou ou foi revogado. Peca um novo convite ao dono da casa.
        </p>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Ir para o login
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Fetch household details
  const { data: household } = await supabase
    .from("household")
    .select("id, name")
    .eq("id", invite.household_id)
    .single();

  // Fetch inviter name
  const { data: inviter } = await supabase
    .from("profile")
    .select("name")
    .eq("id", invite.invited_by)
    .single();

  // Count members
  const { count: memberCount } = await supabase
    .from("household_member")
    .select("id", { count: "exact", head: true })
    .eq("household_id", invite.household_id);

  const householdName = household?.name ?? "Casa";
  const inviterName = inviter?.name ?? "Alguem";

  // Check if user is authenticated
  const session = await getSession();

  return (
    <AuthCard
      title="Voce foi convidado!"
      subtitle={`${inviterName} convidou voce para entrar em ${householdName}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{memberCount ?? 0} {(memberCount ?? 0) === 1 ? "membro" : "membros"}</span>
        </div>

        {session ? (
          <AcceptInviteButton code={code} />
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Entre ou crie uma conta para aceitar o convite
            </p>
            <div className="flex gap-3">
              <Link
                href={`/login?invite=${code}`}
                className="flex-1 rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-accent"
              >
                Entrar
              </Link>
              <Link
                href={`/signup?invite=${code}`}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Criar conta
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthCard>
  );
}

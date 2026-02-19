import { redirect } from "next/navigation";
import { getUser } from "@home/auth";
import { UserProvider } from "@home/auth";
import { createServerClient } from "@home/db";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const supabase = createServerClient();
  const { count } = await supabase
    .from("household_member")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!count || count === 0) {
    redirect("/app/onboarding");
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}

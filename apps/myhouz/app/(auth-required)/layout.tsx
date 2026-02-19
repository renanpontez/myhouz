import { getUser } from "@home/auth";
import { UserProvider } from "@home/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return <UserProvider user={user}>{children}</UserProvider>;
}

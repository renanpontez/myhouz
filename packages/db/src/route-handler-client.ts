import { createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@home/types";

export function createRouteHandlerClient() {
  const cookieStore = cookies();

  const cookieMethods: CookieMethodsServer = {
    async getAll() {
      return (await cookieStore).getAll();
    },
    async setAll(cookiesToSet) {
      const store = await cookieStore;
      for (const { name, value, options } of cookiesToSet) {
        store.set(name, value, options);
      }
    },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods },
  );
}

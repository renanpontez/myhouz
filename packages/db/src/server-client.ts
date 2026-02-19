import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@home/types";

export function createServerClient() {
  const cookieStore = cookies();

  const cookieMethods: CookieMethodsServer = {
    async getAll() {
      return (await cookieStore).getAll();
    },
    async setAll(cookiesToSet) {
      try {
        const store = await cookieStore;
        for (const { name, value, options } of cookiesToSet) {
          store.set(name, value, options);
        }
      } catch {
        // The `setAll` method is called from a Server Component.
        // This can be ignored if you have middleware refreshing sessions.
      }
    },
  };

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods },
  );
}

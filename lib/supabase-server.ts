import { createServerClient } from "@supabase/ssr";

/**
 * NOTE:
 * - This helper avoids Next.js cookies() typing differences across runtimes/build.
 * - For Route Handlers, prefer creating the server client with req/res cookies directly.
 */
export function supabaseServerNoCookies() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op
        },
      },
    }
  );
}

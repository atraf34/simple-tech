import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side client using the ANON key — safe for reading public catalog
 * data (products, categories, site_content) inside Server Components.
 * Never use this for writes that must bypass RLS; use admin.ts for that,
 * and only inside API route handlers.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

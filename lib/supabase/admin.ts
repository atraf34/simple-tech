import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. This bypasses Row Level Security entirely, so it
 * must NEVER be imported by a Client Component or exposed to the browser.
 * The `server-only` import above makes Next.js throw a build error if
 * anything client-side ever tries to pull this in by mistake.
 *
 * Used for: guest checkout order inserts, admin dashboard reads/writes,
 * warranty document uploads — anywhere the app itself (not an
 * individually-authenticated customer) needs to write data.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

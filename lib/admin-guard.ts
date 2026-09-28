import "server-only";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/**
 * Every /api/admin/* route calls this first. Verifies the signed session
 * cookie SERVER-SIDE and returns the service-role client, or an error
 * response to return immediately.
 */
export async function requireAdmin(req: Request) {
  const adminId = await verifyAdminToken(readCookie(req, ADMIN_COOKIE));
  if (!adminId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const db = getSupabaseAdminClient();
  if (!db) {
    return {
      error: NextResponse.json(
        { error: "Supabase সংযুক্ত নেই (SUPABASE_SERVICE_ROLE_KEY সেট করুন)" },
        { status: 503 }
      ),
    };
  }
  return { db, adminId };
}

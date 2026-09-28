import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { ADMIN_COOKIE, createAdminToken, cookieOptions } from "@/lib/admin-session";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const { phone, password } = await req.json().catch(() => ({}));
  const db = getSupabaseAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Supabase সংযুক্ত নেই" }, { status: 503 });
  }

  const cleanPhone = String(phone ?? "").replace(/\s+/g, "");
  const { data: admin } = await db
    .from("admin_users")
    .select("id, password_hash")
    .eq("phone", cleanPhone)
    .maybeSingle();

  // Always run a bcrypt compare (even for unknown phones) so timing doesn't
  // reveal which phone numbers are admins.
  const hash = admin?.password_hash ?? "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234";
  const ok = await bcrypt.compare(String(password ?? ""), hash);

  if (!admin || !ok) {
    await sleep(600); // slow down brute-forcing
    return NextResponse.json({ error: "ফোন নম্বর বা পাসওয়ার্ড ভুল" }, { status: 401 });
  }

  const token = await createAdminToken(admin.id);
  if (!token) {
    return NextResponse.json(
      { error: "ADMIN_SESSION_SECRET সেট করা নেই (কমপক্ষে ১৬ অক্ষর)" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions);
  return res;
}

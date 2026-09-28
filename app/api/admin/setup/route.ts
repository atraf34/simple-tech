import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * One-time creation of the FIRST admin. Disabled forever once any admin
 * exists. Also requires ADMIN_SETUP_KEY (an env var only you know), so a
 * stranger who finds this URL first still can't claim the panel.
 */
export async function POST(req: Request) {
  const { phone, password, setupKey } = await req.json().catch(() => ({}));
  const db = getSupabaseAdminClient();
  if (!db) return NextResponse.json({ error: "Supabase সংযুক্ত নেই" }, { status: 503 });

  const expected = process.env.ADMIN_SETUP_KEY;
  if (!expected || setupKey !== expected) {
    return NextResponse.json({ error: "Setup key ভুল" }, { status: 403 });
  }

  const { count } = await db.from("admin_users").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "অ্যাডমিন আগেই তৈরি হয়েছে" }, { status: 403 });
  }

  const cleanPhone = String(phone ?? "").replace(/\s+/g, "");
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
    return NextResponse.json({ error: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
  }
  if (String(password ?? "").length < 8) {
    return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(String(password), 10);
  const { error } = await db.from("admin_users").insert({ phone: cleanPhone, password_hash });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

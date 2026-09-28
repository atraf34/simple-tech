import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/** Logged-in customer changes password — must supply the CURRENT password. */
export async function POST(req: Request) {
  const db = getSupabaseAdminClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!db || !url || !anon) return NextResponse.json({ error: "সার্ভার কনফিগার করা নেই" }, { status: 503 });

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "আগে লগইন করুন" }, { status: 401 });
  const { data: u } = await db.auth.getUser(token);
  const user = u.user;
  if (!user?.email) return NextResponse.json({ error: "সেশন শেষ, আবার লগইন করুন" }, { status: 401 });

  const { oldPassword, newPassword } = await req.json().catch(() => ({}));
  if (!oldPassword || !newPassword) return NextResponse.json({ error: "পুরনো ও নতুন পাসওয়ার্ড দিন" }, { status: 400 });
  if (String(newPassword).length < 6) return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  if (oldPassword === newPassword) return NextResponse.json({ error: "নতুন পাসওয়ার্ড আগেরটির মতো হতে পারবে না" }, { status: 400 });

  // verify the old password with a throwaway client
  const verifier = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: badOld } = await verifier.auth.signInWithPassword({ email: user.email, password: oldPassword });
  if (badOld) return NextResponse.json({ error: "পুরনো পাসওয়ার্ড ভুল" }, { status: 403 });

  const { error } = await db.auth.admin.updateUserById(user.id, { password: newPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

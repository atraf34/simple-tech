import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCustomer } from "@/lib/customer-auth";

const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  // light per-IP throttle: 6 attempts / 10 min
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 6) return NextResponse.json({ error: "অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const db = getSupabaseAdminClient();
  if (!db) {
    return NextResponse.json(
      { error: "সার্ভার কনফিগার করা নেই (Vercel-এ SUPABASE_SERVICE_ROLE_KEY সেট করুন)" },
      { status: 503 },
    );
  }
  const b = await req.json().catch(() => ({}));
  const res = await createCustomer(db, { name: b.name, phone: b.phone, password: b.password });
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });
  return NextResponse.json({ ok: true });
}

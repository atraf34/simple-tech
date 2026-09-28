import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

const ALLOWED_KEYS = ["hero_banner", "marquee_offers"];

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const { data } = await guard.db.from("site_content").select("key, value").in("key", ALLOWED_KEYS);
  return NextResponse.json({ content: Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const { key, value } = await req.json().catch(() => ({}));
  if (!ALLOWED_KEYS.includes(key) || value === undefined) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const { error } = await guard.db
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

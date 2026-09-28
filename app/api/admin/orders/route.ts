import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeSearch } from "@/lib/admin-utils";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;

  const q = safeSearch(new URL(req.url).searchParams.get("q"));
  let query = guard.db.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (q) {
    query = query.or(`guest_phone.ilike.%${q}%,guest_name.ilike.%${q}%,order_number.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;

  const { id, status, adminNote } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    patch.status = status;
  }
  if (adminNote !== undefined) patch.admin_note = String(adminNote).slice(0, 2000);

  const { error } = await guard.db.from("orders").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeSearch } from "@/lib/admin-utils";
import { createCustomer } from "@/lib/customer-auth";

// readable, no look-alike characters (0/O, 1/l/I)
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
function tempPassword(len = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const q = safeSearch(new URL(req.url).searchParams.get("q"));
  let query = guard.db.from("customers").select("id, name, phone, created_at").order("created_at", { ascending: false }).limit(100);
  if (q) query = query.or(`phone.ilike.%${q}%,name.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ accounts: data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));

  if (b.action === "reset") {
    if (!b.id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });
    const password = String(b.password || "").length >= 6 ? String(b.password) : tempPassword();
    const { error } = await guard.db.auth.admin.updateUserById(b.id, { password });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, password });
  }

  if (b.action === "create") {
    const password = String(b.password || "").length >= 6 ? String(b.password) : tempPassword();
    const res = await createCustomer(guard.db, { name: b.name, phone: b.phone, password });
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });
    return NextResponse.json({ ok: true, password });
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });
  const { error } = await guard.db.auth.admin.deleteUser(b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

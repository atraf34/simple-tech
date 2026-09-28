import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { safeSearch } from "@/lib/admin-utils";

/**
 * "Clients" = everyone who ever ordered (matched by phone number), whether
 * or not they created an account. Search by phone or name.
 */
export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;

  const q = safeSearch(new URL(req.url).searchParams.get("q"));
  let query = guard.db.from("orders").select("*").order("created_at", { ascending: false }).limit(300);
  if (q) query = query.or(`guest_phone.ilike.%${q}%,guest_name.ilike.%${q}%`);
  const { data: orders, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: docs } = orderIds.length
    ? await guard.db.from("warranty_documents").select("*").in("order_id", orderIds)
    : { data: [] };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Client = { phone: string; name: string; orders: any[]; docs: any[]; total: number };
  const map = new Map<string, Client>();
  for (const o of orders ?? []) {
    const c: Client = map.get(o.guest_phone) ?? { phone: o.guest_phone, name: o.guest_name, orders: [], docs: [], total: 0 };
    c.orders.push(o);
    c.total += Number(o.total);
    c.docs.push(...(docs ?? []).filter((d) => d.order_id === o.id));
    map.set(o.guest_phone, c);
  }
  return NextResponse.json({ clients: Array.from(map.values()) });
}

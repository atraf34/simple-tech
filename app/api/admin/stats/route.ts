import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const db = guard.db;

  const [orders, products, cats, customers] = await Promise.all([
    db.from("orders").select("id, order_number, guest_name, total, status, created_at").order("created_at", { ascending: false }).limit(500),
    db.from("products").select("id, title, in_stock"),
    db.from("categories").select("slug"),
    db.from("customers").select("id", { count: "exact", head: true }),
  ]);

  const o = orders.data ?? [];
  const p = products.data ?? [];
  const today = new Date().toDateString();
  const byStatus: Record<string, number> = {};
  let revenue = 0;
  for (const x of o) {
    byStatus[x.status] = (byStatus[x.status] ?? 0) + 1;
    if (x.status !== "cancelled") revenue += Number(x.total) || 0;
  }
  return NextResponse.json({
    orders: o.length,
    todayOrders: o.filter((x) => new Date(x.created_at).toDateString() === today).length,
    revenue,
    byStatus,
    products: p.length,
    outOfStock: p.filter((x) => !x.in_stock).map((x) => ({ id: x.id, title: x.title })),
    categories: cats.data?.length ?? 0,
    customers: customers.count ?? 0,
    recent: o.slice(0, 6),
  });
}

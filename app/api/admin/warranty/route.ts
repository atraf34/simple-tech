import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

/** Attach an already-uploaded file URL to an order as a warranty/invoice document. */
export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;

  const { orderNumber, productName, fileUrl, warrantyExpiry } = await req.json().catch(() => ({}));
  if (!orderNumber || !productName || !fileUrl) {
    return NextResponse.json({ error: "অর্ডার নম্বর, প্রোডাক্ট নাম ও ফাইল দিন" }, { status: 400 });
  }

  const { data: order } = await guard.db
    .from("orders")
    .select("id, customer_id")
    .eq("order_number", String(orderNumber).trim())
    .maybeSingle();
  if (!order) return NextResponse.json({ error: "এই অর্ডার নম্বর পাওয়া যায়নি" }, { status: 404 });

  const { error } = await guard.db.from("warranty_documents").insert({
    order_id: order.id,
    customer_id: order.customer_id,
    product_name: productName,
    file_url: fileUrl,
    warranty_expiry: warrantyExpiry || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

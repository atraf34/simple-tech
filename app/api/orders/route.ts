import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getProductBySlug } from "@/lib/queries";
import { DELIVERY_FEES, calcDiscount, type DeliveryZone } from "@/lib/pricing";
import type { OrderItem, PaymentMethod } from "@/lib/types";

const PAYMENTS: PaymentMethod[] = ["bkash", "nagad", "rocket", "cod"];

function makeOrderNumber() {
  const t = Date.now().toString().slice(-6);
  const r = Math.floor(Math.random() * 90 + 10);
  return `RK-${t}${r}`;
}

/** Never trust prices from the browser — re-price every line from the catalog. */
async function repriceItems(items: OrderItem[]): Promise<OrderItem[]> {
  const out: OrderItem[] = [];
  for (const item of items) {
    const bundleMatch = item.slug.match(/^(.*)-bundle-(\d+)$/);
    const baseSlug = bundleMatch ? bundleMatch[1] : item.slug;
    const product = await getProductBySlug(baseSlug);
    if (!product) continue; // unknown product: drop it
    const price = bundleMatch
      ? product.bundleItems[Number(bundleMatch[2])]?.price
      : product.price;
    if (price === undefined) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.qty) || 1)));
    out.push({ slug: item.slug, title: item.title, price, qty });
  }
  return out;
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\s+/g, "");
  const address = String(body.address ?? "").trim();
  const zone = body.zone as DeliveryZone;
  const payment = body.payment as PaymentMethod;

  if (!name || !address) {
    return NextResponse.json({ error: "নাম ও ঠিকানা দিন" }, { status: 400 });
  }
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
    return NextResponse.json({ error: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
  }
  if (!(zone in DELIVERY_FEES) || !PAYMENTS.includes(payment)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = await repriceItems(Array.isArray(body.items) ? body.items : []);
  if (items.length === 0) {
    return NextResponse.json({ error: "কার্ট খালি" }, { status: 400 });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = calcDiscount(body.coupon, subtotal);
  const deliveryFee = DELIVERY_FEES[zone];
  const total = subtotal - discount + deliveryFee;
  const orderNumber = makeOrderNumber();

  const admin = getSupabaseAdminClient();
  if (!admin) {
    // Supabase not connected yet: demo mode — order isn't stored anywhere.
    return NextResponse.json({ orderNumber, total, demo: true });
  }

  // Link to a logged-in customer if a valid access token was sent
  let customerId: string | null = null;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (token) {
    const { data } = await admin.auth.getUser(token);
    customerId = data.user?.id ?? null;
  }

  const { error } = await admin.from("orders").insert({
    order_number: orderNumber,
    customer_id: customerId,
    guest_name: name,
    guest_phone: phone,
    delivery_address: address,
    delivery_zone: zone,
    delivery_fee: deliveryFee,
    items,
    subtotal,
    discount,
    total,
    payment_method: payment,
  });

  if (error) {
    console.error("order insert failed", error);
    return NextResponse.json({ error: "অর্ডার সেভ করা যায়নি, আবার চেষ্টা করুন" }, { status: 500 });
  }

  return NextResponse.json({ orderNumber, total });
}

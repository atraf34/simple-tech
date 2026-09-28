import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.db
    .from("products")
    .select("id, slug, sku, title, price, original_price, in_stock, youtube_url, image, category_slug, is_flash_deal")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (body.price !== undefined) patch.price = Number(body.price);
  if (body.originalPrice !== undefined) patch.original_price = body.originalPrice === "" ? null : Number(body.originalPrice);
  if (body.inStock !== undefined) patch.in_stock = Boolean(body.inStock);
  if (body.youtubeUrl !== undefined) patch.youtube_url = body.youtubeUrl || null;
  if (body.image !== undefined) patch.image = body.image;
  if (body.isFlashDeal !== undefined) patch.is_flash_deal = Boolean(body.isFlashDeal);
  if (body.title !== undefined) patch.title = String(body.title);

  const { error } = await guard.db.from("products").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.slug || !b.sku || !b.price) {
    return NextResponse.json({ error: "টাইটেল, slug, SKU ও দাম দিতে হবে" }, { status: 400 });
  }
  const { error } = await guard.db.from("products").insert({
    title: b.title,
    slug: String(b.slug).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    sku: b.sku,
    price: Number(b.price),
    original_price: b.originalPrice ? Number(b.originalPrice) : null,
    image: b.image || "",
    gallery: b.image ? [b.image] : [],
    category_slug: b.categorySlug || null,
    description: b.description || null,
    youtube_url: b.youtubeUrl || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

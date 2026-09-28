import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

/* eslint-disable @typescript-eslint/no-explicit-any */

const num = (v: any) => (v === "" || v === null || v === undefined ? null : Number(v));
const str = (v: any) => (v === "" || v === null || v === undefined ? null : String(v));
const arr = (v: any) => (Array.isArray(v) ? v : []);
const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

/** camelCase editor payload -> DB columns. Only keys present are written. */
function toRow(b: any) {
  const r: Record<string, unknown> = {};
  if (b.title !== undefined) r.title = String(b.title);
  if (b.slug !== undefined) r.slug = slugify(String(b.slug));
  if (b.sku !== undefined) r.sku = String(b.sku);
  if (b.description !== undefined) r.description = str(b.description);
  if (b.categorySlug !== undefined) r.category_slug = str(b.categorySlug);
  if (b.image !== undefined) r.image = b.image || "";
  if (b.gallery !== undefined) r.gallery = arr(b.gallery);
  if (b.price !== undefined) r.price = Number(b.price);
  if (b.originalPrice !== undefined) r.original_price = num(b.originalPrice);
  if (b.rating !== undefined) r.rating = Number(b.rating) || 0;
  if (b.reviews !== undefined) r.reviews = Math.max(0, Math.floor(Number(b.reviews) || 0));
  if (b.inStock !== undefined) r.in_stock = Boolean(b.inStock);
  if (b.badgeLabel !== undefined) r.badge_label = str(b.badgeLabel);
  if (b.badgeTone !== undefined) r.badge_tone = b.badgeLabel ? (b.badgeTone === "violet" ? "violet" : "emerald") : null;
  if (b.specs !== undefined) r.specs = arr(b.specs).map(String).filter(Boolean);
  if (b.specTable !== undefined) r.spec_table = arr(b.specTable).filter((x: any) => x?.label);
  if (b.pinout !== undefined) r.pinout = arr(b.pinout).filter((x: any) => x?.pin);
  if (b.bundleItems !== undefined)
    r.bundle_items = arr(b.bundleItems).filter((x: any) => x?.title).map((x: any) => ({ ...x, price: Number(x.price) || 0 }));
  if (b.youtubeUrl !== undefined) r.youtube_url = str(b.youtubeUrl);
  if (b.isFlashDeal !== undefined) r.is_flash_deal = Boolean(b.isFlashDeal);
  if (b.isKit !== undefined) r.is_kit = Boolean(b.isKit);
  if (b.kitLevel !== undefined) r.kit_level = str(b.kitLevel);
  if (b.kitTag !== undefined) r.kit_tag = str(b.kitTag);
  if (b.voltage !== undefined) r.voltage = str(b.voltage);
  if (b.bus !== undefined) r.bus = str(b.bus);
  return r;
}

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.db.from("products").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.slug || !b.sku || !b.price) {
    return NextResponse.json({ error: "টাইটেল, slug, SKU ও দাম দিতে হবে" }, { status: 400 });
  }
  const row = toRow(b);
  if (!row.gallery && b.image) row.gallery = [b.image];
  const { error } = await guard.db.from("products").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });
  const { error } = await guard.db.from("products").update(toRow(b)).eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return NextResponse.json({ error: "id দরকার" }, { status: 400 });
  const { error } = await guard.db.from("products").delete().eq("id", b.id);
  if (error) {
    return NextResponse.json(
      { error: "মোছা যায়নি (অর্ডারে ব্যবহৃত হতে পারে) — বদলে স্টক 'নেই' করে দিন। " + error.message },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true });
}

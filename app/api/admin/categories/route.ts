import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

const clean = (v: unknown) => String(v ?? "").trim();
const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const { data, error } = await guard.db
    .from("categories")
    .select("slug, label, icon, color, sort_order")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  const label = clean(b.label);
  const slug = slugify(clean(b.slug) || label);
  if (!label || !slug) {
    return NextResponse.json({ error: "নাম ও slug (ইংরেজি) দিতে হবে" }, { status: 400 });
  }
  const { data: last } = await guard.db
    .from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const { error } = await guard.db.from("categories").insert({
    slug, label,
    icon: clean(b.icon) || "layers",
    color: clean(b.color) || "emerald",
    sort_order: (last?.[0]?.sort_order ?? 0) + 1,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.slug) return NextResponse.json({ error: "slug দরকার" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (b.label !== undefined) patch.label = clean(b.label);
  if (b.icon !== undefined) patch.icon = clean(b.icon);
  if (b.color !== undefined) patch.color = clean(b.color);
  if (b.sortOrder !== undefined) patch.sort_order = Number(b.sortOrder);
  const { error } = await guard.db.from("categories").update(patch).eq("slug", b.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin(req);
  if ("error" in guard) return guard.error;
  const b = await req.json().catch(() => ({}));
  if (!b.slug) return NextResponse.json({ error: "slug দরকার" }, { status: 400 });
  // products stay, they just become uncategorised
  await guard.db.from("products").update({ category_slug: null }).eq("category_slug", b.slug);
  const { error } = await guard.db.from("categories").delete().eq("slug", b.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

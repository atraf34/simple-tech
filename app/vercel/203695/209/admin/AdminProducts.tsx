"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X, ImagePlus, Search } from "lucide-react";
import { formatBDT } from "@/lib/format";
import { api, uploadFile, input, area, btn, btnGhost, danger } from "./shared";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

const EMPTY = {
  title: "", slug: "", sku: "", description: "", categorySlug: "", image: "", gallery: [] as string[],
  price: "", originalPrice: "", rating: "0", reviews: "0", inStock: true, isFlashDeal: false,
  badgeLabel: "", badgeTone: "emerald", specs: "", specTable: [] as any[], pinout: [] as any[], bundleItems: [] as any[],
  youtubeUrl: "", isKit: false, kitLevel: "", kitTag: "", voltage: "", bus: "",
};

function fromRow(p: any) {
  return {
    ...EMPTY,
    id: p.id, title: p.title ?? "", slug: p.slug ?? "", sku: p.sku ?? "", description: p.description ?? "",
    categorySlug: p.category_slug ?? "", image: p.image ?? "", gallery: p.gallery ?? [],
    price: String(p.price ?? ""), originalPrice: p.original_price ? String(p.original_price) : "",
    rating: String(p.rating ?? 0), reviews: String(p.reviews ?? 0), inStock: p.in_stock, isFlashDeal: p.is_flash_deal,
    badgeLabel: p.badge_label ?? "", badgeTone: p.badge_tone ?? "emerald",
    specs: (p.specs ?? []).join(", "), specTable: p.spec_table ?? [], pinout: p.pinout ?? [], bundleItems: p.bundle_items ?? [],
    youtubeUrl: p.youtube_url ?? "", isKit: p.is_kit, kitLevel: p.kit_level ?? "", kitTag: p.kit_tag ?? "",
    voltage: p.voltage ?? "", bus: p.bus ?? "",
  };
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-body-sm text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}

function Rows({ title, rows, cols, onChange }: {
  title: string; rows: any[]; cols: { key: string; ph: string; type?: string }[]; onChange: (r: any[]) => void;
}) {
  return (
    <div className="sm:col-span-2 flex flex-col gap-2">
      <p className="text-body-sm font-medium">{title}</p>
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          {cols.map((c) => (
            <input key={c.key} type={c.type ?? "text"} className={input} placeholder={c.ph} value={r[c.key] ?? ""}
              onChange={(e) => onChange(rows.map((x, j) => (j === i ? { ...x, [c.key]: e.target.value } : x)))} />
          ))}
          <button type="button" aria-label="সরান" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="p-2 text-red-600"><X className="h-4 w-4" /></button>
        </div>
      ))}
      <button type="button" className="self-start text-body-sm text-cyan" onClick={() => onChange([...rows, {}])}>＋ সারি যোগ করুন</button>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setProducts((await api("/api/admin/products")).products); } catch (e: any) { setMsg(e.message); }
  }, []);
  useEffect(() => { load(); api("/api/admin/categories").then((r) => setCats(r.categories)).catch(() => {}); }, [load]);

  const shown = useMemo(() => products.filter((p) =>
    (!cat || (cat === "_none" ? !p.category_slug : p.category_slug === cat)) &&
    (!q || `${p.title} ${p.sku} ${p.slug}`.toLowerCase().includes(q.toLowerCase()))), [products, q, cat]);

  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

  async function upload(file: File, gallery = false) {
    setBusy(true);
    try {
      const url = await uploadFile(file, "products");
      gallery ? set({ gallery: [...form.gallery, url] }) : set({ image: url, gallery: form.gallery.length ? form.gallery : [url] });
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  }

  async function save() {
    const { id, ...rest } = form;
    const body = { ...rest, specs: form.specs.split(",").map((s: string) => s.trim()).filter(Boolean) };
    try {
      await api("/api/admin/products", id ? "PATCH" : "POST", id ? { id, ...body } : body);
      setMsg(id ? "আপডেট হয়েছে ✓" : "প্রোডাক্ট যোগ হয়েছে ✓");
      setForm(null);
      load();
    } catch (e: any) { setMsg(e.message); }
  }

  async function remove(p: any) {
    if (!confirm(`"${p.title}" স্থায়ীভাবে মুছবেন?`)) return;
    try { await api("/api/admin/products", "DELETE", { id: p.id }); setMsg("মুছে ফেলা হয়েছে ✓"); load(); }
    catch (e: any) { setMsg(e.message); }
  }

  async function quick(p: any, patch: any) {
    try { await api("/api/admin/products", "PATCH", { id: p.id, ...patch }); load(); } catch (e: any) { setMsg(e.message); }
  }

  /* -------- editor -------- */
  if (form) {
    return (
      <div className="glass-card rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-headline-sm">{form.id ? "প্রোডাক্ট এডিট" : "নতুন প্রোডাক্ট"}</h2>
          <button onClick={() => setForm(null)} className={btnGhost}>বাতিল</button>
        </div>
        {msg && <p className="text-body-sm text-red-600">{msg}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="নাম *"><input className={input} value={form.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="ক্যাটাগরি">
            <select className={input} value={form.categorySlug} onChange={(e) => set({ categorySlug: e.target.value })}>
              <option value="">— নেই —</option>
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="slug * (ইংরেজি, URL-এ থাকবে)"><input className={input} value={form.slug} onChange={(e) => set({ slug: e.target.value })} /></Field>
          <Field label="SKU *"><input className={input} value={form.sku} onChange={(e) => set({ sku: e.target.value })} /></Field>
          <Field label="দাম (৳) *"><input type="number" className={input} value={form.price} onChange={(e) => set({ price: e.target.value })} /></Field>
          <Field label="আগের দাম (ছাড় দেখাতে)"><input type="number" className={input} value={form.originalPrice} onChange={(e) => set({ originalPrice: e.target.value })} /></Field>
          <Field label="বিবরণ" wide><textarea rows={4} className={area} value={form.description} onChange={(e) => set({ description: e.target.value })} /></Field>

          <div className="sm:col-span-2 flex flex-wrap gap-5 text-body-md">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#059669]" checked={form.inStock} onChange={(e) => set({ inStock: e.target.checked })} /> ইন-স্টক</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#059669]" checked={form.isFlashDeal} onChange={(e) => set({ isFlashDeal: e.target.checked })} /> ফ্ল্যাশ ডিল</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#059669]" checked={form.isKit} onChange={(e) => set({ isKit: e.target.checked })} /> ইঞ্জিনিয়ারিং কিট</label>
          </div>

          {form.isKit && (
            <>
              <Field label="কিট লেভেল (যেমন: বিগিনার)"><input className={input} value={form.kitLevel} onChange={(e) => set({ kitLevel: e.target.value })} /></Field>
              <Field label="কিট ট্যাগ (যেমন: CSE / EEE)"><input className={input} value={form.kitTag} onChange={(e) => set({ kitTag: e.target.value })} /></Field>
            </>
          )}

          <div className="sm:col-span-2 flex flex-col gap-2">
            <p className="text-body-sm font-medium">ছবি</p>
            <div className="flex flex-wrap gap-2">
              {[form.image, ...form.gallery.filter((g: string) => g !== form.image)].filter(Boolean).map((u: string) => (
                <div key={u} className="relative h-20 w-20 rounded-md overflow-hidden border border-outline-soft">
                  <img src={u} alt="" className="h-full w-full object-cover" />
                  <button aria-label="সরান" className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white/90 flex items-center justify-center"
                    onClick={() => { const g = form.gallery.filter((x: string) => x !== u); set({ gallery: g, image: form.image === u ? g[0] ?? "" : form.image }); }}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 rounded-md border border-dashed border-outline flex flex-col items-center justify-center gap-1 text-label-mono-sm cursor-pointer text-on-surface-variant hover:border-mint">
                <ImagePlus className="h-5 w-5" />{busy ? "..." : "ছবি"}
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, !!form.image); e.target.value = ""; }} />
              </label>
            </div>
            <Field label="অথবা ছবির লিংক"><input className={input} value={form.image} onChange={(e) => set({ image: e.target.value })} placeholder="https://..." /></Field>
          </div>

          <Field label="স্পেক চিপ (কমা দিয়ে: 5V, I2C, 16MHz)" wide><input className={input} value={form.specs} onChange={(e) => set({ specs: e.target.value })} /></Field>
          <Field label="ভোল্টেজ"><input className={input} value={form.voltage} onChange={(e) => set({ voltage: e.target.value })} placeholder="3.3V / 5V / 12V" /></Field>
          <Field label="ইন্টারফেস"><input className={input} value={form.bus} onChange={(e) => set({ bus: e.target.value })} placeholder="I2C / SPI / GPIO / Analog" /></Field>
          <Field label="ব্যাজ লেখা (যেমন: বেস্টসেলার)"><input className={input} value={form.badgeLabel} onChange={(e) => set({ badgeLabel: e.target.value })} /></Field>
          <Field label="ব্যাজ রঙ">
            <select className={input} value={form.badgeTone} onChange={(e) => set({ badgeTone: e.target.value })}>
              <option value="emerald">সবুজ</option><option value="violet">ধূসর</option>
            </select>
          </Field>
          <Field label="রেটিং (০–৫)"><input type="number" step="0.1" min={0} max={5} className={input} value={form.rating} onChange={(e) => set({ rating: e.target.value })} /></Field>
          <Field label="রিভিউ সংখ্যা"><input type="number" className={input} value={form.reviews} onChange={(e) => set({ reviews: e.target.value })} /></Field>
          <Field label="YouTube লিংক" wide><input className={input} value={form.youtubeUrl} onChange={(e) => set({ youtubeUrl: e.target.value })} /></Field>

          <Rows title="স্পেসিফিকেশন টেবিল" rows={form.specTable} cols={[{ key: "label", ph: "নাম" }, { key: "value", ph: "মান" }]} onChange={(r) => set({ specTable: r })} />
          <Rows title="পিনআউট" rows={form.pinout} cols={[{ key: "pin", ph: "পিন" }, { key: "voltage", ph: "ভোল্টেজ" }]} onChange={(r) => set({ pinout: r })} />
          <Rows title="বান্ডেল / অ্যাড-অন আইটেম" rows={form.bundleItems} cols={[{ key: "title", ph: "নাম" }, { key: "subtitle", ph: "বিবরণ" }, { key: "price", ph: "দাম", type: "number" }]} onChange={(r) => set({ bundleItems: r })} />
        </div>

        <div className="flex gap-2 sticky bottom-2">
          <button className={btn} onClick={save}>{form.id ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}</button>
          <button className={btnGhost} onClick={() => setForm(null)}>বাতিল</button>
        </div>
      </div>
    );
  }

  /* -------- list -------- */
  return (
    <div className="flex flex-col gap-3">
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input className={`${input} !pl-9`} placeholder="নাম / SKU খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className={`${input} !w-auto`} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">সব ক্যাটাগরি</option>
          <option value="_none">ক্যাটাগরি ছাড়া</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <button className={btn} onClick={() => { setMsg(""); setForm({ ...EMPTY }); }}>＋ নতুন প্রোডাক্ট</button>
      </div>
      <p className="text-body-sm text-on-surface-variant">{shown.length} / {products.length} টি প্রোডাক্ট</p>

      {shown.map((p) => (
        <div key={p.id} className="glass-card rounded-lg p-3 flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 rounded-md overflow-hidden bg-surface-container border border-outline-soft">
            {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.title}</p>
            <p className="font-mono text-label-mono-sm text-on-surface-variant truncate">
              {p.sku} · {cats.find((c) => c.slug === p.category_slug)?.label ?? "ক্যাটাগরি নেই"}
            </p>
            <div className="flex gap-3 mt-1 text-body-sm">
              <label className="flex items-center gap-1"><input type="checkbox" className="accent-[#059669]" checked={p.in_stock} onChange={(e) => quick(p, { inStock: e.target.checked })} />স্টক</label>
              <label className="flex items-center gap-1"><input type="checkbox" className="accent-[#059669]" checked={p.is_flash_deal} onChange={(e) => quick(p, { isFlashDeal: e.target.checked })} />ফ্ল্যাশ</label>
            </div>
          </div>
          <p className="font-mono hidden sm:block">{formatBDT(Number(p.price))}</p>
          <button aria-label="এডিট" className={btnGhost} onClick={() => { setMsg(""); setForm(fromRow(p)); }}><Pencil className="h-4 w-4" /></button>
          <button aria-label="মুছুন" className={danger} onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

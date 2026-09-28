"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/lib/format";
import { ADMIN_BASE } from "@/lib/admin-config";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Tab = "orders" | "clients" | "products" | "content" | "warranty";
const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "অর্ডার" },
  { id: "clients", label: "ক্লায়েন্ট" },
  { id: "products", label: "প্রোডাক্ট" },
  { id: "content", label: "কনটেন্ট" },
  { id: "warranty", label: "ওয়ারেন্টি" },
];
const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_BN: Record<string, string> = {
  pending: "অপেক্ষমান", confirmed: "নিশ্চিত", shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল",
};

const input = "rounded-full bg-surface-lowest border border-outline-soft px-3 py-2 text-body-md w-full";
const btn = "btn-cyan px-4 py-2 text-body-sm font-medium";

async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "ব্যর্থ হয়েছে");
  return json;
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "আপলোড ব্যর্থ");
  return json.url;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");

  async function logout() {
    await api("/api/admin/logout", "POST");
    router.push(`${ADMIN_BASE}/login`);
  }

  return (
    <div className="max-w-4xl mx-auto px-margin pt-5 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-label-mono-sm text-cyan">SiMPLE TECHNOLOGIES // ADMIN</p>
          <h1 className="font-bn font-bold text-headline-md">ম্যানেজমেন্ট প্যানেল</h1>
        </div>
        <button onClick={logout} className="rounded-full border border-outline-soft px-3 py-2 text-body-sm text-on-surface-variant">
          লগআউট
        </button>
      </div>

      <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar rounded-lg bg-surface-low p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-body-sm font-medium ${
              tab === t.id ? "bg-cyan-soft text-cyan" : "text-on-surface-variant"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "orders" && <OrdersTab />}
        {tab === "clients" && <ClientsTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "warranty" && <WarrantyTab />}
      </div>
    </div>
  );
}

/* ------------------------------ Orders ------------------------------ */
function OrdersTab() {
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setOrders((await api(`/api/admin/orders?q=${encodeURIComponent(q)}`)).orders);
      setMsg("");
    } catch (e: any) {
      setMsg(e.message);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function update(id: string, patch: any) {
    await api("/api/admin/orders", "PATCH", { id, ...patch });
    load();
  }

  return (
    <div className="flex flex-col gap-3">
      <input className={input} placeholder="ফোন নম্বর, নাম বা অর্ডার নম্বর দিয়ে খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
      {msg && <p className="text-body-sm text-red-400">{msg}</p>}
      {orders.map((o) => (
        <div key={o.id} className="glass-card rounded-lg p-3 flex flex-col gap-2">
          <div className="flex justify-between gap-2 flex-wrap">
            <span className="font-mono text-cyan">#{o.order_number}</span>
            <span className="text-label-mono-sm font-mono text-on-surface-variant">
              {new Date(o.created_at).toLocaleString("bn-BD")}
            </span>
          </div>
          <p className="text-body-md">
            {o.guest_name} · <span className="font-mono">{o.guest_phone}</span>
          </p>
          <p className="text-body-sm text-on-surface-variant">{o.delivery_address}</p>
          <p className="text-body-sm text-on-surface-variant">
            {o.items.map((i: any) => `${i.title} ×${i.qty}`).join(", ")}
          </p>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-mono text-body-lg">
              {formatBDT(Number(o.total))}{" "}
              <span className="chip-spec rounded-full">{String(o.payment_method).toUpperCase()}</span>
            </span>
            <select
              value={o.status}
              onChange={(e) => update(o.id, { status: e.target.value })}
              className="rounded-full bg-surface-lowest border border-outline-soft px-2 py-1.5 text-body-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_BN[s]}</option>
              ))}
            </select>
          </div>
          <NoteBox initial={o.admin_note ?? ""} onSave={(v) => update(o.id, { adminNote: v })} />
        </div>
      ))}
      {orders.length === 0 && !msg && <p className="text-body-sm text-on-surface-variant">কোনো অর্ডার নেই।</p>}
    </div>
  );
}

function NoteBox({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex gap-2">
      <input className={input} placeholder="ইন্টারনাল নোট (গ্রাহকের সাথে কথা, ইত্যাদি)" value={v} onChange={(e) => setV(e.target.value)} />
      <button className={btn} onClick={() => onSave(v)}>সেভ</button>
    </div>
  );
}

/* ------------------------------ Clients ------------------------------ */
function ClientsTab() {
  const [q, setQ] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setClients((await api(`/api/admin/customers?q=${encodeURIComponent(q)}`)).clients);
        setMsg("");
      } catch (e: any) {
        setMsg(e.message);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="flex flex-col gap-3">
      <input className={input} placeholder="মোবাইল নম্বর বা নাম দিয়ে ক্লায়েন্ট খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
      {msg && <p className="text-body-sm text-red-400">{msg}</p>}
      {clients.map((c) => (
        <details key={c.phone} className="glass-card rounded-lg p-3">
          <summary className="cursor-pointer flex justify-between gap-2">
            <span>
              {c.name} · <span className="font-mono">{c.phone}</span>
            </span>
            <span className="font-mono text-cyan">{formatBDT(c.total)}</span>
          </summary>
          <div className="mt-3 flex flex-col gap-2 text-body-sm">
            <p className="text-on-surface-variant">মোট অর্ডার: {c.orders.length}</p>
            {c.orders.map((o: any) => (
              <div key={o.id} className="rounded-full bg-surface-container p-2">
                <span className="font-mono text-cyan">#{o.order_number}</span> · {STATUS_BN[o.status]} · {formatBDT(Number(o.total))}
                {o.admin_note && <p className="text-on-surface-variant mt-0.5">নোট: {o.admin_note}</p>}
              </div>
            ))}
            {c.docs.length > 0 && <p className="mt-1 font-medium">ওয়ারেন্টি / ডকুমেন্ট</p>}
            {c.docs.map((d: any) => (
              <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan underline">
                {d.product_name}
                {d.warranty_expiry ? ` (মেয়াদ: ${d.warranty_expiry})` : ""}
              </a>
            ))}
          </div>
        </details>
      ))}
      {clients.length === 0 && !msg && <p className="text-body-sm text-on-surface-variant">কোনো ক্লায়েন্ট পাওয়া যায়নি।</p>}
    </div>
  );
}

/* ------------------------------ Products ------------------------------ */
function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", sku: "", price: "", categorySlug: "", description: "", youtubeUrl: "", image: "" });
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      setProducts((await api("/api/admin/products")).products);
    } catch (e: any) {
      setMsg(e.message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function patch(id: string, p: any) {
    try {
      await api("/api/admin/products", "PATCH", { id, ...p });
      setMsg("সেভ হয়েছে ✓");
      load();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  async function create() {
    try {
      await api("/api/admin/products", "POST", form);
      setForm({ title: "", slug: "", sku: "", price: "", categorySlug: "", description: "", youtubeUrl: "", image: "" });
      setMsg("প্রোডাক্ট যোগ হয়েছে ✓");
      load();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}

      <details className="glass-card rounded-lg p-3">
        <summary className="cursor-pointer font-medium">＋ নতুন প্রোডাক্ট যোগ করুন</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(["title", "slug", "sku", "price", "categorySlug", "youtubeUrl"] as const).map((k) => (
            <input
              key={k}
              className={input}
              placeholder={{ title: "প্রোডাক্টের নাম", slug: "slug (ইংরেজি, যেমন esp32-board)", sku: "SKU", price: "দাম (৳)", categorySlug: "ক্যাটাগরি slug (যেমন sensors)", youtubeUrl: "YouTube লিংক (ঐচ্ছিক)" }[k]}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          ))}
          <textarea className={`${input} sm:col-span-2`} placeholder="বিবরণ" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setUploading(true);
                try {
                  setForm({ ...form, image: await uploadFile(f, "products") });
                } catch (err: any) {
                  setMsg(err.message);
                }
                setUploading(false);
              }}
              className="text-body-sm"
            />
            {uploading && <span className="text-body-sm">আপলোড হচ্ছে...</span>}
            {form.image && <span className="text-body-sm text-emerald-light">ছবি যোগ হয়েছে ✓</span>}
          </div>
          <button className={btn} onClick={create}>প্রোডাক্ট সেভ করুন</button>
        </div>
      </details>

      {products.map((p) => (
        <ProductRow key={p.id} p={p} onPatch={patch} />
      ))}
    </div>
  );
}

function ProductRow({ p, onPatch }: { p: any; onPatch: (id: string, patch: any) => void }) {
  const [price, setPrice] = useState(String(p.price));
  const [yt, setYt] = useState(p.youtube_url ?? "");
  return (
    <div className="glass-card rounded-lg p-3 flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <span className="text-body-md">{p.title}</span>
        <span className="font-mono text-label-mono-sm text-on-surface-variant">{p.sku}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-[120px_1fr_auto]">
        <input className={input} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" />
        <input className={input} placeholder="YouTube ভিডিও লিংক" value={yt} onChange={(e) => setYt(e.target.value)} />
        <button className={btn} onClick={() => onPatch(p.id, { price, youtubeUrl: yt })}>সেভ</button>
      </div>
      <div className="flex gap-4 text-body-sm">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={p.in_stock} onChange={(e) => onPatch(p.id, { inStock: e.target.checked })} /> ইন-স্টক
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={p.is_flash_deal} onChange={(e) => onPatch(p.id, { isFlashDeal: e.target.checked })} /> ফ্ল্যাশ ডিল
        </label>
      </div>
    </div>
  );
}

/* ------------------------------ Content ------------------------------ */
function ContentTab() {
  const [hero, setHero] = useState<any>(null);
  const [offers, setOffers] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/api/admin/content")
      .then(({ content }) => {
        setHero(content.hero_banner ?? null);
        setOffers((content.marquee_offers ?? []).join("\n"));
      })
      .catch((e) => setMsg(e.message));
  }, []);

  async function save(key: string, value: unknown) {
    try {
      await api("/api/admin/content", "PUT", { key, value });
      setMsg("সেভ হয়েছে ✓ (হোমপেজে দেখুন)");
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  const heroFields: [string, string][] = [
    ["eyebrow", "ছোট ব্যাজ টেক্সট"],
    ["headline", "মূল হেডলাইন"],
    ["subtext", "সাবটেক্সট"],
    ["promoTitle", "প্রোমো টাইটেল"],
    ["promoSubtitle", "প্রোমো সাবটাইটেল"],
    ["promoCta", "বাটনের লেখা"],
  ];

  return (
    <div className="flex flex-col gap-5">
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}

      <section className="glass-card rounded-lg p-3 flex flex-col gap-2">
        <h2 className="font-bn font-semibold text-headline-sm">হিরো ব্যানার</h2>
        {hero &&
          heroFields.map(([k, label]) => (
            <label key={k} className="flex flex-col gap-1">
              <span className="text-body-sm text-on-surface-variant">{label}</span>
              <input className={input} value={hero[k] ?? ""} onChange={(e) => setHero({ ...hero, [k]: e.target.value })} />
            </label>
          ))}
        <button className={btn} onClick={() => save("hero_banner", hero)}>হিরো সেভ করুন</button>
      </section>

      <section className="glass-card rounded-lg p-3 flex flex-col gap-2">
        <h2 className="font-bn font-semibold text-headline-sm">স্ক্রলিং অফার টেক্সট</h2>
        <p className="text-body-sm text-on-surface-variant">প্রতি লাইনে একটা অফার লিখুন।</p>
        <textarea className={input} rows={6} value={offers} onChange={(e) => setOffers(e.target.value)} />
        <button
          className={btn}
          onClick={() => save("marquee_offers", offers.split("\n").map((s) => s.trim()).filter(Boolean))}
        >
          অফার সেভ করুন
        </button>
      </section>
    </div>
  );
}

/* ------------------------------ Warranty ------------------------------ */
function WarrantyTab() {
  const [orderNumber, setOrderNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!file) return setMsg("ফাইল সিলেক্ট করুন");
    setBusy(true);
    try {
      const fileUrl = await uploadFile(file, "warranty");
      await api("/api/admin/warranty", "POST", { orderNumber, productName, fileUrl, warrantyExpiry: expiry });
      setMsg("ডকুমেন্ট আপলোড হয়েছে ✓ — গ্রাহক নিজের অ্যাকাউন্টে দেখতে পাবেন");
      setOrderNumber(""); setProductName(""); setExpiry(""); setFile(null);
    } catch (e: any) {
      setMsg(e.message);
    }
    setBusy(false);
  }

  return (
    <div className="glass-card rounded-lg p-3 flex flex-col gap-2 max-w-lg">
      <h2 className="font-bn font-semibold text-headline-sm">ওয়ারেন্টি / ইনভয়েস আপলোড</h2>
      <input className={input} placeholder="অর্ডার নম্বর (যেমন RK-123456)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
      <input className={input} placeholder="প্রোডাক্টের নাম" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <label className="flex flex-col gap-1">
        <span className="text-body-sm text-on-surface-variant">ওয়ারেন্টি শেষ হওয়ার তারিখ (ঐচ্ছিক)</span>
        <input type="date" className={input} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
      </label>
      <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-body-sm" />
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}
      <button className={btn} disabled={busy} onClick={submit}>{busy ? "আপলোড হচ্ছে..." : "আপলোড করুন"}</button>
    </div>
  );
}

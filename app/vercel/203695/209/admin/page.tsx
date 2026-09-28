"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/lib/format";
import { ADMIN_BASE } from "@/lib/admin-config";
import { CATEGORY_ICONS, CATEGORY_COLORS, CategoryIcon } from "@/lib/category-style";
import AdminOverview from "./AdminOverview";
import AdminSlides from "./AdminSlides";
import AdminProducts from "./AdminProducts";
import AdminAccounts from "./AdminAccounts";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Tab = "overview" | "slides" | "accounts" | "orders" | "clients" | "categories" | "products" | "content" | "warranty";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "ড্যাশবোর্ড" },
  { id: "slides", label: "হোম স্লাইডার" },
  { id: "orders", label: "অর্ডার" },
  { id: "clients", label: "ক্লায়েন্ট" },
  { id: "accounts", label: "অ্যাকাউন্ট" },
  { id: "categories", label: "ক্যাটাগরি" },
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
  const [tab, setTab] = useState<Tab>("overview");

  async function logout() {
    await api("/api/admin/logout", "POST");
    router.push(`${ADMIN_BASE}/login`);
  }

  return (
    <div className="max-w-6xl mx-auto px-margin pt-5 pb-16">
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
        {tab === "overview" && <AdminOverview go={setTab} />}
        {tab === "slides" && <AdminSlides />}
        {tab === "orders" && <OrdersTab />}
        {tab === "clients" && <ClientsTab />}
        {tab === "accounts" && <AdminAccounts />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "products" && <AdminProducts />}
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
function CategoriesTab() {
  const [cats, setCats] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ label: "", slug: "", icon: "layers", color: "emerald" });

  const load = useCallback(async () => {
    try { setCats((await api("/api/admin/categories")).categories); } catch (e: any) { setMsg(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<any>, ok: string) {
    try { await fn(); setMsg(ok); load(); } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="flex flex-col gap-4">
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}
      <div className="glass-card rounded-lg p-4 flex flex-col gap-3">
        <p className="font-medium">＋ নতুন ক্যাটাগরি (বাম মেনুতে দেখাবে)</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className={input} placeholder="ক্যাটাগরির নাম (যেমন ড্রোন পার্টস)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <input className={input} placeholder="slug (ইংরেজি, যেমন drone-parts)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CATEGORY_ICONS).map((k) => (
            <button key={k} type="button" onClick={() => setForm({ ...form, icon: k })} aria-label={k}
              className={`rounded-full p-0.5 border-2 ${form.icon === k ? "border-cyan" : "border-transparent"}`}>
              <CategoryIcon icon={k} color={form.color} size={34} />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_COLORS).map(([k, c]) => (
            <button key={k} type="button" onClick={() => setForm({ ...form, color: k })} aria-label={k}
              className={`h-8 w-8 rounded-full border-2 ${form.color === k ? "border-brand scale-110" : "border-white"}`}
              style={{ background: c.fg }} />
          ))}
        </div>
        <button className={btn} onClick={() => run(async () => { await api("/api/admin/categories", "POST", form); setForm({ label: "", slug: "", icon: "layers", color: "emerald" }); }, "ক্যাটাগরি যোগ হয়েছে ✓")}>
          ক্যাটাগরি যোগ করুন
        </button>
      </div>

      {cats.map((c) => (
        <div key={c.slug} className="glass-card rounded-lg p-3 flex items-center gap-3">
          <CategoryIcon icon={c.icon} color={c.color} size={40} />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{c.label}</p>
            <p className="font-mono text-label-mono-sm text-on-surface-variant">{c.slug}</p>
          </div>
          <div className="flex gap-1">
            {Object.entries(CATEGORY_COLORS).map(([k, col]) => (
              <button key={k} aria-label={k} onClick={() => run(() => api("/api/admin/categories", "PATCH", { slug: c.slug, color: k }), "রং বদলেছে ✓")}
                className={`h-4 w-4 rounded-full ${c.color === k ? "ring-2 ring-brand" : ""}`} style={{ background: col.fg }} />
            ))}
          </div>
          <button
            className="text-body-sm text-red-600"
            onClick={() => confirm(`"${c.label}" মুছবেন? প্রোডাক্টগুলো থাকবে, শুধু ক্যাটাগরি খালি হবে।`) && run(() => api("/api/admin/categories", "DELETE", { slug: c.slug }), "মুছে ফেলা হয়েছে")}
          >
            মুছুন
          </button>
        </div>
      ))}
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

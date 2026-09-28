"use client";
import { useEffect, useState } from "react";
import { formatBDT } from "@/lib/format";
import { api } from "./shared";

/* eslint-disable @typescript-eslint/no-explicit-any */
const STATUS_BN: Record<string, string> = {
  pending: "অপেক্ষমান", confirmed: "নিশ্চিত", shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল",
};

export default function AdminOverview({ go }: { go: (tab: any) => void }) {
  const [s, setS] = useState<any>(null);
  const [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/stats").then(setS).catch((e) => setErr(e.message)); }, []);

  if (err) return <p className="text-body-sm text-red-600">{err}</p>;
  if (!s) return <p className="text-body-sm text-on-surface-variant">লোড হচ্ছে...</p>;

  const cards = [
    { label: "আজকের অর্ডার", value: s.todayOrders, color: "#2563EB", tab: "orders" },
    { label: "মোট অর্ডার", value: s.orders, color: "#059669", tab: "orders" },
    { label: "মোট বিক্রি", value: formatBDT(s.revenue), color: "#D97706", tab: "orders" },
    { label: "প্রোডাক্ট", value: s.products, color: "#7C3AED", tab: "products" },
    { label: "ক্যাটাগরি", value: s.categories, color: "#0891B2", tab: "categories" },
    { label: "ক্লায়েন্ট", value: s.customers, color: "#DB2777", tab: "clients" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <button key={c.label} onClick={() => go(c.tab)} className="glass-card rounded-lg p-4 text-left">
            <p className="text-body-sm text-on-surface-variant">{c.label}</p>
            <p className="mt-1 font-display text-headline-md font-semibold" style={{ color: c.color }}>{c.value}</p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="glass-card rounded-lg p-4">
          <h2 className="font-semibold text-headline-sm mb-2">অর্ডারের অবস্থা</h2>
          {Object.keys(STATUS_BN).map((k) => (
            <div key={k} className="flex justify-between py-1 text-body-md border-b border-outline-soft last:border-0">
              <span>{STATUS_BN[k]}</span>
              <span className="font-mono">{s.byStatus[k] ?? 0}</span>
            </div>
          ))}
        </section>

        <section className="glass-card rounded-lg p-4">
          <h2 className="font-semibold text-headline-sm mb-2">স্টক শেষ ({s.outOfStock.length})</h2>
          {s.outOfStock.length === 0 && <p className="text-body-sm text-on-surface-variant">সব প্রোডাক্ট স্টকে আছে ✓</p>}
          {s.outOfStock.slice(0, 6).map((p: any) => (
            <p key={p.id} className="py-1 text-body-md border-b border-outline-soft last:border-0 truncate">{p.title}</p>
          ))}
        </section>
      </div>

      <section className="glass-card rounded-lg p-4">
        <h2 className="font-semibold text-headline-sm mb-2">সাম্প্রতিক অর্ডার</h2>
        {s.recent.length === 0 && <p className="text-body-sm text-on-surface-variant">এখনো কোনো অর্ডার নেই</p>}
        {s.recent.map((o: any) => (
          <div key={o.id} className="flex items-center justify-between gap-2 py-1.5 text-body-md border-b border-outline-soft last:border-0">
            <span className="font-mono text-label-mono-md">{o.order_number}</span>
            <span className="flex-1 truncate">{o.guest_name}</span>
            <span className="font-mono">{formatBDT(Number(o.total))}</span>
            <span className="chip-spec">{STATUS_BN[o.status] ?? o.status}</span>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        <button className="btn-cyan px-4 py-2 text-body-sm font-medium" onClick={() => go("products")}>＋ নতুন প্রোডাক্ট</button>
        <button className="btn-violet px-4 py-2 text-body-sm font-medium" onClick={() => go("slides")}>হোম স্লাইডার</button>
        <button className="btn-violet px-4 py-2 text-body-sm font-medium" onClick={() => go("categories")}>ক্যাটাগরি</button>
      </div>
    </div>
  );
}

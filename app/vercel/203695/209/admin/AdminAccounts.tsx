"use client";
import { useCallback, useEffect, useState } from "react";
import { Search, KeyRound, Trash2, Copy } from "lucide-react";
import { api, input, btn, btnGhost, danger } from "./shared";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminAccounts() {
  const [q, setQ] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [shown, setShown] = useState<{ phone: string; password: string } | null>(null);
  const [nu, setNu] = useState({ name: "", phone: "", password: "" });

  const load = useCallback(async () => {
    try { setAccounts((await api(`/api/admin/accounts?q=${encodeURIComponent(q)}`)).accounts); }
    catch (e: any) { setMsg(e.message); }
  }, [q]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  async function reset(a: any) {
    if (!confirm(`${a.name || a.phone} এর জন্য নতুন পাসওয়ার্ড বানাবেন? পুরনোটা আর চলবে না।`)) return;
    try {
      const r = await api("/api/admin/accounts", "POST", { action: "reset", id: a.id });
      setShown({ phone: a.phone, password: r.password });
      setMsg("");
    } catch (e: any) { setMsg(e.message); }
  }

  async function remove(a: any) {
    if (!confirm(`${a.name || a.phone} এর অ্যাকাউন্ট মুছবেন? (অর্ডার ইতিহাস থাকবে, শুধু লগইন বন্ধ হবে)`)) return;
    try { await api("/api/admin/accounts", "DELETE", { id: a.id }); setMsg("অ্যাকাউন্ট মুছে ফেলা হয়েছে ✓"); load(); }
    catch (e: any) { setMsg(e.message); }
  }

  async function create() {
    try {
      const r = await api("/api/admin/accounts", "POST", { action: "create", ...nu });
      setShown({ phone: nu.phone, password: r.password });
      setNu({ name: "", phone: "", password: "" });
      setMsg("অ্যাকাউন্ট তৈরি হয়েছে ✓");
      load();
    } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-on-surface-variant">
        পাসওয়ার্ড এনক্রিপ্টেড থাকে, তাই পুরনোটা দেখা যায় না। ক্লায়েন্ট ভুলে গেলে নম্বর খুঁজে <b>নতুন পাসওয়ার্ড</b> বানিয়ে ফোনে জানিয়ে দিন — সে লগইন করে নিজে বদলে নিতে পারবে।
      </p>

      {shown && (
        <div className="rounded-lg border border-cyan-border bg-cyan-soft p-4">
          <p className="text-body-sm text-on-surface-variant">{shown.phone} এর পাসওয়ার্ড (একবারই দেখানো হচ্ছে)</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-mono text-headline-md tracking-wider">{shown.password}</span>
            <button className={btnGhost} onClick={() => navigator.clipboard?.writeText(shown.password)}><Copy className="h-4 w-4" /></button>
            <button className="ml-auto text-body-sm underline" onClick={() => setShown(null)}>বন্ধ</button>
          </div>
        </div>
      )}
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}

      <details className="glass-card rounded-lg p-3">
        <summary className="cursor-pointer font-medium">＋ ক্লায়েন্টের জন্য অ্যাকাউন্ট খুলে দিন</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <input className={input} placeholder="নাম" value={nu.name} onChange={(e) => setNu({ ...nu, name: e.target.value })} />
          <input className={input} placeholder="মোবাইল (01XXXXXXXXX)" value={nu.phone} onChange={(e) => setNu({ ...nu, phone: e.target.value })} />
          <input className={input} placeholder="পাসওয়ার্ড (খালি রাখলে অটো)" value={nu.password} onChange={(e) => setNu({ ...nu, password: e.target.value })} />
        </div>
        <button className={`${btn} mt-3`} onClick={create}>অ্যাকাউন্ট তৈরি করুন</button>
      </details>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input className={`${input} !pl-9`} placeholder="মোবাইল নম্বর বা নাম দিয়ে খুঁজুন" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {accounts.length === 0 && <p className="text-body-sm text-on-surface-variant">কোনো অ্যাকাউন্ট পাওয়া যায়নি</p>}
      {accounts.map((a) => (
        <div key={a.id} className="glass-card rounded-lg p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{a.name || "নাম নেই"}</p>
            <p className="font-mono text-label-mono-md text-on-surface-variant">{a.phone}</p>
          </div>
          <button className={`${btnGhost} inline-flex items-center gap-1.5`} onClick={() => reset(a)}>
            <KeyRound className="h-4 w-4" /> নতুন পাসওয়ার্ড
          </button>
          <button aria-label="মুছুন" className={danger} onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

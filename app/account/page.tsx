"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, LogOut, FileText, Package } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatBDT } from "@/lib/format";

type OrderRow = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  items: { title: string; qty: number }[];
};
type DocRow = {
  id: string;
  product_name: string;
  file_url: string;
  warranty_expiry: string | null;
};

const STATUS_BN: Record<string, string> = {
  pending: "অপেক্ষমান",
  confirmed: "নিশ্চিত",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
};

// Customers log in with their mobile number. Supabase Auth needs an email,
// so we derive a private one from the phone number.
const phoneToEmail = (phone: string) => `${phone.replace(/\D/g, "")}@phone.simpletech.app`;

export default function AccountPage() {
  const supabase = getSupabaseBrowserClient();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [docs, setDocs] = useState<DocRow[]>([]);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!supabase) return;
    const { data: sess } = await supabase.auth.getSession();
    const user = sess.session?.user;
    setUserId(user?.id ?? null);
    if (user) {
      setProfileName((user.user_metadata?.name as string) ?? "");
      const [o, d] = await Promise.all([
        supabase.from("orders").select("id, order_number, total, status, created_at, items").order("created_at", { ascending: false }),
        supabase.from("warranty_documents").select("id, product_name, file_url, warranty_expiry").order("uploaded_at", { ascending: false }),
      ]);
      setOrders((o.data as OrderRow[]) ?? []);
      setDocs((d.data as DocRow[]) ?? []);
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    loadData();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadData());
    return () => sub.subscription.unsubscribe();
  }, [supabase, loadData]);

  async function submit() {
    if (!supabase) return;
    setError("");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/\s+/g, ""))) return setError("সঠিক মোবাইল নম্বর দিন");
    if (password.length < 6) return setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
    if (mode === "signup" && !name.trim()) return setError("আপনার নাম দিন");
    setBusy(true);
    const email = phoneToEmail(phone);
    const res =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (res.error) {
      setError(
        res.error.message.includes("Invalid login")
          ? "নম্বর বা পাসওয়ার্ড ভুল"
          : res.error.message.includes("already registered")
          ? "এই নম্বর দিয়ে আগেই অ্যাকাউন্ট আছে, লগইন করুন"
          : res.error.message
      );
    }
  }

  if (!ready) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan" />
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="px-margin py-14 text-center max-w-md mx-auto">
        <p className="font-bn text-headline-sm">গ্রাহক অ্যাকাউন্ট শীঘ্রই চালু হচ্ছে</p>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          (Supabase এখনো কানেক্ট করা হয়নি — README দেখুন)
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-sm mx-auto px-margin pt-8 pb-10">
        <h1 className="font-bn font-bold text-headline-md text-on-surface">
          {mode === "login" ? "লগইন করুন" : "নতুন অ্যাকাউন্ট"}
        </h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          মোবাইল নম্বর দিয়ে অর্ডার হিস্ট্রি ও ওয়ারেন্টি ডকুমেন্ট দেখুন
        </p>
        <div className="mt-5 flex flex-col gap-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className="rounded-full bg-surface-lowest border border-outline-soft px-3 py-2.5 text-body-md"
            />
          )}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="মোবাইল নম্বর (017XXXXXXXX)"
            type="tel"
            className="rounded-full bg-surface-lowest border border-outline-soft px-3 py-2.5 text-body-md"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড"
            type="password"
            className="rounded-full bg-surface-lowest border border-outline-soft px-3 py-2.5 text-body-md"
          />
          {error && <p className="text-body-sm text-red-400">{error}</p>}
          <button
            onClick={submit}
            disabled={busy}
            className="rounded-full bg-cyan text-surface-lowest py-3 font-bn font-semibold disabled:opacity-60"
          >
            {busy ? "অপেক্ষা করুন..." : mode === "login" ? "লগইন" : "অ্যাকাউন্ট খুলুন"}
          </button>
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="text-body-sm text-cyan"
          >
            {mode === "login" ? "নতুন? অ্যাকাউন্ট খুলুন" : "আগে থেকেই অ্যাকাউন্ট আছে? লগইন"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-margin pt-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-label-mono-sm text-cyan">MY ACCOUNT</p>
          <h1 className="font-bn font-bold text-headline-md">{profileName || "আমার অ্যাকাউন্ট"}</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-1.5 rounded-full border border-outline-soft px-3 py-2 text-body-sm text-on-surface-variant"
        >
          <LogOut className="h-4 w-4" /> লগআউট
        </button>
      </div>

      <h2 className="mt-6 mb-2 flex items-center gap-1.5 font-bn font-semibold text-headline-sm">
        <Package className="h-4 w-4 text-cyan" /> আমার অর্ডার
      </h2>
      <div className="flex flex-col gap-2">
        {orders.length === 0 && <p className="text-body-sm text-on-surface-variant">এখনো কোনো অর্ডার নেই।</p>}
        {orders.map((o) => (
          <div key={o.id} className="glass-card rounded-lg p-3">
            <div className="flex justify-between">
              <span className="font-mono text-cyan">#{o.order_number}</span>
              <span className="chip-spec rounded-full font-mono">{STATUS_BN[o.status] ?? o.status}</span>
            </div>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {o.items.map((i) => `${i.title} ×${i.qty}`).join(", ")}
            </p>
            <p className="mt-1 font-mono text-body-md">{formatBDT(Number(o.total))}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 mb-2 flex items-center gap-1.5 font-bn font-semibold text-headline-sm">
        <FileText className="h-4 w-4 text-violet" /> ওয়ারেন্টি ও ডকুমেন্ট
      </h2>
      <div className="flex flex-col gap-2">
        {docs.length === 0 && <p className="text-body-sm text-on-surface-variant">কোনো ডকুমেন্ট নেই।</p>}
        {docs.map((d) => (
          <a
            key={d.id}
            href={d.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-lg p-3 flex justify-between items-center"
          >
            <span className="text-body-md">{d.product_name}</span>
            <span className="text-label-mono-sm font-mono text-on-surface-variant">
              {d.warranty_expiry ? `মেয়াদ: ${d.warranty_expiry}` : "ডাউনলোড"}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_BASE } from "@/lib/admin-config";

export default function AuthForm({ mode }: { mode: "login" | "setup" }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password, setupKey }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error || "ব্যর্থ হয়েছে");
    if (mode === "setup") router.push(`${ADMIN_BASE}/login`);
    else router.push(ADMIN_BASE);
    router.refresh();
  }

  const input = "rounded-full bg-surface-lowest border border-outline-soft px-3 py-2.5 text-body-md";

  return (
    <div className="min-h-screen flex items-center justify-center px-margin">
      <form onSubmit={submit} className="glass-card rounded-lg p-6 w-full max-w-sm flex flex-col gap-3">
        <p className="font-mono text-label-mono-sm text-cyan">SiMPLE TECHNOLOGIES // ADMIN</p>
        <h1 className="font-bn font-bold text-headline-md">
          {mode === "login" ? "অ্যাডমিন লগইন" : "প্রথম অ্যাডমিন তৈরি করুন"}
        </h1>
        <input className={input} placeholder="মোবাইল নম্বর" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="username" />
        <input className={input} placeholder="পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {mode === "setup" && (
          <input className={input} placeholder="Setup Key (ADMIN_SETUP_KEY)" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} type="password" />
        )}
        {error && <p className="text-body-sm text-red-400">{error}</p>}
        <button disabled={busy} className="rounded-full bg-cyan text-surface-lowest py-3 font-bn font-semibold disabled:opacity-60">
          {busy ? "অপেক্ষা করুন..." : mode === "login" ? "লগইন" : "অ্যাডমিন তৈরি করুন"}
        </button>
      </form>
    </div>
  );
}

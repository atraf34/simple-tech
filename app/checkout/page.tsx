"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatBDT, toBengaliNumber } from "@/lib/format";
import {
  DELIVERY_FEES,
  PAYMENT_METHODS,
  COUPONS,
  calcDiscount,
  type DeliveryZone,
} from "@/lib/pricing";
import type { PaymentMethod } from "@/lib/types";

const STEPS = ["কার্ট", "ঠিকানা", "পেমেন্ট"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [zone, setZone] = useState<DeliveryZone>("inside_dhaka");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | undefined>();
  const [couponMsg, setCouponMsg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("bkash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderNumber: string; total: number; demo?: boolean } | null>(null);

  const discount = calcDiscount(coupon, subtotal);
  const deliveryFee = DELIVERY_FEES[zone];
  const total = subtotal - discount + deliveryFee;

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setCoupon(code);
      setCouponMsg(`${COUPONS[code].label} প্রয়োগ হয়েছে`);
    } else {
      setCoupon(undefined);
      setCouponMsg("কুপন কোডটি সঠিক নয়");
    }
  }

  function nextFromAddress() {
    if (!name.trim() || !address.trim()) return setError("নাম ও ঠিকানা দিন");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/\s+/g, "")))
      return setError("সঠিক মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)");
    setError("");
    setStep(2);
  }

  async function placeOrder() {
    setSubmitting(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, phone, address, zone, payment, coupon, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "অর্ডার করা যায়নি");
      clear();
      setDone(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-margin py-14 text-center">
        <span className="mx-auto h-14 w-14 rounded-full bg-emerald-soft border border-emerald flex items-center justify-center text-emerald-light">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-bn font-bold text-headline-md text-on-surface">অর্ডার সফল হয়েছে!</h1>
        <p className="mt-2 font-mono text-cyan text-body-lg">#{done.orderNumber}</p>
        <p className="mt-1 text-body-md text-on-surface-variant">
          মোট প্রদেয়: <span className="font-mono text-on-surface">{formatBDT(done.total)}</span>
        </p>
        {payment !== "cod" && (
          <p className="mt-3 text-body-sm text-on-surface-variant">
            আমাদের টিম শীঘ্রই আপনাকে পেমেন্টের নম্বর জানিয়ে ফোন/মেসেজ করবে।
          </p>
        )}
        {done.demo && (
          <p className="mt-3 text-label-mono-sm font-mono text-violet">
            (ডেমো মোড: Supabase কানেক্ট না থাকায় অর্ডার সেভ হয়নি)
          </p>
        )}
        <Link href="/" className="btn-cyan inline-block mt-6 rounded-full px-5 py-2.5 font-bn">
          হোমে ফিরুন
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-margin py-16 text-center">
        <p className="font-bn text-headline-sm text-on-surface">কার্ট খালি</p>
        <Link href="/catalog" className="btn-cyan inline-block mt-4 rounded-full px-5 py-2.5 font-bn">
          প্রোডাক্ট দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-margin pt-5 pb-10">
      {/* Progress */}
      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-body-sm border ${
                  i < step
                    ? "bg-cyan text-surface-lowest border-cyan"
                    : i === step
                    ? "border-cyan text-cyan"
                    : "border-outline-soft text-on-surface-muted"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : toBengaliNumber(i + 1)}
              </span>
              <span className={`text-label-mono-sm font-mono ${i <= step ? "text-cyan" : "text-on-surface-muted"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 mb-5 ${i < step ? "bg-cyan" : "bg-outline-soft"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Order summary (always visible) */}
      <section className="mt-6 glass-card rounded-lg p-4">
        <h2 className="font-bn font-semibold text-headline-sm text-on-surface">অর্ডার সারাংশ</h2>
        <div className="mt-3 flex flex-col gap-2">
          {items.map((i) => (
            <div key={i.slug} className="flex justify-between gap-3 text-body-md">
              <span className="text-on-surface-variant">
                {i.title} <span className="font-mono text-cyan">×{toBengaliNumber(i.qty)}</span>
              </span>
              <span className="font-mono text-on-surface">{formatBDT(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-outline-soft flex flex-col gap-1.5 text-body-md">
          <Row label="সাবটোটাল" value={formatBDT(subtotal)} />
          <Row label="ডেলিভারি চার্জ" value={formatBDT(deliveryFee)} />
          {discount > 0 && <Row label={`কুপন (${coupon})`} value={`- ${formatBDT(discount)}`} accent />}
          <div className="flex justify-between pt-2 border-t border-outline-soft">
            <span className="font-semibold">সর্বমোট প্রদেয়</span>
            <span className="font-mono text-headline-sm text-cyan">{formatBDT(total)}</span>
          </div>
        </div>
        {step === 0 && (
          <div className="mt-3 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="কুপন কোড (যেমন WELCOME10)"
              className="flex-1 rounded-full bg-surface-lowest border border-outline-soft px-3 py-2 font-mono text-body-sm"
            />
            <button onClick={applyCoupon} className="btn-violet px-4 text-body-sm">
              প্রয়োগ
            </button>
          </div>
        )}
        {couponMsg && <p className="mt-1.5 text-body-sm text-on-surface-variant">{couponMsg}</p>}
      </section>

      {/* Step 0: delivery zone */}
      {step === 0 && (
        <section className="mt-4 glass-card rounded-lg p-4">
          <h2 className="font-bn font-semibold text-headline-sm mb-3">ডেলিভারি এলাকা</h2>
          <div className="flex flex-col gap-2">
            {(
              [
                ["inside_dhaka", "ঢাকার ভেতরে", "২৪-৪৮ ঘণ্টার মধ্যে"],
                ["outside_dhaka", "ঢাকার বাইরে (সারাদেশ)", "২-৪ কার্যদিবস"],
              ] as const
            ).map(([id, label, sub]) => (
              <Choice key={id} active={zone === id} onClick={() => setZone(id)}>
                <div className="flex-1">
                  <p className="text-body-md">{label}</p>
                  <p className="text-label-mono-sm font-mono text-on-surface-variant">{sub}</p>
                </div>
                <span className="font-mono text-cyan">{formatBDT(DELIVERY_FEES[id])}</span>
              </Choice>
            ))}
          </div>
          <PrimaryButton onClick={() => setStep(1)}>ঠিকানা দিন →</PrimaryButton>
        </section>
      )}

      {/* Step 1: address */}
      {step === 1 && (
        <section className="mt-4 glass-card rounded-lg p-4 flex flex-col gap-3">
          <h2 className="font-bn font-semibold text-headline-sm">ডেলিভারি ঠিকানা</h2>
          <Field label="আপনার নাম" value={name} onChange={setName} placeholder="যেমন: তানভীর আহমেদ" />
          <Field label="মোবাইল নম্বর" value={phone} onChange={setPhone} placeholder="017XXXXXXXX" type="tel" />
          <label className="flex flex-col gap-1">
            <span className="text-body-sm text-on-surface-variant">পূর্ণ ঠিকানা</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="বাসা/রুম নম্বর, এলাকা, থানা, জেলা"
              className="rounded-full bg-surface-lowest border border-outline-soft px-3 py-2 text-body-md"
            />
          </label>
          {error && <p className="text-body-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="rounded-full border border-outline-soft px-4 py-3 text-body-md">
              ← পিছনে
            </button>
            <PrimaryButton onClick={nextFromAddress}>পেমেন্টে যান →</PrimaryButton>
          </div>
        </section>
      )}

      {/* Step 2: payment */}
      {step === 2 && (
        <section className="mt-4 glass-card rounded-lg p-4">
          <h2 className="font-bn font-semibold text-headline-sm mb-3">পেমেন্ট মাধ্যম</h2>
          <div className="flex flex-col gap-2">
            {PAYMENT_METHODS.map((m) => (
              <Choice key={m.id} active={payment === m.id} onClick={() => setPayment(m.id)}>
                <div className="flex-1">
                  <p className="text-body-md">{m.name}</p>
                  <p className="text-label-mono-sm font-mono text-on-surface-variant">{m.note}</p>
                </div>
              </Choice>
            ))}
          </div>
          {error && <p className="mt-3 text-body-sm text-red-400">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-full border border-outline-soft px-4 py-3 text-body-md">
              ← পিছনে
            </button>
            <button
              onClick={placeOrder}
              disabled={submitting}
              className="flex-1 rounded-full bg-cyan text-surface-lowest py-3 font-bn font-semibold text-body-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {formatBDT(total)} অর্ডার নিশ্চিত করুন
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-on-surface-variant">{label}</span>
      <span className={`font-mono ${accent ? "text-emerald-light" : "text-on-surface"}`}>{value}</span>
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
        active ? "border-cyan bg-cyan-soft" : "border-outline-soft"
      }`}
    >
      <span
        className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center ${
          active ? "border-cyan bg-cyan text-surface-lowest" : "border-outline"
        }`}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex-1 w-full rounded-full bg-cyan text-surface-lowest py-3 font-bn font-semibold text-body-lg"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-body-sm text-on-surface-variant">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-full bg-surface-lowest border border-outline-soft px-3 py-2 text-body-md"
      />
    </label>
  );
}

"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBDT, toBengaliNumber } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="px-margin py-16 text-center">
        <ShoppingCart className="h-10 w-10 mx-auto text-on-surface-muted" />
        <p className="mt-3 font-bn text-headline-sm text-on-surface">আপনার কার্ট খালি</p>
        <Link href="/catalog" className="btn-cyan inline-block mt-4 rounded px-5 py-2.5 font-bn">
          প্রোডাক্ট দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-margin pt-5 pb-10">
      <h1 className="font-bn font-bold text-headline-md text-on-surface">আপনার কার্ট</h1>
      <div className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item.slug} className="glass-card rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-body-md text-on-surface leading-snug">{item.title}</p>
              <p className="font-mono text-body-sm text-on-surface-variant mt-0.5">
                {formatBDT(item.price)}
              </p>
            </div>
            <div className="flex items-center rounded border border-outline-soft">
              <button
                aria-label="কমান"
                onClick={() => setQty(item.slug, item.qty - 1)}
                className="h-8 w-8 flex items-center justify-center"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-mono text-body-sm">{toBengaliNumber(item.qty)}</span>
              <button
                aria-label="বাড়ান"
                onClick={() => setQty(item.slug, item.qty + 1)}
                className="h-8 w-8 flex items-center justify-center"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              aria-label="মুছুন"
              onClick={() => removeItem(item.slug)}
              className="text-on-surface-variant hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 glass-card rounded-lg p-4 flex items-center justify-between">
        <span className="text-body-md text-on-surface-variant">সাবটোটাল</span>
        <span className="font-mono text-headline-sm text-on-surface">{formatBDT(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block text-center rounded bg-cyan text-surface-lowest py-3 font-bn font-semibold text-body-lg"
      >
        চেকআউট করুন
      </Link>
    </div>
  );
}

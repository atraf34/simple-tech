"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBDT, toBengaliNumber } from "@/lib/format";
import YouTubeEmbed from "@/components/product/YouTubeEmbed";
import type { Product } from "@/lib/types";

type Tab = "spec" | "pinout" | "video";

export default function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<Tab>("spec");
  const [qty, setQty] = useState(1);
  const [checked, setChecked] = useState<boolean[]>(
    product.bundleItems.map(() => true)
  );

  const gallery = product.gallery.length ? product.gallery : [product.image];

  const bundleTotal = useMemo(
    () =>
      product.bundleItems.reduce(
        (sum, item, i) => (checked[i] ? sum + item.price : sum),
        0
      ),
    [product.bundleItems, checked]
  );

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const add = () =>
    addItem({ slug: product.slug, title: product.title, price: product.price }, qty);

  const buyNow = () => {
    add();
    router.push("/checkout");
  };

  const addBundle = () => {
    product.bundleItems.forEach((item, i) => {
      if (!checked[i]) return;
      addItem({
        slug: i === 0 ? product.slug : `${product.slug}-bundle-${i}`,
        title: item.title,
        price: item.price,
      });
    });
    router.push("/cart");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "spec", label: "স্পেসিফিকেশন" },
    { id: "pinout", label: "পিনআউট" },
    ...(product.youtubeUrl ? [{ id: "video" as Tab, label: "ভিডিও" }] : []),
  ];

  return (
    <div className="max-w-3xl mx-auto px-margin pt-4 pb-32">
      {/* Gallery */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden glass-card">
        <Image
          src={gallery[activeImage]}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {gallery.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveImage(i)}
              className={`relative h-16 w-16 shrink-0 rounded overflow-hidden border ${
                i === activeImage ? "border-cyan" : "border-outline-soft"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Title block */}
      <div className="mt-4 flex items-center gap-2">
        <span className="chip-spec rounded font-mono">SKU: {product.sku}</span>
        <span
          className={`rounded px-2 py-0.5 text-label-mono-sm font-mono border ${
            product.inStock ? "chip-stock" : "border-red-500/40 text-red-400"
          }`}
        >
          {product.inStock ? "ইন-স্টক" : "স্টক নেই"}
        </span>
      </div>
      <h1 className="mt-2 font-bn font-bold text-headline-md text-on-surface">
        {product.title}
      </h1>
      <div className="mt-1 flex items-center gap-1 text-body-sm text-on-surface-variant">
        <Star className="h-3.5 w-3.5 fill-cyan text-cyan" strokeWidth={0} />
        <span className="font-mono">{toBengaliNumber(product.rating.toFixed(1))}</span>
        <span>({toBengaliNumber(product.reviews)} রিভিউ)</span>
      </div>
      {product.description && (
        <p className="mt-2 text-body-md text-on-surface-variant">{product.description}</p>
      )}

      {/* Price */}
      <div className="mt-4 glass-card rounded-lg p-4 flex items-end gap-3">
        <p className="font-mono text-headline-md text-on-surface">{formatBDT(product.price)}</p>
        {product.originalPrice && (
          <p className="font-mono text-body-md text-on-surface-muted line-through">
            {formatBDT(product.originalPrice)}
          </p>
        )}
        {discount > 0 && (
          <span className="ml-auto rounded bg-violet-soft border border-violet/40 text-[#d8b4fe] px-2 py-0.5 font-mono text-label-mono-md">
            {toBengaliNumber(discount)}% ছাড়
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg bg-surface-low p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded py-2 text-body-sm font-medium transition-colors ${
              tab === t.id ? "bg-cyan-soft text-cyan" : "text-on-surface-variant"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {tab === "spec" && (
          <div className="glass-card rounded-lg divide-y divide-outline-soft">
            {product.specTable.length === 0 && (
              <p className="p-4 text-body-sm text-on-surface-variant">
                স্পেসিফিকেশন শীঘ্রই যোগ করা হবে।
              </p>
            )}
            {product.specTable.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 p-3">
                <span className="text-body-sm text-on-surface-variant">{row.label}</span>
                <span className="font-mono text-label-mono-md text-on-surface text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "pinout" && (
          <div className="glass-card rounded-lg p-4 flex flex-wrap gap-2">
            {product.pinout.length === 0 && (
              <p className="text-body-sm text-on-surface-variant">পিনআউট তথ্য নেই।</p>
            )}
            {product.pinout.map((p) => (
              <span key={p.pin} className="chip-spec rounded font-mono py-1 px-2">
                {p.pin} <span className="text-cyan">[{p.voltage}]</span>
              </span>
            ))}
          </div>
        )}
        {tab === "video" && product.youtubeUrl && (
          <YouTubeEmbed url={product.youtubeUrl} title={product.title} />
        )}
      </div>

      {/* Bundle */}
      {product.bundleItems.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bn font-semibold text-headline-sm text-on-surface mb-3">
            প্রজেক্ট বান্ডেল (সাথে যা লাগবে)
          </h2>
          <div className="glass-card rounded-lg p-3 flex flex-col gap-2">
            {product.bundleItems.map((item, i) => (
              <label
                key={item.title}
                className="flex items-center gap-3 rounded bg-surface-lowest/60 p-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked[i]}
                  disabled={i === 0}
                  onChange={() =>
                    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                  }
                  className="h-4 w-4 accent-[#00f0ff]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-on-surface">{item.title}</p>
                  <p className="text-label-mono-sm font-mono text-on-surface-variant">
                    {item.subtitle}
                  </p>
                </div>
                <span className="font-mono text-body-md text-on-surface">
                  {i === 0 ? "" : "+"}
                  {formatBDT(item.price)}
                </span>
              </label>
            ))}
            <div className="mt-1 flex items-center justify-between">
              <div>
                <p className="text-body-sm text-on-surface-variant">কম্বো প্যাকেজ মূল্য:</p>
                <p className="font-mono text-headline-sm text-on-surface">
                  {formatBDT(bundleTotal)}
                </p>
              </div>
              <button
                onClick={addBundle}
                className="rounded bg-violet text-white px-4 py-2.5 font-bn font-medium text-body-md"
              >
                একসাথে কিনুন
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Sticky buy bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface-lowest/95 backdrop-blur-md border-t border-outline-soft px-margin py-3 md:bottom-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex items-center rounded border border-outline-soft">
            <button
              aria-label="কমান"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-9 flex items-center justify-center text-on-surface-variant"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-7 text-center font-mono text-body-md">{toBengaliNumber(qty)}</span>
            <button
              aria-label="বাড়ান"
              onClick={() => setQty((q) => q + 1)}
              className="h-10 w-9 flex items-center justify-center text-on-surface-variant"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={add}
            disabled={!product.inStock}
            className="flex-1 btn-cyan rounded h-10 flex items-center justify-center gap-1.5 font-bn text-body-md disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" /> কার্ট
          </button>
          <button
            onClick={buyNow}
            disabled={!product.inStock}
            className="flex-1 rounded h-10 bg-cyan text-surface-lowest flex items-center justify-center gap-1.5 font-bn font-semibold text-body-md disabled:opacity-40"
          >
            <Zap className="h-4 w-4" /> এখনই কিনুন
          </button>
        </div>
      </div>
    </div>
  );
}

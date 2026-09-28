"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { formatBDT, toBengaliNumber } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { slug, title, image, rating, reviews, price, originalPrice, badge, specs } =
    product;
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ slug, title, price });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link
      href={`/product/${slug}`}
      className="glass-card rounded-lg overflow-hidden flex flex-col transition-shadow"
    >
      <div className="relative aspect-square bg-surface-container">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 220px"
          className="object-cover"
        />
        {badge && (
          <span
            className={`absolute top-2 left-2 rounded px-2 py-0.5 text-label-mono-sm font-mono border ${
              badge.tone === "emerald"
                ? "chip-stock"
                : "bg-violet-soft border-violet/40 text-[#d8b4fe]"
            }`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1 text-body-sm text-on-surface-variant">
          <Star className="h-3.5 w-3.5 fill-cyan text-cyan" strokeWidth={0} />
          <span className="font-mono">{toBengaliNumber(rating.toFixed(1))}</span>
          <span>({toBengaliNumber(reviews)})</span>
        </div>

        <h3 className="font-bn text-body-md font-medium text-on-surface leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {specs.map((spec) => (
            <span key={spec} className="chip-spec rounded font-mono">
              {spec}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div className="leading-tight">
            <p className="font-mono text-price-display text-on-surface">
              {formatBDT(price)}
            </p>
            {originalPrice && (
              <p className="font-mono text-body-sm text-on-surface-muted line-through">
                {formatBDT(originalPrice)}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="কার্টে যোগ করুন"
            className={`h-9 w-9 rounded flex items-center justify-center transition-shadow ${
              justAdded
                ? "bg-emerald text-surface-lowest"
                : "bg-cyan text-surface-lowest hover:shadow-glow-cyan"
            }`}
          >
            {justAdded ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ShoppingCart className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { formatBDT } from "@/lib/format";
import AddToCartButton from "@/components/ui/AddToCartButton";
import type { Product } from "@/lib/types";

export default function CatalogCard({ product }: { product: Product }) {
  const { slug, sku, title, image, specs, pinout, price, inStock } = product;

  return (
    <article className="glass-card rounded-lg p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-label-mono-sm text-on-surface-variant">
          SKU: {sku}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-label-mono-sm font-mono border ${
            inStock
              ? "chip-stock"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
        >
          {inStock ? "স্টকে আছে" : "স্টক নেই"}
        </span>
      </div>

      <Link href={`/product/${slug}`} className="flex gap-3">
        <div className="relative h-24 w-24 shrink-0 rounded-md overflow-hidden bg-surface-container">
          <Image src={image} alt={title} fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bn font-medium text-body-lg text-on-surface leading-snug">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {specs.map((s) => (
              <span key={s} className="chip-spec rounded font-mono">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {pinout.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-surface-lowest/70 border border-outline-soft px-2.5 py-1.5 font-mono text-label-mono-sm text-on-surface-variant">
          <span className="text-on-surface-muted">PINOUT:</span>
          {pinout.map((p) => (
            <span key={p.pin}>
              {p.pin} <span className="text-cyan">[{p.voltage}]</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-label-mono-sm font-mono text-on-surface-variant">ইউনিট মূল্য</p>
          <p className="font-mono text-price-display text-on-surface">{formatBDT(price)}</p>
        </div>
        <AddToCartButton slug={slug} title={title} price={price} disabled={!inStock} />
      </div>
    </article>
  );
}

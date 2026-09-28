"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, X, ArrowRight, LayoutGrid } from "lucide-react";
import { useNavDrawer } from "@/lib/nav-context";
import { CategoryIcon, categoryColor } from "@/lib/category-style";
import { formatBDT } from "@/lib/format";
import type { Category } from "@/lib/types";

type Item = {
  slug: string; title: string; price: number; image: string;
  inStock: boolean; spec: string; categorySlug: string;
};

function NavList({ categories, products, onNavigate }: {
  categories: Category[]; products: Item[]; onNavigate: () => void;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav aria-label="ক্যাটাগরি" className="flex flex-col gap-1">
      <Link
        href="/catalog"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-full px-3 py-2 text-body-md font-medium text-on-surface hover:bg-white/80 transition-colors"
      >
        <span className="h-9 w-9 rounded-full bg-brand text-white flex items-center justify-center">
          <LayoutGrid className="h-4.5 w-4.5" strokeWidth={1.9} />
        </span>
        সব কম্পোনেন্ট
      </Link>

      {categories.map((cat) => {
        const list = products.filter((p) => p.categorySlug === cat.slug);
        const open = openSlug === cat.slug;
        const c = categoryColor(cat.color);
        return (
          <div key={cat.slug} className={`rounded-lg transition-colors ${open ? "bg-white/70" : ""}`}>
            <button
              onClick={() => setOpenSlug(open ? null : cat.slug)}
              aria-expanded={open}
              className="w-full flex items-center gap-3 rounded-full px-3 py-2 text-left hover:bg-white/80 transition-colors"
            >
              <CategoryIcon icon={cat.icon} color={cat.color} size={36} />
              <span className="flex-1 min-w-0 text-body-md font-medium text-on-surface truncate">
                {cat.label}
              </span>
              <span className="font-mono text-label-mono-sm text-on-surface-variant">{list.length}</span>
              <ChevronDown
                className={`h-4 w-4 text-on-surface-variant transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* height animates 0fr -> 1fr */}
            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <ul className="px-2 pb-2 flex flex-col gap-1">
                  {list.length === 0 && (
                    <li className="px-3 py-2 text-body-sm text-on-surface-muted">শীঘ্রই আসছে</li>
                  )}
                  {list.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onNavigate}
                        tabIndex={open ? 0 : -1}
                        className="flex items-center gap-2.5 rounded-md p-1.5 hover:bg-white transition-colors"
                      >
                        <span className="relative h-11 w-11 shrink-0 rounded-md overflow-hidden bg-surface-container border border-outline-soft">
                          <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block text-body-sm font-medium text-on-surface line-clamp-1">{p.title}</span>
                          <span className="block font-mono text-label-mono-sm text-on-surface-variant line-clamp-1">
                            {p.spec || (p.inStock ? "ইন স্টক" : "স্টক নেই")}
                          </span>
                        </span>
                        <span className="font-mono text-label-mono-md shrink-0" style={{ color: c.fg }}>
                          {formatBDT(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/catalog?category=${cat.slug}`}
                      onClick={onNavigate}
                      tabIndex={open ? 0 : -1}
                      className="flex items-center gap-1 px-2 py-1.5 text-label-mono-md font-mono"
                      style={{ color: c.fg }}
                    >
                      সব দেখুন <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export default function CategoryNav({ categories, products }: { categories: Category[]; products: Item[] }) {
  const pathname = usePathname();
  const { open, setOpen } = useNavDrawer();

  useEffect(() => { setOpen(false); }, [pathname, setOpen]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (pathname.startsWith("/vercel/") || pathname.startsWith("/checkout")) return null;

  return (
    <>
      {/* Desktop: frosted rail */}
      <aside className="hidden lg:block w-[300px] shrink-0 pl-margin-desktop pt-5 pb-6">
        <div className="frosted sticky top-[104px] max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar rounded-xl border p-3 shadow-card">
          <p className="px-3 pb-2 pt-1 font-display text-headline-sm font-semibold">ক্যাটাগরি</p>
          <NavList categories={categories} products={products} onNavigate={() => {}} />
        </div>
      </aside>

      {/* Mobile / tablet: frosted slide-in drawer */}
      <div className={`lg:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          aria-label="মেনু বন্ধ করুন"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-brand/20 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`frosted absolute inset-y-0 left-0 w-[86%] max-w-[340px] border-r shadow-2xl flex flex-col transition-transform duration-300 ease-out pt-[env(safe-area-inset-top,0px)] ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-soft">
            <p className="font-display text-headline-sm font-semibold">ক্যাটাগরি</p>
            <button onClick={() => setOpen(false)} aria-label="বন্ধ করুন" className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 pb-10">
            <NavList categories={categories} products={products} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}

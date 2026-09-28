import { Suspense } from "react";
import { getCatalogProducts, getCategories } from "@/lib/queries";
import CatalogFilterBar from "@/components/catalog/CatalogFilterBar";
import CatalogCard from "@/components/catalog/CatalogCard";
import { toBengaliNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = {
  category?: string;
  voltage?: string;
  bus?: string;
  inStock?: string;
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getCatalogProducts({
      category: searchParams.category,
      voltage: searchParams.voltage,
      bus: searchParams.bus,
      inStockOnly: searchParams.inStock === "1",
    }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="px-margin md:px-margin-desktop pt-5 pb-8 max-w-5xl mx-auto">
      <p className="font-mono text-label-mono-sm text-cyan">LAB SPEC // HARDWARE ARCHIVE</p>
      <h1 className="font-bn font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface mt-1">
        {activeCategory?.label ?? "সব হার্ডওয়্যার"}
      </h1>
      <p className="text-body-sm text-on-surface-variant mt-1">
        {toBengaliNumber(products.length)}টি কম্পোনেন্ট উপলব্ধ
      </p>

      <div className="mt-4">
        <Suspense fallback={null}>
          <CatalogFilterBar />
        </Suspense>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {products.length === 0 ? (
          <div className="glass-card rounded-lg p-8 text-center text-on-surface-variant">
            এই ফিল্টারে কোনো প্রোডাক্ট পাওয়া যায়নি। ফিল্টার বদলে দেখুন।
          </div>
        ) : (
          products.map((p) => <CatalogCard key={p.slug} product={p} />)
        )}
      </div>
    </div>
  );
}

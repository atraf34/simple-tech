import { Zap } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/ui/ProductCard";
import { getFlashDeals } from "@/lib/queries";

export default async function FlashDeals() {
  const flashDeals = await getFlashDeals();

  return (
    <section className="mt-8 px-margin md:px-margin-desktop">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-1.5 font-bn font-semibold text-headline-sm text-on-surface">
          <Zap className="h-4.5 w-4.5 text-cyan" strokeWidth={2} fill="rgba(0,240,255,0.3)" />
          ফ্ল্যাশ সেল — সীমিত সময়
        </h2>
        <CountdownTimer targetHours={2} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {flashDeals.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>
    </section>
  );
}

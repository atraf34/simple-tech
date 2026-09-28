import { Sparkles } from "lucide-react";
import { getMarqueeOffers } from "@/lib/queries";

export default async function Marquee() {
  const marqueeOffers = await getMarqueeOffers();
  const items = [...marqueeOffers, ...marqueeOffers];

  return (
    <div className="bg-brand overflow-hidden">
      <div className="flex items-center gap-8 whitespace-nowrap py-1.5 animate-marquee">
        {items.map((offer, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 text-label-mono-sm font-mono text-mint px-margin"
          >
            <Sparkles className="h-3 w-3 shrink-0" strokeWidth={2} />
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
}

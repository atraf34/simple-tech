import Link from "next/link";
import {
  Bot,
  Wifi,
  Cpu,
  Radio,
  Cog,
  BatteryCharging,
  Wrench,
  Layers,
  ChevronRight,
} from "lucide-react";
import { getCategories } from "@/lib/queries";
import type { Category } from "@/lib/types";

const ICONS: Record<Category["icon"], typeof Bot> = {
  bot: Bot,
  wifi: Wifi,
  cpu: Cpu,
  radio: Radio,
  cog: Cog,
  battery: BatteryCharging,
  wrench: Wrench,
  layers: Layers,
};

export default async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="mt-7 px-margin md:px-margin-desktop">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bn font-semibold text-headline-sm text-on-surface">
          হার্ডওয়্যার ক্যাটাগরি
        </h2>
        <Link
          href="/catalog"
          className="flex items-center gap-0.5 text-label-mono-md font-mono text-cyan"
        >
          সবগুলো দেখুন
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5 md:gap-3">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon];
          return (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="glass-card rounded-md flex flex-col items-center justify-center gap-2 py-4 px-1.5 text-center transition-colors"
            >
              <span className="h-9 w-9 rounded-md bg-cyan-soft border border-cyan/25 flex items-center justify-center text-cyan">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <span className="text-body-sm text-on-surface-variant leading-tight line-clamp-1">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

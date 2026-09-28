import Image from "next/image";
import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import { getProjectKits } from "@/lib/queries";
import { formatBDT } from "@/lib/format";

export default async function ProjectKits() {
  const kits = await getProjectKits();

  return (
    <section className="mt-8 px-margin md:px-margin-desktop lg:pl-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-1.5 font-bn font-semibold text-headline-sm text-on-surface">
          <GraduationCap className="h-4.5 w-4.5 text-[#7C3AED]" strokeWidth={2} />
          ইঞ্জিনিয়ারিং প্রজেক্ট কিটস
        </h2>
        <Link
          href="/catalog?category=engineering-kits"
          className="flex items-center gap-0.5 text-label-mono-md font-mono text-cyan"
        >
          গাইডসহ
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {kits.map((kit) => (
          <Link
            key={kit.slug}
            href={`/product/${kit.slug}`}
            className="glass-card rounded-lg p-3 flex gap-3 items-center"
          >
            <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-md overflow-hidden bg-surface-container">
              <Image src={kit.image} alt={kit.title} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-1">
                {kit.kitLevel && (
                  <span className="chip-spec rounded-full font-mono">
                    লেভেল: {kit.kitLevel}
                  </span>
                )}
                {kit.kitTag && (
                  <span className="bg-violet-soft border border-violet/30 text-violet rounded-full px-1.5 py-0.5 text-label-mono-sm font-mono">
                    {kit.kitTag}
                  </span>
                )}
              </div>
              <h3 className="font-bn font-medium text-body-md text-on-surface leading-snug line-clamp-1">
                {kit.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant line-clamp-1">
                {kit.description}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="font-mono text-price-display text-on-surface">
                  {formatBDT(kit.price)}
                </p>
                <span className="btn-cyan px-3 py-1.5 text-label-mono-md font-mono font-medium shrink-0 inline-block">
                  অর্ডার করুন
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { CategoryIcon, categoryColor } from "@/lib/category-style";

export default async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="mt-7 px-margin md:px-margin-desktop lg:pr-margin-desktop lg:pl-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-headline-sm text-on-surface">হার্ডওয়্যার ক্যাটাগরি</h2>
        <Link href="/catalog" className="flex items-center gap-0.5 text-label-mono-md font-mono text-cyan">
          সবগুলো দেখুন
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-4 xl:grid-cols-8 gap-2.5 md:gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog?category=${cat.slug}`}
            className="glass-card rounded-lg flex flex-col items-center justify-center gap-2 py-4 px-1.5 text-center"
            style={{ ["--tint" as string]: categoryColor(cat.color).ring }}
          >
            <CategoryIcon icon={cat.icon} color={cat.color} size={42} />
            <span className="text-body-sm text-on-surface-variant leading-tight line-clamp-2">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

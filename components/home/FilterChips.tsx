import { SlidersHorizontal } from "lucide-react";
import { filterTags } from "@/lib/data";

export default function FilterChips() {
  return (
    <div className="mt-4 px-margin md:px-margin-desktop lg:pl-8">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="shrink-0 flex items-center gap-1.5 text-label-mono-md font-mono text-on-surface-variant pr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
          ফিল্টার:
        </span>
        {filterTags.map((tag) => (
          <button
            key={tag}
            className="shrink-0 chip-spec rounded-full px-2.5 py-1 text-label-mono-md font-mono hover:border-cyan/40 hover:text-cyan transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

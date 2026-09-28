"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const VOLTAGES = ["3.3V", "5V", "12V"];
const BUSES = ["I2C", "SPI", "GPIO", "Analog"];

export default function CatalogFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const voltage = searchParams.get("voltage");
  const bus = searchParams.get("bus");
  const inStockOnly = searchParams.get("inStock") === "1";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="shrink-0 text-label-mono-md font-mono text-on-surface-variant pr-1">
          ভোল্টেজ:
        </span>
        {VOLTAGES.map((v) => (
          <button
            key={v}
            onClick={() => updateParam("voltage", voltage === v ? null : v)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-label-mono-md font-mono border transition-colors ${
              voltage === v
                ? "bg-cyan text-surface-lowest border-cyan"
                : "chip-spec hover:border-cyan/40 hover:text-cyan"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="shrink-0 text-label-mono-md font-mono text-on-surface-variant pr-1">
          বাস:
        </span>
        {BUSES.map((b) => (
          <button
            key={b}
            onClick={() => updateParam("bus", bus === b ? null : b)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-label-mono-md font-mono border transition-colors ${
              bus === b
                ? "bg-violet text-white border-violet"
                : "chip-spec hover:border-violet/40 hover:text-violet"
            }`}
          >
            {b}
          </button>
        ))}

        <button
          onClick={() => updateParam("inStock", inStockOnly ? null : "1")}
          className={`shrink-0 rounded-full px-2.5 py-1 text-label-mono-md font-mono border transition-colors ml-auto ${
            inStockOnly
              ? "chip-stock"
              : "chip-spec hover:border-emerald/40 hover:text-emerald-light"
          }`}
        >
          শুধু ইন-স্টক
        </button>
      </div>
    </div>
  );
}

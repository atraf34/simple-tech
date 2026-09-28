import { ArrowRight, Cpu } from "lucide-react";
import { getHeroBanner } from "@/lib/queries";

export default async function HeroBanner() {
  const content = await getHeroBanner();

  return (
    <section className="px-margin md:px-margin-desktop lg:pl-8 pt-5">
      <div className="relative overflow-hidden rounded-xl border border-outline-soft bg-gradient-to-br from-white via-cyan-soft to-[#E8F0FF] p-6 md:p-12 shadow-card">
        {/* faint calibration rings, echoing the precision-instrument theme */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 md:h-[26rem] md:w-[26rem] text-mint/20"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="45" />
          <path d="M100 0v200M0 100h200" strokeDasharray="2 6" />
        </svg>

        <span className="orb h-56 w-56 -left-10 -bottom-16 bg-mint/40" />
        <span className="orb h-48 w-48 right-10 top-4 bg-[#2563EB]/25 [animation-delay:-5s]" />
        <span className="orb h-44 w-44 right-1/3 -bottom-10 bg-[#7C3AED]/20 [animation-delay:-9s]" />

        <div className="frosted frost-in relative max-w-xl rounded-xl border p-5 md:p-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-border bg-cyan-soft px-3 py-1 text-label-mono-sm font-mono text-cyan">
            <span className="stock-dot" />
            {content.eyebrow}
          </span>

          <h1 className="mt-4 font-bold text-headline-lg-mobile md:text-headline-xl text-on-surface">
            {content.headline}
          </h1>

          <p className="mt-3 text-body-md md:text-body-lg text-on-surface-variant">
            {content.subtext}
          </p>

          <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-outline-soft bg-white/80 backdrop-blur p-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-10 w-10 shrink-0 rounded-full bg-cyan-soft border border-cyan-border flex items-center justify-center text-cyan">
                <Cpu className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="leading-tight min-w-0">
                <p className="font-mono text-label-mono-lg text-on-surface truncate">
                  {content.promoTitle}
                </p>
                <p className="text-body-sm text-emerald-light">{content.promoSubtitle}</p>
              </div>
            </div>
            <button className="btn-cyan shrink-0 flex items-center gap-1.5 px-5 py-2.5 text-label-mono-md font-semibold">
              {content.promoCta}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

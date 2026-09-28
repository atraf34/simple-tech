import { ArrowRight, Cpu } from "lucide-react";
import { getHeroBanner } from "@/lib/queries";

export default async function HeroBanner() {
  const content = await getHeroBanner();

  return (
    <section className="px-margin md:px-margin-desktop pt-5">
      <div className="relative overflow-hidden rounded-lg glass-card p-5 md:p-10">
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.18), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%)" }}
        />

        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan-soft px-3 py-1 text-label-mono-sm font-mono text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
            {content.eyebrow}
          </span>

          <h1 className="mt-4 font-bn font-bold text-headline-lg-mobile md:text-headline-xl text-on-surface">
            {content.headline}
          </h1>

          <p className="mt-3 text-body-md md:text-body-lg text-on-surface-variant">
            {content.subtext}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-outline-soft bg-surface-lowest/60 p-3">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded bg-violet-soft border border-violet/40 flex items-center justify-center text-violet">
                <Cpu className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="leading-tight">
                <p className="font-mono text-label-mono-lg text-on-surface">
                  {content.promoTitle}
                </p>
                <p className="text-body-sm text-emerald-light">{content.promoSubtitle}</p>
              </div>
            </div>
            <button className="btn-cyan shrink-0 rounded flex items-center gap-1.5 px-4 py-2 font-mono text-label-mono-md font-medium">
              {content.promoCta}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

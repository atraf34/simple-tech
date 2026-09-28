"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { categoryColor } from "@/lib/category-style";
import type { Slide } from "@/lib/types";

export default function HeroCarouselView({ slides, intervalSec }: { slides: Slide[]; intervalSec: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = slides.length > 1;

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + slides.length) % slides.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  // keep dots in sync with native swipe / scroll-snap
  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  useEffect(() => {
    if (!many || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => goTo(index + 1), intervalSec * 1000);
    return () => clearInterval(t);
  }, [many, paused, index, intervalSec, goTo]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="অফার ও কিট"
      className="px-margin md:px-margin-desktop lg:pl-8 pt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl border border-outline-soft shadow-card h-[50vh] min-h-[300px] max-h-[540px]">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {slides.map((s, i) => {
            const c = categoryColor(s.theme);
            const inner = (
              <>
                {s.image ? (
                  <Image src={s.image} alt={s.title} fill unoptimized priority={i === 0} sizes="100vw" className="object-cover" />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${c.bg} 0%, #ffffff 45%, ${c.ring} 100%)` }}
                  >
                    <span className="orb h-64 w-64 -right-10 -top-10" style={{ background: c.fg, opacity: 0.22 }} />
                    <span className="orb h-56 w-56 right-1/3 -bottom-16 [animation-delay:-6s]" style={{ background: c.fg, opacity: 0.14 }} />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
                  <div className="frosted max-w-xl rounded-xl border p-4 md:p-6">
                    {s.badge && (
                      <span
                        className="inline-block rounded-full px-3 py-1 text-label-mono-sm font-mono border"
                        style={{ background: c.bg, color: c.fg, borderColor: c.ring }}
                      >
                        {s.badge}
                      </span>
                    )}
                    <h2 className="mt-2 font-bold text-headline-lg-mobile md:text-headline-xl text-on-surface leading-tight">
                      {s.title}
                    </h2>
                    {s.subtitle && (
                      <p className="mt-1.5 text-body-md md:text-body-lg text-on-surface-variant line-clamp-2">{s.subtitle}</p>
                    )}
                    {s.cta && (
                      <span className="btn-cyan mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 text-body-md font-semibold">
                        {s.cta}
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </span>
                    )}
                  </div>
                </div>
              </>
            );
            return (
              <div
                key={s.id}
                className="relative h-full w-full shrink-0 snap-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${slides.length}`}
              >
                {s.link ? (
                  <Link href={s.link} className="absolute inset-0 block">{inner}</Link>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>

        {many && (
          <>
            <button
              aria-label="আগের স্লাইড"
              onClick={() => goTo(index - 1)}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full frosted border shadow-card hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="পরের স্লাইড"
              onClick={() => goTo(index + 1)}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full frosted border shadow-card hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute right-4 top-4 md:right-6 md:top-6 flex gap-1.5 frosted rounded-full border px-2.5 py-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`স্লাইড ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-cyan" : "w-2 bg-outline"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

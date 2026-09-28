"use client";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, ImagePlus } from "lucide-react";
import { CATEGORY_COLORS, categoryColor } from "@/lib/category-style";
import { api, uploadFile, input, btn, btnGhost, danger } from "./shared";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

const blank = () => ({
  id: Math.random().toString(36).slice(2, 9),
  image: "", badge: "", title: "", subtitle: "", cta: "", link: "/catalog", theme: "emerald", active: true,
});

export default function AdminSlides() {
  const [cfg, setCfg] = useState<{ enabled: boolean; intervalSec: number; slides: any[] } | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api("/api/admin/content")
      .then(({ content }) => {
        const v = content.home_slides;
        setCfg({ enabled: v?.enabled !== false, intervalSec: v?.intervalSec ?? 5, slides: v?.slides ?? [] });
      })
      .catch((e) => setMsg(e.message));
  }, []);

  if (!cfg) return <p className="text-body-sm text-on-surface-variant">{msg || "লোড হচ্ছে..."}</p>;

  const setSlide = (i: number, patch: any) =>
    setCfg({ ...cfg, slides: cfg.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= cfg.slides.length) return;
    const a = [...cfg.slides];
    [a[i], a[j]] = [a[j], a[i]];
    setCfg({ ...cfg, slides: a });
  };

  async function save() {
    try {
      await api("/api/admin/content", "PUT", { key: "home_slides", value: cfg });
      setMsg("সেভ হয়েছে ✓ — হোমপেজ রিফ্রেশ করে দেখুন");
    } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card rounded-lg p-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-body-md font-medium">
          <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} className="h-4 w-4 accent-[#059669]" />
          হোমপেজে স্লাইডার দেখাও
        </label>
        <label className="flex items-center gap-2 text-body-md">
          অটো-স্লাইড
          <input type="number" min={2} max={15} value={cfg.intervalSec} onChange={(e) => setCfg({ ...cfg, intervalSec: Number(e.target.value) })} className={`${input} !w-20`} />
          সেকেন্ড
        </label>
        <button className={`${btn} ml-auto`} onClick={save}>সব সেভ করুন</button>
      </div>
      {msg && <p className="text-body-sm text-cyan">{msg}</p>}
      <p className="text-body-sm text-on-surface-variant">
        কিট, অফার বা নতুন প্রোডাক্টের ছবি দিয়ে স্লাইড বানান। ছবির সাইজ প্রায় ১৬০০×৭০০ (ল্যান্ডস্কেপ) হলে সবচেয়ে ভালো। ছবি না দিলে রঙিন ব্যাকগ্রাউন্ড দেখাবে।
      </p>

      {cfg.slides.map((s, i) => {
        const c = categoryColor(s.theme);
        return (
          <div key={s.id} className={`glass-card rounded-lg p-3 flex flex-col gap-3 ${s.active ? "" : "opacity-60"}`}>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-28 shrink-0 rounded-md overflow-hidden border border-outline-soft" style={{ background: `linear-gradient(135deg, ${c.bg}, ${c.ring})` }}>
                {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <p className="flex-1 min-w-0 font-medium truncate">{s.title || "নতুন স্লাইড"}</p>
              <button aria-label="উপরে" onClick={() => move(i, -1)} className="p-2 rounded-full hover:bg-surface-low"><ArrowUp className="h-4 w-4" /></button>
              <button aria-label="নিচে" onClick={() => move(i, 1)} className="p-2 rounded-full hover:bg-surface-low"><ArrowDown className="h-4 w-4" /></button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <input className={input} placeholder="শিরোনাম (যেমন: নতুন IoT কিট)" value={s.title} onChange={(e) => setSlide(i, { title: e.target.value })} />
              <input className={input} placeholder="ছোট ব্যাজ (যেমন: ২৫% ছাড়)" value={s.badge} onChange={(e) => setSlide(i, { badge: e.target.value })} />
              <input className={`${input} sm:col-span-2`} placeholder="সাবটাইটেল" value={s.subtitle} onChange={(e) => setSlide(i, { subtitle: e.target.value })} />
              <input className={input} placeholder="বাটনের লেখা (যেমন: কিনুন)" value={s.cta} onChange={(e) => setSlide(i, { cta: e.target.value })} />
              <input className={input} placeholder="লিংক (যেমন: /product/esp32-kit)" value={s.link} onChange={(e) => setSlide(i, { link: e.target.value })} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className={`${btnGhost} cursor-pointer inline-flex items-center gap-1.5`}>
                <ImagePlus className="h-4 w-4" />
                {busy === s.id ? "আপলোড হচ্ছে..." : s.image ? "ছবি বদলান" : "ছবি আপলোড"}
                <input type="file" accept="image/*" hidden onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setBusy(s.id);
                  try { setSlide(i, { image: await uploadFile(f, "slides") }); } catch (err: any) { setMsg(err.message); }
                  setBusy(null);
                }} />
              </label>
              {s.image && <button className="text-body-sm text-on-surface-variant underline" onClick={() => setSlide(i, { image: "" })}>ছবি সরান</button>}
              <div className="flex gap-1.5">
                {Object.entries(CATEGORY_COLORS).map(([k, col]) => (
                  <button key={k} aria-label={k} onClick={() => setSlide(i, { theme: k })}
                    className={`h-6 w-6 rounded-full border-2 ${s.theme === k ? "border-brand" : "border-white"}`} style={{ background: col.fg }} />
                ))}
              </div>
              <label className="flex items-center gap-1.5 text-body-sm ml-auto">
                <input type="checkbox" checked={s.active} onChange={(e) => setSlide(i, { active: e.target.checked })} className="accent-[#059669]" /> চালু
              </label>
              <button className={`${danger} inline-flex items-center gap-1`} onClick={() => confirm("এই স্লাইড মুছবেন?") && setCfg({ ...cfg, slides: cfg.slides.filter((_, idx) => idx !== i) })}>
                <Trash2 className="h-3.5 w-3.5" /> মুছুন
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex gap-2">
        <button className={btnGhost} onClick={() => setCfg({ ...cfg, slides: [...cfg.slides, blank()] })}>＋ নতুন স্লাইড</button>
        <button className={btn} onClick={save}>সেভ করুন</button>
      </div>
    </div>
  );
}

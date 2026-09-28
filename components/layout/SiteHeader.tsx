import { Search, Bell, User, MapPin } from "lucide-react";
import Link from "next/link";
import Marquee from "@/components/home/Marquee";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-surface-lowest/95 backdrop-blur-md border-b border-outline-soft">
      <div className="max-w-[1440px] mx-auto flex items-center gap-3 px-margin md:px-margin-desktop py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="h-9 w-9 rounded bg-cyan-soft border border-cyan/40 flex items-center justify-center font-mono text-[10px] font-bold text-cyan tracking-tight">
            SiM
          </span>
          <span className="hidden xs:flex flex-col leading-none">
            <span className="font-bn font-bold text-body-lg text-on-surface tracking-tight">
              SiMPLE TECHNOLOGIES
            </span>
            <span className="flex items-center gap-1 text-label-mono-sm font-mono text-on-surface-variant mt-0.5">
              <MapPin className="h-3 w-3" strokeWidth={2} />
              ঢাকা, বাংলাদেশ
            </span>
          </span>
        </Link>

        <div className="flex-1" />

        <button
          aria-label="সার্চ করুন"
          className="h-10 w-10 flex items-center justify-center rounded border border-outline-soft text-on-surface-variant hover:text-cyan hover:border-cyan/50 transition-colors"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          aria-label="নোটিফিকেশন"
          className="relative h-10 w-10 flex items-center justify-center rounded border border-outline-soft text-on-surface-variant hover:text-cyan hover:border-cyan/50 transition-colors"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan shadow-glow-cyan" />
        </button>
        <Link
          href="/account"
          aria-label="প্রোফাইল"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container border border-outline-soft text-on-surface hover:border-cyan/50 transition-colors"
        >
          <User className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>

      <Marquee />
    </header>
  );
}

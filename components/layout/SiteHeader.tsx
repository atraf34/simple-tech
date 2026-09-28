import { Search, Bell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/home/Marquee";
import MenuButton from "./MenuButton";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 frosted border-b">
      <div className="max-w-[1440px] mx-auto flex items-center gap-3 px-margin md:px-margin-desktop py-3">
        <MenuButton />
        <Link href="/" aria-label="SiMPLE TECHNOLOGIES হোম" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="SiMPLE TECHNOLOGIES"
            width={1126}
            height={246}
            priority
            className="h-8 md:h-9 w-auto"
          />
        </Link>

        <div className="flex-1" />

        <button
          aria-label="সার্চ করুন"
          className="h-10 w-10 flex items-center justify-center rounded-full border border-outline-soft bg-white/80 text-on-surface-variant hover:text-cyan hover:border-mint transition-colors"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          aria-label="নোটিফিকেশন"
          className="relative h-10 w-10 flex items-center justify-center rounded-full border border-outline-soft bg-white/80 text-on-surface-variant hover:text-cyan hover:border-mint transition-colors"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute top-2 right-2.5 stock-dot" />
        </button>
        <Link
          href="/account"
          aria-label="প্রোফাইল"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-brand text-white hover:bg-cyan-deep transition-colors"
        >
          <User className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>

      <Marquee />
    </header>
  );
}

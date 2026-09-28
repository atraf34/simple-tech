"use client";
import { Menu } from "lucide-react";
import { useNavDrawer } from "@/lib/nav-context";

export default function MenuButton() {
  const { setOpen } = useNavDrawer();
  return (
    <button
      aria-label="ক্যাটাগরি মেনু খুলুন"
      onClick={() => setOpen(true)}
      className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full border border-outline-soft bg-white/80 text-on-surface hover:border-mint transition-colors"
    >
      <Menu className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}

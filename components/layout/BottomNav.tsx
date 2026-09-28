"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/catalog", label: "ক্যাটাগরি", icon: LayoutGrid },
  { href: "/cart", label: "কার্ট", icon: ShoppingCart },
  { href: "/account", label: "প্রোফাইল", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  // These screens have their own fixed bottom bars / are separate apps
  if (
    pathname.startsWith("/product/") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/vercel/")
  ) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-lowest/95 backdrop-blur-md border-t border-outline-soft pb-safe">
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          const showBadge = href === "/cart" && count > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-label-mono-sm font-mono transition-colors ${
                active ? "text-cyan" : "text-on-surface-variant"
              }`}
            >
              <span className="relative">
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2 : 1.75}
                  fill={active ? "rgba(0,210,133,0.18)" : "none"}
                />
                {showBadge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-violet text-white text-[9px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import type { Metadata, Viewport } from "next";
import {
  Noto_Sans_Bengali,
  JetBrains_Mono,
  Space_Grotesk,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import BottomNav from "@/components/layout/BottomNav";
import CategorySidebar from "@/components/layout/CategorySidebar";
import { NavDrawerProvider } from "@/lib/nav-context";
import { CartProvider } from "@/lib/cart-context";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Always render on request so admin edits (banner, offers, prices) show instantly
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SiMPLE TECHNOLOGIES — রোবোটিক্স ও IoT স্টোর",
  description:
    "বাংলাদেশের ইঞ্জিনিয়ারিং শিক্ষার্থী ও IoT ডেভেলপারদের জন্য রোবোটিক্স, মাইক্রোকন্ট্রোলার ও সেন্সর মার্কেটপ্লেস — SiMPLE TECHNOLOGIES।",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F3F8F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-bn bg-background text-on-surface min-h-screen flex flex-col">
        <CartProvider>
          <NavDrawerProvider>
            <SiteHeader />
            <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
              <CategorySidebar />
              <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
            </div>
            <BottomNav />
          </NavDrawerProvider>
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import BottomNav from "@/components/layout/BottomNav";
import { CartProvider } from "@/lib/cart-context";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
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
  themeColor: "#0e1321",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`dark ${notoSansBengali.variable} ${jetbrainsMono.variable}`}>
      <body className="font-bn bg-background text-on-surface min-h-screen flex flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

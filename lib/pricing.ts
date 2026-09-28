import type { PaymentMethod } from "@/lib/types";

export const DELIVERY_FEES = {
  inside_dhaka: 60,
  outside_dhaka: 120,
} as const;

export type DeliveryZone = keyof typeof DELIVERY_FEES;

export const COUPONS: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  WELCOME10: { type: "percent", value: 10, label: "নতুন গ্রাহক ১০% ছাড়" },
  ROBOTECH50: { type: "flat", value: 50, label: "স্টুডেন্ট কুপন" },
};

export function calcDiscount(code: string | undefined, subtotal: number): number {
  if (!code) return 0;
  const c = COUPONS[code.trim().toUpperCase()];
  if (!c) return 0;
  const raw = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  return Math.min(raw, subtotal);
}

export const PAYMENT_METHODS: { id: PaymentMethod; name: string; note: string }[] = [
  { id: "bkash", name: "বিকাশ (bKash)", note: "ইনস্ট্যান্ট পেমেন্ট — অর্ডারের পর নম্বরে সেন্ড মানি করুন" },
  { id: "nagad", name: "নগদ (Nagad)", note: "অর্ডারের পর নগদ নম্বরে সেন্ড মানি করুন" },
  { id: "rocket", name: "রকেট (Rocket)", note: "ডাচ-বাংলা মোবাইল ব্যাংকিং" },
  { id: "cod", name: "ক্যাশ অন ডেলিভারি (COD)", note: "পণ্য হাতে পেয়ে টাকা দিন" },
];

import type { Category, Product, HeroBannerContent, HomeSlides } from "@/lib/types";

// Mirrors supabase/schema.sql seed data 1:1. Keep the two in sync if you
// change one — this file is what renders the site before Supabase is
// connected, and is also the safety net if a Supabase call ever fails.

export const categories: Category[] = [
  { slug: "robotics", label: "রোবোটিক্স", icon: "bot", color: "violet" },
  { slug: "iot", label: "আইওটি ও কানেক্টিভিটি", icon: "wifi", color: "blue" },
  { slug: "microcontrollers", label: "মাইক্রোকন্ট্রোলার", icon: "cpu", color: "emerald" },
  { slug: "sensors", label: "সেন্সর ও মডিউল", icon: "radio", color: "cyan" },
  { slug: "motors", label: "মোটর ও ড্রাইভার", icon: "cog", color: "orange" },
  { slug: "power", label: "পাওয়ার ও ব্যাটারি", icon: "battery", color: "amber" },
  { slug: "tools", label: "টুলস ও ল্যাব", icon: "wrench", color: "rose" },
  { slug: "engineering-kits", label: "ইঞ্জিনিয়ারিং কিটস", icon: "layers", color: "pink" },
];

export const filterTags = [
  "ESP32",
  "L298N",
  "সেন্সর",
  "সোল্ডারিং",
  "LiPo",
  "Arduino",
  "রেজিস্টর",
];

export const marqueeOffers: string[] = [
  "নতুন গ্রাহকদের জন্য ১০% ছাড় — কোড: WELCOME10",
  "৫০০৳+ অর্ডারে ঢাকার ভেতরে ফ্রি ডেলিভারি",
  "স্টুডেন্ট আইডি দেখিয়ে প্রজেক্ট কিটে বিশেষ ছাড়",
  "ক্যাশ অন ডেলিভারি সারাদেশে উপলব্ধ",
];

export const heroBanner: HeroBannerContent = {
  eyebrow: "অরিজিনাল পার্টস ও ফাস্ট ডেলিভারি",
  headline: "ভবিষ্যতের রোবোটিক্স প্রযুক্তি এখন আপনার হাতে",
  subtext:
    "শীর্ষমানের আরডুইনো, রোভার কম্পোনেন্ট ও এম্বেডেড সেন্সর ল্যাব এক্সেস করুন এক ক্লিকে।",
  promoTitle: "IoT স্টার্টার কিট",
  promoSubtitle: "২৫% স্পেশাল ফ্ল্যাশ ছাড়!",
  promoCta: "ল্যাব এক্সপ্লোর",
};

export const products: Product[] = [
  {
    slug: "arduino-uno-r3",
    sku: "RK-ARD-001",
    title: "Arduino Uno R3 (অরিজিনাল চিপ)",
    description:
      "ATmega328P ভিত্তিক অরিজিনাল Arduino Uno R3, সব ধরনের বিগিনার প্রজেক্টের জন্য আদর্শ।",
    categorySlug: "microcontrollers",
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=800&auto=format&fit=crop",
    ],
    price: 850,
    originalPrice: 1050,
    rating: 4.9,
    reviews: 130,
    inStock: true,
    badge: { label: "ইন স্টক", tone: "emerald" },
    specs: ["16MHz", "5V Logic"],
    specTable: [
      { label: "মাইক্রোকন্ট্রোলার", value: "ATmega328P" },
      { label: "ক্লক স্পিড", value: "16 MHz" },
      { label: "অপারেটিং ভোল্টেজ", value: "5V" },
      { label: "ডিজিটাল I/O পিন", value: "14" },
    ],
    pinout: [
      { pin: "5V", voltage: "5V" },
      { pin: "GND", voltage: "GND" },
      { pin: "A0-A5", voltage: "Analog" },
    ],
    bundleItems: [],
    isFlashDeal: true,
    isKit: false,
    voltage: "5V",
    bus: "GPIO",
  },
  {
    slug: "esp32-wifi-ble-devkit",
    sku: "RK-ESP32-C38",
    title: "ESP32 Wi-Fi + Bluetooth ডুয়াল কোর ডেভেলপমেন্ট বোর্ড (Type-C)",
    description:
      "Xtensa Dual-Core LX6 @ 240MHz, 520KB SRAM, 4MB Flash সহ ESP32 DevKit — Wi-Fi ও BLE একসাথে।",
    categorySlug: "microcontrollers",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    ],
    price: 520,
    originalPrice: 650,
    rating: 4.9,
    reviews: 84,
    inStock: true,
    badge: { label: "ইন-স্টক রেপ্লিকা", tone: "emerald" },
    specs: ["Dual Core", "38 Pin"],
    specTable: [
      { label: "প্রসেসর কোর", value: "Xtensa Dual-Core 32-bit LX6 @ 240MHz" },
      { label: "SRAM / মেমোরি", value: "520 KB SRAM" },
      { label: "ফ্ল্যাশ স্টোরেজ", value: "4MB SPI Flash" },
      { label: "ওয়াই-ফাই কানেকশন", value: "802.11 b/g/n (150 Mbps পর্যন্ত)" },
      { label: "ব্লুটুথ ভার্সন", value: "Bluetooth v4.2 BR/EDR এবং BLE" },
      { label: "পেরিফেরাল ইন্টারফেস", value: "GPIO, ADC, DAC, I2C, SPI, UART, PWM" },
      { label: "অপারেটিং ভোল্টেজ", value: "3.3V Logic / 5V USB Input" },
    ],
    pinout: [
      { pin: "3V3", voltage: "3.3V" },
      { pin: "GND", voltage: "GND" },
      { pin: "GPIO21/22", voltage: "I2C" },
    ],
    bundleItems: [
      { title: "ESP32 DevKit Type-C বোর্ড", subtitle: "মেইন মাইক্রোকন্ট্রোলার", price: 520 },
      { title: "৮৩০-পয়েন্ট প্রোটোটাইপ ব্রেডবোর্ড", subtitle: "MB-102 সেনরেবল", price: 100 },
      { title: "৪০ পিস মেল-টু-মেল জাম্পার ওয়্যার", subtitle: "20cm কপার ওয়্যার", price: 70 },
      { title: "0.96 inch I2C OLED ডিসপ্লে মডিউল", subtitle: "128x64 SSD1306", price: 280 },
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isFlashDeal: true,
    isKit: false,
    voltage: "3.3V",
    bus: "I2C",
  },
  {
    slug: "hc-sr04-ultrasonic",
    sku: "RB-SN-004",
    title: "HC-SR04 আল্ট্রাসনিক ডিস্ট্যান্স সেন্সর মডিউল",
    description:
      "রোবোটিক্স ও অবস্ট্যাকল এভয়েডেন্স প্রজেক্টের জন্য সবচেয়ে ব্যবহৃত ডিস্ট্যান্স সেন্সর।",
    categorySlug: "sensors",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    ],
    price: 120,
    rating: 4.7,
    reviews: 62,
    inStock: true,
    badge: { label: "ইন স্টক", tone: "emerald" },
    specs: ["5V DC", "2cm-400cm"],
    specTable: [
      { label: "অপারেটিং ভোল্টেজ", value: "5V DC" },
      { label: "রেঞ্জ", value: "2cm–400cm" },
      { label: "ট্রিগার/ইকো", value: "Digital" },
    ],
    pinout: [
      { pin: "VCC", voltage: "5V" },
      { pin: "TRIG", voltage: "D" },
      { pin: "ECHO", voltage: "D" },
      { pin: "GND", voltage: "GND" },
    ],
    bundleItems: [],
    isFlashDeal: false,
    isKit: false,
    voltage: "5V",
    bus: "GPIO",
  },
  {
    slug: "dht22-temp-humidity",
    sku: "RB-SN-022",
    title: "DHT22 ডিজিটাল টেম্পারেচার ও হিউমিডিটি সেন্সর",
    description:
      "নির্ভুল টেম্পারেচার ও হিউমিডিটি মাপার জন্য ওয়েদার স্টেশন প্রজেক্টে ব্যবহৃত হয়।",
    categorySlug: "sensors",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    ],
    price: 340,
    rating: 4.6,
    reviews: 41,
    inStock: true,
    specs: ["3.3V-6V DC", "-40°C ~ +80°C"],
    specTable: [
      { label: "অপারেটিং ভোল্টেজ", value: "3.3V–6V DC" },
      { label: "রেঞ্জ", value: "-40°C ~ +80°C" },
    ],
    pinout: [
      { pin: "VDD", voltage: "3.3-5V" },
      { pin: "DATA", voltage: "Sig" },
      { pin: "NC", voltage: "-" },
      { pin: "GND", voltage: "GND" },
    ],
    bundleItems: [],
    isFlashDeal: false,
    isKit: false,
    voltage: "5V",
    bus: "GPIO",
  },
  {
    slug: "smart-rover-4wd",
    sku: "RK-KIT-101",
    title: "রোভার কার স্মার্ট কিট (4WD)",
    description: "অবস্ট্যাকল এভয়েডেন্স ও ব্লুটুথ কন্ট্রোল প্রজেক্ট, সম্পূর্ণ গাইডসহ।",
    categorySlug: "engineering-kits",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    ],
    price: 1850,
    rating: 4.8,
    reviews: 34,
    inStock: true,
    specs: [],
    specTable: [],
    pinout: [],
    bundleItems: [],
    isFlashDeal: false,
    isKit: true,
    kitLevel: "বিগিনার",
    kitTag: "টিউটোরিয়াল সহ",
  },
  {
    slug: "iot-home-automation",
    sku: "RK-KIT-102",
    title: "আইওটি হোম অটোমেশন কিট",
    description: "মোবাইল অ্যাপ দিয়ে ঘরের ফ্যান ও লাইট নিয়ন্ত্রণ করুন Blynk দিয়ে।",
    categorySlug: "engineering-kits",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    ],
    price: 2150,
    rating: 4.7,
    reviews: 28,
    inStock: true,
    specs: [],
    specTable: [],
    pinout: [],
    bundleItems: [],
    isFlashDeal: false,
    isKit: true,
    kitLevel: "ইন্টারমিডিয়েট",
    kitTag: "Blynk ও MQTT",
  },
];

export const trustBadges = [
  {
    title: "সারাদেশে ৩ দিনে ডেলিভারি",
    subtitle: "ক্যাশ অন ডেলিভারি",
    icon: "truck" as const,
  },
  {
    title: "১০০% অরিজিনাল",
    subtitle: "ল্যাব টেস্টেড চিপস",
    icon: "shield" as const,
  },
  {
    title: "প্রজেক্ট সাপোর্ট",
    subtitle: "সার্কিট ও কোড হেল্প",
    icon: "graduation" as const,
  },
];

// Shown until the admin adds real slides from the panel.
export const homeSlides: HomeSlides = {
  enabled: true,
  intervalSec: 5,
  slides: [
    { id: "d1", image: "", badge: "ইঞ্জিনিয়ারিং কিটস", title: "প্রজেক্ট কিট — গাইড ও কোডসহ", subtitle: "IoT, রোবোটিক্স ও অটোমেশনের রেডি-টু-বিল্ড কিট", cta: "কিট দেখুন", link: "/catalog?category=engineering-kits", theme: "violet", active: true },
    { id: "d2", image: "", badge: "ফ্ল্যাশ অফার", title: "সীমিত সময়ে ২৫% পর্যন্ত ছাড়", subtitle: "জনপ্রিয় সেন্সর ও মাইক্রোকন্ট্রোলারে বিশেষ দাম", cta: "অফার দেখুন", link: "/catalog", theme: "emerald", active: true },
    { id: "d3", image: "", badge: "ডেলিভারি", title: "সারাদেশে ক্যাশ অন ডেলিভারি", subtitle: "ঢাকায় ২৪ ঘণ্টায়, ঢাকার বাইরে ৪৮-৭২ ঘণ্টায়", cta: "কেনাকাটা করুন", link: "/catalog", theme: "blue", active: true },
  ],
};

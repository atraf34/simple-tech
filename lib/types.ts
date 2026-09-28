export type Category = {
  slug: string;
  label: string;
  icon: string;
  color?: string;
};

export type Badge = { label: string; tone: "emerald" | "violet" };

export type SpecRow = { label: string; value: string };
export type PinoutRow = { pin: string; voltage: string };
export type BundleItem = { title: string; subtitle: string; price: number };

export type Product = {
  slug: string;
  sku: string;
  title: string;
  description?: string;
  categorySlug?: string;
  image: string;
  gallery: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: Badge;
  specs: string[];
  specTable: SpecRow[];
  pinout: PinoutRow[];
  bundleItems: BundleItem[];
  youtubeUrl?: string;
  isFlashDeal: boolean;
  isKit: boolean;
  kitLevel?: string;
  kitTag?: string;
  voltage?: string;
  bus?: string;
};

export type HeroBannerContent = {
  eyebrow: string;
  headline: string;
  subtext: string;
  promoTitle: string;
  promoSubtitle: string;
  promoCta: string;
};

export type CatalogFilters = {
  category?: string;
  voltage?: string;
  bus?: string;
  inStockOnly?: boolean;
};

export type OrderItem = { slug: string; title: string; price: number; qty: number };

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "cod";

export type Order = {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestName: string;
  guestPhone: string;
  deliveryAddress: string;
  deliveryZone: "inside_dhaka" | "outside_dhaka";
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
};

export type WarrantyDocument = {
  id: string;
  customerId?: string;
  orderId?: string;
  productName: string;
  fileUrl: string;
  warrantyExpiry?: string;
  uploadedAt: string;
};

export type Slide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: string;
  link: string;
  theme: string; // colour key from category-style palette
  active: boolean;
};

export type HomeSlides = {
  enabled: boolean;
  intervalSec: number;
  slides: Slide[];
};

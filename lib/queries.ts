import { getSupabaseServerClient } from "@/lib/supabase/server";
import * as mock from "@/lib/data";
import type {
  Category,
  Product,
  HeroBannerContent,
  CatalogFilters,
} from "@/lib/types";

// ---------------------------------------------------------------------
// Row → app-type mappers (snake_case DB columns -> camelCase app types)
// ---------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductRow(row: any): Product {
  return {
    slug: row.slug,
    sku: row.sku,
    title: row.title,
    description: row.description ?? undefined,
    categorySlug: row.category_slug ?? undefined,
    image: row.image,
    gallery: row.gallery ?? [],
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    inStock: row.in_stock,
    badge:
      row.badge_label && row.badge_tone
        ? { label: row.badge_label, tone: row.badge_tone }
        : undefined,
    specs: row.specs ?? [],
    specTable: row.spec_table ?? [],
    pinout: row.pinout ?? [],
    bundleItems: row.bundle_items ?? [],
    youtubeUrl: row.youtube_url ?? undefined,
    isFlashDeal: row.is_flash_deal,
    isKit: row.is_kit,
    kitLevel: row.kit_level ?? undefined,
    kitTag: row.kit_tag ?? undefined,
    voltage: row.voltage ?? undefined,
    bus: row.bus ?? undefined,
  };
}

// ---------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.categories;

  const { data, error } = await supabase
    .from("categories")
    .select("slug, label, icon")
    .order("sort_order");

  if (error || !data?.length) return mock.categories;
  return data as Category[];
}

// ---------------------------------------------------------------------
// Homepage content
// ---------------------------------------------------------------------

export async function getHeroBanner(): Promise<HeroBannerContent> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.heroBanner;

  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "hero_banner")
    .single();

  if (error || !data) return mock.heroBanner;
  return data.value as HeroBannerContent;
}

export async function getMarqueeOffers(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.marqueeOffers;

  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "marquee_offers")
    .single();

  if (error || !data) return mock.marqueeOffers;
  return data.value as string[];
}

export const getFilterTags = async () => mock.filterTags;
export const getTrustBadges = async () => mock.trustBadges;

// ---------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------

export async function getFlashDeals(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.products.filter((p) => p.isFlashDeal);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_flash_deal", true)
    .limit(4);

  if (error || !data?.length) return mock.products.filter((p) => p.isFlashDeal);
  return data.map(mapProductRow);
}

export async function getProjectKits(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.products.filter((p) => p.isKit);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_kit", true);

  if (error || !data?.length) return mock.products.filter((p) => p.isKit);
  return data.map(mapProductRow);
}

export async function getCatalogProducts(filters: CatalogFilters = {}): Promise<Product[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return mock.products.filter((p) => {
      if (filters.category && p.categorySlug !== filters.category) return false;
      if (filters.voltage && p.voltage !== filters.voltage) return false;
      if (filters.bus && p.bus !== filters.bus) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });
  }

  let query = supabase.from("products").select("*");
  if (filters.category) query = query.eq("category_slug", filters.category);
  if (filters.voltage) query = query.eq("voltage", filters.voltage);
  if (filters.bus) query = query.eq("bus", filters.bus);
  if (filters.inStockOnly) query = query.eq("in_stock", true);

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []).map(mapProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mock.products.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return mock.products.find((p) => p.slug === slug) ?? null;
  return mapProductRow(data);
}

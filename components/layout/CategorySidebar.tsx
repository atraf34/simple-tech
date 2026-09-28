import { getCategories, getCatalogProducts } from "@/lib/queries";
import CategoryNav from "./CategoryNav";

export default async function CategorySidebar() {
  const [categories, products] = await Promise.all([getCategories(), getCatalogProducts()]);
  const items = products
    .filter((p) => p.categorySlug)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.price,
      image: p.image,
      inStock: p.inStock,
      spec: p.specs[0] ?? "",
      categorySlug: p.categorySlug as string,
    }));
  return <CategoryNav categories={categories} products={items} />;
}

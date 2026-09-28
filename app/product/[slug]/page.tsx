import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import ProductView from "@/components/product/ProductView";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}

import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getCategories } from "@/features/categories/api/getCategories";
import { getProductSlugs } from "@/features/products/api/getProducts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, slugs] = await Promise.all([getCategories(), getProductSlugs()]);
  const base = env.appUrl;
  return [
    { url: `${base}/`, priority: 1 },
    ...["/proizvodi", "/ketering", "/galerija", "/o-nama", "/kontakt"].map((p) => ({ url: `${base}${p}`, priority: 0.8 })),
    ...categories.map((c) => ({ url: `${base}/kategorija/${c.slug}`, priority: 0.7 })),
    ...slugs.map((s) => ({ url: `${base}/proizvod/${s}`, priority: 0.6 })),
  ];
}

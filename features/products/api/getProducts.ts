import { and, asc, desc, eq, ne } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products, type Category, type Product } from "@/db/schema";
import { TAGS } from "@/lib/cacheTags";

export interface ProductWithCategory extends Product {
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

const ORDER = [asc(products.sortOrder), desc(products.createdAt)];

function withCategory(rows: { product: Product; category: Category | null }[]) {
  return rows.map(({ product, category }) => ({
    ...product,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
  }));
}

export async function getProducts(
  categorySlug?: string,
): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.products, TAGS.categories);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      categorySlug
        ? and(eq(products.active, true), eq(categories.slug, categorySlug))
        : eq(products.active, true),
    )
    .orderBy(...ORDER);
  return withCategory(rows);
}

export async function getFeaturedProducts(
  limit = 8,
): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.products, TAGS.categories);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.active, true), eq(products.featured, true)))
    .orderBy(...ORDER)
    .limit(limit);
  return withCategory(rows);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.products, TAGS.categories);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  return withCategory(rows)[0] ?? null;
}

export async function getRelatedProducts(
  productId: number,
  categoryId: number | null,
  limit = 4,
): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(TAGS.products, TAGS.categories);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.active, true),
        ne(products.id, productId),
        categoryId ? eq(products.categoryId, categoryId) : undefined,
      ),
    )
    .orderBy(...ORDER)
    .limit(limit);
  return withCategory(rows);
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("sitemap");
  cacheTag(TAGS.products);

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.active, true));
  return rows.map((r) => r.slug);
}

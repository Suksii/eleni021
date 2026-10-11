import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/features/shared/components/page/PageHero";
import CategoryChips from "@/features/categories/components/CategoryChips";
import ProductGrid from "@/features/products/components/ProductGrid";
import { getCategories, getCategoryBySlug } from "@/features/categories/api/getCategories";
import { getProducts } from "@/features/products/api/getProducts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategorija nije pronađena" };
  return { title: category.name, description: category.description || undefined };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);
  return (
    <>
      <PageHero label="Kategorija" title={category.name} lead={category.description} crumbs={[{ label: "Proizvodi", href: "/proizvodi" }, { label: category.name, href: `/kategorija/${slug}` }]}>
        <div className="mt-7"><CategoryChips categories={categories} activeSlug={slug} /></div>
      </PageHero>
      <div className="wrap">
        <ProductGrid products={products} priorityCount={4} animationKey={slug} />
      </div>
    </>
  );
}

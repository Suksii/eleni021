import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Leaf, Users } from "lucide-react";
import Breadcrumbs from "@/features/shared/components/ui/Breadcrumbs";
import Price from "@/features/shared/components/ui/Price";
import SectionHeader from "@/features/shared/components/ui/SectionHeader";
import ProductGallery from "@/features/products/components/ProductGallery";
import AddToCartButton from "@/features/products/components/AddToCartButton";
import ProductGrid from "@/features/products/components/ProductGrid";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/features/products/api/getProducts";
import { getSettings } from "@/features/site/api/getSettings";
import { textToParagraphs } from "@/lib/utils/textToParagraphs";
import { pluralSr } from "@/lib/utils/plural";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Proizvod nije pronađen" };
  return {
    title: product.name,
    description: product.shortDescription || undefined,
    openGraph: { images: product.images[0] ? [{ url: product.images[0] }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, s] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4),
    getSettings(),
  ]);
  const paragraphs = textToParagraphs(product.description);

  const crumbs = [
    { label: "Proizvodi", href: "/proizvodi" },
    ...(product.category ? [{ label: product.category.name, href: `/kategorija/${product.category.slug}` }] : []),
    { label: product.name, href: `/proizvod/${product.slug}` },
  ];

  return (
    <>
      <div className="wrap pt-6 md:pt-10">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:py-4">
            {product.category && (
              <Link href={`/kategorija/${product.category.slug}`} className="font-display text-muted hover:text-primary text-lg italic">
                {product.category.name}
              </Link>
            )}
            <h1 className="font-display mt-2 text-3xl font-medium tracking-tight text-balance md:text-[2.75rem] md:leading-[1.1]">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="text-muted mt-4 text-lg leading-relaxed">{product.shortDescription}</p>
            )}

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <Price amount={product.price} unit={product.unit} className="text-3xl" unitClassName="text-base" />
              {product.minQuantity > 1 && (
                <span className="text-muted text-sm">min. {product.minQuantity} {product.unit}</span>
              )}
            </div>

            <div className="mt-7">
              <AddToCartButton product={product} />
            </div>

            <dl className="border-line-2 mt-9 border-t text-sm">
              {product.servings && (
                <div className="border-line-2 flex items-center gap-3 border-b py-3">
                  <Users size={15} aria-hidden="true" className="text-primary shrink-0" />
                  <dt className="font-display text-muted w-24 italic">Porcije</dt>
                  <dd className="font-medium">{product.servings}</dd>
                </div>
              )}
              <div className="border-line-2 flex items-center gap-3 border-b py-3">
                <CalendarClock size={15} aria-hidden="true" className="text-primary shrink-0" />
                <dt className="font-display text-muted w-24 italic">Naručiti</dt>
                <dd className="font-medium">{product.leadTimeDays} {pluralSr(product.leadTimeDays, ["dan", "dana", "dana"])} unapred</dd>
              </div>
              {product.allergens && (
                <div className="border-line-2 flex items-center gap-3 border-b py-3">
                  <Leaf size={15} aria-hidden="true" className="text-primary shrink-0" />
                  <dt className="font-display text-muted w-24 italic">Alergeni</dt>
                  <dd className="font-medium">{product.allergens}</dd>
                </div>
              )}
            </dl>

            {paragraphs.length > 0 && (
              <div className="prose-cms text-foreground/85 mt-8 max-w-[62ch]">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}

            {s.orderNotice && (
              <p className="border-line-2 text-muted mt-8 border-t pt-5 text-sm">{s.orderNotice}</p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap pt-20" aria-labelledby="slicno">
          <SectionHeader label="Možda vam se svidi" title="Iz iste vitrine" titleId="slicno" />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

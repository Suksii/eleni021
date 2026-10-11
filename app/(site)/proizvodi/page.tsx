import type { Metadata } from "next";
import PageHero from "@/features/shared/components/page/PageHero";
import CategoryChips from "@/features/categories/components/CategoryChips";
import ProductGrid from "@/features/products/components/ProductGrid";
import { getCategories } from "@/features/categories/api/getCategories";
import { getProducts } from "@/features/products/api/getProducts";

export const metadata: Metadata = {
  title: "Proizvodi",
  description: "Torte, kolači, cheesecake, cupcakes i makarons — cela ponuda naše radionice.",
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <>
      <PageHero label="Ponuda" title="Svi proizvodi" lead="Sve što pravimo, na jednom mestu. Izaberite kategoriju ili pregledajte celu ponudu." crumbs={[{ label: "Proizvodi", href: "/proizvodi" }]}>
        <div className="mt-7"><CategoryChips categories={categories} /></div>
      </PageHero>
      <div className="wrap">
        <ProductGrid products={products} priorityCount={4} animationKey="sve" />
      </div>
    </>
  );
}

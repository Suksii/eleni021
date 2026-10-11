import SectionHeader from "@/features/shared/components/ui/SectionHeader";
import ProductCard from "@/features/products/components/ProductCard";
import type { ProductWithCategory } from "@/features/products/api/getProducts";
import { cn } from "@/lib/utils/cn";

// Izdvojeni proizvodi u asimetričnoj mreži — prvi je veliki, ostali manji.
export default function Vitrina({ products }: { products: ProductWithCategory[] }) {
  if (products.length === 0) return null;
  return (
    <section className="wrap py-16 md:py-24" aria-labelledby="vitrina">
      <SectionHeader
        label="Iz vitrine"
        title="Ono što se najviše traži"
        titleId="vitrina"
        link={{ label: "Cela ponuda", href: "/proizvodi" }}
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
        {products.slice(0, 5).map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            priority={i === 0}
            className={cn(i === 0 && "col-span-2 row-span-2")}
            imageClassName={cn(i === 0 && "aspect-[4/5] md:aspect-[1/1.02]")}
          />
        ))}
      </div>
    </section>
  );
}

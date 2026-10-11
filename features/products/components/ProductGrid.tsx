import ProductCard from "@/features/products/components/ProductCard";
import AnimatedGrid from "@/features/products/components/AnimatedGrid";
import type { ProductWithCategory } from "@/features/products/api/getProducts";
import { cn } from "@/lib/utils/cn";

export default function ProductGrid({
  products,
  className,
  priorityCount = 0,
  animationKey,
}: {
  products: ProductWithCategory[];
  className?: string;
  priorityCount?: number;
  /** Promena ključa (npr. slug kategorije) ponavlja ulaznu animaciju. */
  animationKey?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="border-line-2 text-muted rounded-lg border px-6 py-14 text-center">
        Trenutno nema proizvoda u ovoj kategoriji.
      </p>
    );
  }
  return (
    <AnimatedGrid
      key={animationKey}
      className={cn("grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-4", className)}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </AnimatedGrid>
  );
}

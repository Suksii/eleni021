import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/features/products/components/AddToCartButton";
import type { ProductWithCategory } from "@/features/products/api/getProducts";
import { formatPrice } from "@/lib/utils/formatPrice";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";
import { cn } from "@/lib/utils/cn";

// Katalog kao u štampanom meniju: slika, pa naziv i cena u istom redu sa
// tačkastim vodičem. Bez kartice, senke i bedževa.
export default function ProductCard({
  product,
  priority = false,
  className,
  imageClassName,
}: {
  product: ProductWithCategory;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const href = `/proizvod/${product.slug}`;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("bg-surface-2 relative aspect-[4/5] overflow-hidden rounded-lg", imageClassName)}>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 80vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}
        </Link>
        <div className="absolute right-3 bottom-3 z-10 transition-[opacity,transform] duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <AddToCartButton product={product} compact />
        </div>
      </div>
      <div className="pt-3.5">
        <div className="flex items-baseline">
          <h3 className="font-display text-[1.1rem] leading-snug font-medium">
            <Link href={href} className="after:absolute after:inset-0 after:z-0 after:content-['']">
              {product.name}
            </Link>
          </h3>
          <span aria-hidden="true" className="leaders" />
          <span className="font-display shrink-0 text-[1.05rem] tabular-nums">
            {formatPrice(product.price)}
            <span className="text-muted text-xs"> / {UNIT_LABEL[product.unit]}</span>
          </span>
        </div>
        <p className="text-muted mt-1 line-clamp-1 text-sm">
          {product.shortDescription}
          {product.servings && <span className="text-muted-2"> · {product.servings}</span>}
        </p>
      </div>
    </article>
  );
}

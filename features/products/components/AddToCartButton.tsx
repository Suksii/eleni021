"use client";

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Button from "@/features/shared/components/ui/Button";
import QuantityInput from "@/features/shared/components/ui/QuantityInput";
import { useCart } from "@/features/cart/CartContext";
import type { Product } from "@/db/schema";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Pick<Product, "id" | "name" | "slug" | "images" | "unit" | "price" | "minQuantity" | "leadTimeDays">;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(product.minQuantity);

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] ?? "",
        unit: product.unit,
        price: product.price,
        minQuantity: product.minQuantity,
        leadTimeDays: product.leadTimeDays,
      },
      compact ? product.minQuantity : qty,
    );
    toast.success(`${product.name} je u korpi`);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Dodaj ${product.name} u korpu`}
        className="bg-background/95 text-foreground hover:bg-foreground hover:text-background inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold shadow-soft backdrop-blur transition-colors"
      >
        <Plus size={15} aria-hidden="true" /> Dodaj
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityInput value={qty} min={product.minQuantity} onChange={setQty} />
      <Button size="lg" onClick={handleAdd} className="flex-1 sm:min-w-56 sm:flex-none">
        <ShoppingBag size={18} aria-hidden="true" />
        Dodaj u korpu
      </Button>
    </div>
  );
}

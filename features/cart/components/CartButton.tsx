"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { cn } from "@/lib/utils/cn";

export default function CartButton({ className }: { className?: string }) {
  const { count, open, hydrated } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={hydrated ? `Korpa, ${count} ${count === 1 ? "artikal" : "artikala"}` : "Korpa"}
      className={cn(
        "border-foreground/15 bg-surface/70 hover:border-primary hover:text-primary relative grid size-11 place-items-center rounded-full border transition-colors",
        className,
      )}
    >
      <ShoppingBasket size={20} aria-hidden="true" strokeWidth={1.8} />
      {hydrated && count > 0 && (
        <span className="bg-primary animate-fade-in absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full px-1 text-[0.68rem] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PathnameWatcher from "@/features/shared/components/layout/PathnameWatcher";
import { ShoppingBasket, Trash2 } from "lucide-react";
import Drawer from "@/features/shared/components/ui/Drawer";
import Button from "@/features/shared/components/ui/Button";
import QuantityInput from "@/features/shared/components/ui/QuantityInput";
import { useCart } from "@/features/cart/CartContext";
import { formatPrice } from "@/lib/utils/formatPrice";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";

export default function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove, subtotal, count } =
    useCart();

  return (
    <>
      <Suspense fallback={null}>
        <PathnameWatcher onChange={close} />
      </Suspense>
      <Drawer
        open={isOpen}
        onClose={close}
        side="right"
        label="Korpa"
        title={`Korpa${count ? ` (${count})` : ""}`}
        footer={
          items.length > 0 && (
            <div className="space-y-3 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-muted text-sm">Ukupno</span>
                <span className="font-display text-xl font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button href="/narudzba" fullWidth size="lg">
                Nastavi na narudžbu
              </Button>
              <button
                type="button"
                onClick={close}
                className="text-muted hover:text-foreground block w-full py-1 text-center text-sm underline-offset-2 hover:underline"
              >
                Nastavi kupovinu
              </button>
            </div>
          )
        }
      >
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="bg-surface-2 text-primary grid size-16 place-items-center rounded-full">
              <ShoppingBasket size={26} aria-hidden="true" />
            </span>
            <p className="font-display text-xl font-semibold">
              Korpa je prazna
            </p>
            <p className="text-muted text-sm">
              Dodajte tortu ili kolače i nastavite na narudžbu.
            </p>
            <Button href="/proizvodi" variant="outline" onClick={close}>
              Pogledaj ponudu
            </Button>
          </div>
        ) : (
          <ul className="divide-border divide-y px-5">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-4">
                <Link
                  href={`/proizvod/${item.slug}`}
                  onClick={close}
                  className="bg-surface-2 relative size-20 shrink-0 overflow-hidden rounded-xl"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/proizvod/${item.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm font-semibold hover:underline"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`Ukloni ${item.name}`}
                      className="text-muted-2 hover:text-primary -mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-muted mt-0.5 text-xs">
                    {formatPrice(item.price)} / {UNIT_LABEL[item.unit]}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      min={item.minQuantity}
                      onChange={(q) => setQuantity(item.productId, q)}
                    />
                    <span className="font-display font-semibold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Drawer>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import Skeleton from "@/features/shared/components/ui/Skeleton";
import OrderPlacedReset from "@/features/orders/components/OrderPlacedReset";
import CopyButton from "@/features/shared/components/ui/CopyButton";
import { getOrderByCode } from "@/features/orders/api/getOrderByCode";
import { getSettings } from "@/features/site/api/getSettings";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";

export const metadata: Metadata = {
  title: "Narudžba primljena",
  robots: { index: false },
};

async function OrderSummary({ params }: { params: Promise<{ code: string }> }) {
  // `params` je runtime podatak — čita se tek unutar Suspense granice.
  const { code } = await params;
  const [order, s] = await Promise.all([getOrderByCode(code), getSettings()]);
  if (!order) notFound();

  return (
    <>
      <OrderPlacedReset />
      <div className="bg-success-soft text-success flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h1 className="font-display text-3xl font-semibold">
          Hvala, narudžba je primljena!
        </h1>
        <p className="text-foreground/80 max-w-[50ch]">
          Broj narudžbe je{" "}
          <CopyButton text={order.code} label="Kopiraj broj narudžbe" />.
          Kontaktiraćemo vas na {order.phone} radi potvrde.
        </p>
      </div>

      <div className="bg-surface shadow-card mt-6 rounded-3xl p-6 md:p-8">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">
              {order.deliveryType === "dostava" ? "Dostava" : "Preuzimanje"}
            </dt>
            <dd className="mt-0.5 font-semibold">
              {formatDate(order.deliveryDate)}
            </dd>
          </div>
          {order.address && (
            <div className="sm:col-span-2">
              <dt className="text-muted">Adresa</dt>
              <dd className="mt-0.5 font-semibold">{order.address}</dd>
            </div>
          )}
          {order.deliveryType === "preuzimanje" && s.address && (
            <div className="sm:col-span-2">
              <dt className="text-muted">Mesto preuzimanja</dt>
              <dd className="mt-0.5 font-semibold">{s.address}</dd>
            </div>
          )}
        </dl>
        <ul className="divide-border mt-6 divide-y border-t">
          {order.items.map((it) => (
            <li key={it.productId} className="flex items-center gap-3 py-3">
              <div className="bg-surface-2 relative size-14 shrink-0 overflow-hidden rounded-xl">
                {it.image && (
                  <Image
                    src={it.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{it.name}</p>
                <p className="text-muted text-xs">
                  {it.quantity} {UNIT_LABEL[it.unit]} × {formatPrice(it.price)}
                </p>
              </div>
              <span className="font-display font-semibold tabular-nums">
                {formatPrice(it.price * it.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-border mt-2 flex justify-between border-t pt-4">
          <span className="font-semibold">Ukupno</span>
          <span className="font-display text-xl font-semibold">
            {formatPrice(order.total)}
          </span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Nazad na početnu</Button>
        <Button href="/proizvodi" variant="outline">
          Nastavi kupovinu
        </Button>
      </div>
    </>
  );
}

export default function OrderPlacedPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <div className="wrap max-w-3xl py-10 md:py-16">
      <Suspense fallback={<Skeleton className="h-96 rounded-3xl" />}>
        <OrderSummary params={params} />
      </Suspense>
    </div>
  );
}

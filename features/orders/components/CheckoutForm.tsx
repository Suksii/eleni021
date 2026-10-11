"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Store, Truck } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import DatePicker from "@/features/shared/components/ui/DatePicker";
import FormAlert from "@/features/shared/components/ui/FormAlert";
import QuantityInput from "@/features/shared/components/ui/QuantityInput";
import { useCart } from "@/features/cart/CartContext";
import { placeOrder, type CheckoutState } from "@/features/orders/actions";
import type { DeliveryType } from "@/db/schema";
import { formatPrice } from "@/lib/utils/formatPrice";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";
import { cn } from "@/lib/utils/cn";

interface CheckoutFormProps {
  deliveryFee: number;
  freeDeliveryFrom: number;
  orderNotice: string;
}

const INITIAL: CheckoutState = {};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export default function CheckoutForm({
  deliveryFee,
  freeDeliveryFrom,
  orderNotice,
}: CheckoutFormProps) {
  const { items, subtotal, hydrated, setQuantity, remove, clear } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("preuzimanje");
  const [state, action, pending] = useActionState(placeOrder, INITIAL);
  const fe = state.fieldErrors ?? {};

  const maxLead = items.reduce((m, i) => Math.max(m, i.leadTimeDays), 0);
  // Datum se računa tek na klijentu (posle hidratacije `hydrated` je true).
  const minDate = hydrated ? isoDate(addDays(new Date(), maxLead)) : "";

  const fee =
    deliveryType === "dostava" && subtotal < freeDeliveryFrom ? deliveryFee : 0;
  const total = subtotal + fee;

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="bg-surface-2 rounded-3xl px-6 py-16 text-center">
        <p className="font-display text-2xl font-semibold">Korpa je prazna</p>
        <p className="text-muted mt-2">
          Dodajte proizvode pa se vratite na narudžbu.
        </p>
        <Button href="/proizvodi" className="mt-6">
          Pogledaj ponudu
        </Button>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        )}
      />
      <input type="hidden" name="deliveryType" value={deliveryType} />
      <input type="hidden" name="deliveryFee" value={fee} />

      <div className="space-y-8">
        <section>
          <h2 className="font-display mb-4 text-xl font-semibold">
            Vaši podaci
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="customerName"
              name="customerName"
              label="Ime i prezime"
              required
              autoComplete="name"
              error={fe.customerName}
            />
            <Input
              id="phone"
              name="phone"
              label="Telefon"
              type="tel"
              required
              autoComplete="tel"
              error={fe.phone}
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              error={fe.email}
              className="sm:col-span-2"
              hint="Na email šaljemo potvrdu narudžbe."
            />
          </div>
        </section>

        <section>
          <h2 className="font-display mb-4 text-xl font-semibold">
            Preuzimanje ili dostava
          </h2>
          <div
            className="grid gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Način isporuke"
          >
            {[
              {
                value: "preuzimanje" as const,
                icon: Store,
                title: "Preuzimanje",
                text: "U našoj radionici, bez naknade",
              },
              {
                value: "dostava" as const,
                icon: Truck,
                title: "Dostava",
                text:
                  subtotal >= freeDeliveryFrom
                    ? "Besplatna za vašu narudžbu"
                    : `${formatPrice(deliveryFee)} · besplatna preko ${formatPrice(freeDeliveryFrom)}`,
              },
            ].map(({ value, icon: Icon, title, text }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={deliveryType === value}
                onClick={() => setDeliveryType(value)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border-[1.5px] p-4 text-left transition-colors",
                  deliveryType === value
                    ? "border-primary bg-primary-soft/50"
                    : "border-line-2 hover:border-foreground",
                )}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  className={
                    deliveryType === value ? "text-primary" : "text-muted"
                  }
                />
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-muted block text-sm">{text}</span>
                </span>
              </button>
            ))}
          </div>
          {deliveryType === "dostava" && (
            <Input
              id="address"
              name="address"
              label="Adresa dostave"
              required
              autoComplete="street-address"
              error={fe.address}
              className="mt-4"
            />
          )}
          <DatePicker
            id="deliveryDate"
            name="deliveryDate"
            label={
              deliveryType === "dostava" ? "Datum dostave" : "Datum preuzimanja"
            }
            required
            min={minDate}
            error={fe.deliveryDate}
            className="mt-4"
            hint={
              maxLead > 0
                ? `Za artikle iz korpe potrebno je najmanje ${maxLead} dana.`
                : undefined
            }
          />
          <Textarea
            id="note"
            name="note"
            label="Napomena"
            rows={3}
            placeholder="Natpis na torti, alergije, željeno vreme…"
            className="mt-4"
            error={fe.note}
          />
        </section>

        {state.error && <FormAlert>{state.error}</FormAlert>}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-surface shadow-card rounded-3xl p-6">
          <h2 className="font-display text-xl font-semibold">Vaša narudžba</h2>
          <ul className="divide-border mt-4 divide-y">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-3.5">
                <div className="bg-surface-2 relative size-16 shrink-0 overflow-hidden rounded-xl">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/proizvod/${item.slug}`}
                    className="line-clamp-1 text-sm font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-muted text-xs">
                    {formatPrice(item.price)} / {UNIT_LABEL[item.unit]}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      min={item.minQuantity}
                      onChange={(q) => setQuantity(item.productId, q)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="text-muted-2 hover:text-primary text-xs underline-offset-2 hover:underline"
                    >
                      Ukloni
                    </button>
                  </div>
                </div>
                <span className="font-display shrink-0 text-sm font-semibold tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="border-border mt-2 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Međuzbir</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dostava</dt>
              <dd className="tabular-nums">
                {fee ? formatPrice(fee) : "Besplatno"}
              </dd>
            </div>
            <div className="flex justify-between pt-2 text-base">
              <dt className="font-semibold">Ukupno</dt>
              <dd className="font-display text-xl font-semibold tabular-nums">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={pending}
            className="mt-5"
          >
            Pošalji narudžbu
          </Button>
          <p className="text-muted mt-3 text-center text-xs leading-relaxed">
            Plaćanje pri preuzimanju ili dostavi. Kontaktiraćemo vas radi
            potvrde.
          </p>
          {orderNotice && (
            <p className="text-muted mt-3 text-xs">{orderNotice}</p>
          )}
          <button
            type="button"
            onClick={clear}
            className="text-muted-2 mt-4 block w-full text-center text-xs hover:underline"
          >
            Isprazni korpu
          </button>
        </div>
      </aside>
    </form>
  );
}

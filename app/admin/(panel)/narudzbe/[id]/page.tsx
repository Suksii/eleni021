import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Textarea from "@/features/shared/components/ui/Textarea";
import { AdminHeader, Card, StatusBadge } from "@/features/admin/components/AdminPage";
import AdminForm from "@/features/admin/components/AdminForm";
import { Field, FormSection, NativeSelect } from "@/features/admin/components/fields";
import { adminOrder } from "@/features/admin/api/lists";
import { updateOrder } from "@/features/admin/actions/orders";
import { ORDER_STATUSES } from "@/db/schema";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";
import { DELIVERY_LABEL, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/utils/statusLabels";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await adminOrder(Number(id));
  if (!o) notFound();
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <>
      <Link href="/admin/narudzbe" className="text-muted hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14} aria-hidden="true" /> Sve narudžbe</Link>
      <AdminHeader title={`Narudžba ${o.code}`} lead={`Primljena ${formatDate(o.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`} actions={<StatusBadge label={ORDER_STATUS_LABEL[o.status]} tone={ORDER_STATUS_TONE[o.status]} />} />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <Card className="p-5 md:p-6">
            <h2 className="font-display mb-4 text-lg font-semibold">Artikli</h2>
            <ul className="divide-border divide-y">
              {o.items.map((it) => (
                <li key={it.productId} className="flex items-center gap-3 py-3">
                  <span className="bg-surface-2 relative size-12 shrink-0 overflow-hidden rounded-lg">{it.image && <Image src={it.image} alt="" fill sizes="48px" className="object-cover" unoptimized={it.image.startsWith("/uploads/")} />}</span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/proizvodi/${it.productId}`} className="block truncate text-sm font-semibold hover:underline">{it.name}</Link>
                    <span className="text-muted text-xs">{it.quantity} {UNIT_LABEL[it.unit]} × {formatPrice(it.price)}</span>
                  </div>
                  <span className="font-semibold tabular-nums">{formatPrice(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="border-border mt-2 space-y-1.5 border-t pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Međuzbir</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Dostava</dt><dd className="tabular-nums">{formatPrice(Math.max(0, o.total - subtotal))}</dd></div>
              <div className="flex justify-between text-base"><dt className="font-semibold">Ukupno</dt><dd className="font-display text-xl font-semibold tabular-nums">{formatPrice(o.total)}</dd></div>
            </dl>
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="font-display mb-4 text-lg font-semibold">Kupac i isporuka</h2>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-muted text-xs uppercase">Ime</dt><dd className="mt-0.5 font-semibold">{o.customerName}</dd></div>
              <div><dt className="text-muted text-xs uppercase">Telefon</dt><dd className="mt-0.5 font-semibold"><a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:underline">{o.phone}</a></dd></div>
              {o.email && <div><dt className="text-muted text-xs uppercase">Email</dt><dd className="mt-0.5 font-semibold"><a href={`mailto:${o.email}`} className="hover:underline">{o.email}</a></dd></div>}
              <div><dt className="text-muted text-xs uppercase">{DELIVERY_LABEL[o.deliveryType]}</dt><dd className="mt-0.5 font-semibold">{formatDate(o.deliveryDate)}</dd></div>
              {o.address && <div className="sm:col-span-2"><dt className="text-muted text-xs uppercase">Adresa</dt><dd className="mt-0.5 font-semibold">{o.address}</dd></div>}
              {o.note && <div className="sm:col-span-2"><dt className="text-muted text-xs uppercase">Napomena kupca</dt><dd className="bg-surface-2 mt-1 rounded-xl px-4 py-3 whitespace-pre-line">{o.note}</dd></div>}
            </dl>
          </Card>
        </div>

        <AdminForm action={updateOrder.bind(null, o.id)} submitLabel="Sačuvaj status">
          <FormSection title="Obrada">
            <Field label="Status" htmlFor="status">
              <NativeSelect id="status" name="status" defaultValue={o.status}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
              </NativeSelect>
            </Field>
            <Textarea id="adminNote" name="adminNote" label="Interna beleška" rows={4} defaultValue={o.adminNote} />
          </FormSection>
        </AdminForm>
      </div>
    </>
  );
}

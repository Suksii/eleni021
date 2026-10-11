import Link from "next/link";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import StatusFilter from "@/features/admin/components/StatusFilter";
import { adminOrders } from "@/features/admin/api/lists";
import { ORDER_STATUSES, type OrderStatus } from "@/db/schema";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import { DELIVERY_LABEL, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/utils/statusLabels";

export default async function OrdersAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const current = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const rows = await adminOrders(current);

  return (
    <>
      <AdminHeader title="Narudžbe" lead={`${rows.length} prikazano`} />
      <StatusFilter base="/admin/narudzbe" current={current} options={ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABEL[s] }))} />
      <Card>
        {rows.length === 0 ? <Empty>Nema narudžbi.</Empty> : (
          <Table>
            <thead><tr><Th>Broj</Th><Th>Kupac</Th><Th>Isporuka</Th><Th>Artikli</Th><Th>Ukupno</Th><Th>Status</Th><Th>Primljeno</Th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="hover:bg-surface-2/60">
                  <Td><Link href={`/admin/narudzbe/${o.id}`} className="font-mono text-xs font-semibold hover:underline">{o.code}</Link></Td>
                  <Td><Link href={`/admin/narudzbe/${o.id}`} className="block font-semibold">{o.customerName}</Link><span className="text-muted text-xs">{o.phone}</span></Td>
                  <Td className="whitespace-nowrap">{DELIVERY_LABEL[o.deliveryType]}<span className="text-muted block text-xs">{formatDate(o.deliveryDate)}</span></Td>
                  <Td className="text-muted">{o.items.reduce((s, i) => s + i.quantity, 0)}</Td>
                  <Td className="font-semibold tabular-nums">{formatPrice(o.total)}</Td>
                  <Td><StatusBadge label={ORDER_STATUS_LABEL[o.status]} tone={ORDER_STATUS_TONE[o.status]} /></Td>
                  <Td className="text-muted whitespace-nowrap text-xs">{formatDate(o.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

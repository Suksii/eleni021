import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { dashboardStats } from "@/features/admin/api/lists";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatDate } from "@/lib/utils/formatDate";
import { INQUIRY_STATUS_LABEL, INQUIRY_TYPE_LABEL, ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/utils/statusLabels";

export default async function DashboardPage() {
  const s = await dashboardStats();
  const stats = [
    { label: "Nove narudžbe", value: s.newOrders, href: "/admin/narudzbe?status=novo" },
    { label: "Novi upiti", value: s.newInquiries, href: "/admin/upiti?status=novo" },
    { label: "Aktivni proizvodi", value: s.activeProducts, href: "/admin/proizvodi" },
    { label: "Promet (završene)", value: formatPrice(s.revenue), href: "/admin/narudzbe?status=zavrseno" },
  ];

  return (
    <>
      <AdminHeader title="Pregled" lead="Šta se dešava danas." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="bg-surface shadow-card hover:shadow-card-hover rounded-2xl p-5 transition-shadow">
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">{st.label}</p>
            <p className="font-display mt-2 text-3xl font-semibold">{st.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-display text-lg font-semibold">Poslednje narudžbe</h2>
            <Link href="/admin/narudzbe" className="text-primary inline-flex items-center gap-1 text-sm font-medium">Sve <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {s.recentOrders.length === 0 ? <Empty>Još nema narudžbi.</Empty> : (
            <ul className="divide-border divide-y">
              {s.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/narudzbe/${o.id}`} className="hover:bg-surface-2 flex items-center gap-4 px-5 py-3 text-sm transition-colors">
                    <span className="font-mono text-xs">{o.code}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">{o.customerName}</span>
                    <span className="text-muted hidden sm:inline">{formatDate(o.deliveryDate)}</span>
                    <span className="font-semibold tabular-nums">{formatPrice(o.total)}</span>
                    <StatusBadge label={ORDER_STATUS_LABEL[o.status]} tone={ORDER_STATUS_TONE[o.status]} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-display text-lg font-semibold">Poslednji upiti</h2>
            <Link href="/admin/upiti" className="text-primary inline-flex items-center gap-1 text-sm font-medium">Svi <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {s.recentInquiries.length === 0 ? <Empty>Još nema upita.</Empty> : (
            <ul className="divide-border divide-y">
              {s.recentInquiries.map((q) => (
                <li key={q.id}>
                  <Link href={`/admin/upiti/${q.id}`} className="hover:bg-surface-2 flex items-center gap-4 px-5 py-3 text-sm transition-colors">
                    <StatusBadge label={INQUIRY_TYPE_LABEL[q.type]} />
                    <span className="min-w-0 flex-1 truncate font-medium">{q.name}</span>
                    <span className="text-muted hidden sm:inline">{formatDate(q.createdAt)}</span>
                    <StatusBadge label={INQUIRY_STATUS_LABEL[q.status]} tone={q.status === "novo" ? "info" : "neutral"} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

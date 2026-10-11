import Link from "next/link";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import StatusFilter from "@/features/admin/components/StatusFilter";
import { adminInquiries } from "@/features/admin/api/lists";
import { INQUIRY_STATUSES, type InquiryStatus } from "@/db/schema";
import { formatDate } from "@/lib/utils/formatDate";
import { INQUIRY_STATUS_LABEL, INQUIRY_TYPE_LABEL } from "@/lib/utils/statusLabels";

export default async function InquiriesAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const current = INQUIRY_STATUSES.includes(status as InquiryStatus) ? (status as InquiryStatus) : undefined;
  const rows = await adminInquiries(current);

  return (
    <>
      <AdminHeader title="Upiti" lead="Ketering, torte po želji i kontakt forma" />
      <StatusFilter base="/admin/upiti" current={current} options={INQUIRY_STATUSES.map((s) => ({ value: s, label: INQUIRY_STATUS_LABEL[s] }))} />
      <Card>
        {rows.length === 0 ? <Empty>Nema upita.</Empty> : (
          <Table>
            <thead><tr><Th>Tip</Th><Th>Ime</Th><Th>Kontakt</Th><Th>Događaj</Th><Th>Status</Th><Th>Primljeno</Th></tr></thead>
            <tbody>
              {rows.map(({ inquiry: q, packageName }) => (
                <tr key={q.id} className="hover:bg-surface-2/60">
                  <Td><StatusBadge label={INQUIRY_TYPE_LABEL[q.type]} /></Td>
                  <Td><Link href={`/admin/upiti/${q.id}`} className="block font-semibold hover:underline">{q.name}</Link>{packageName && <span className="text-muted text-xs">{packageName}</span>}</Td>
                  <Td className="text-xs">{q.phone}<br />{q.email}</Td>
                  <Td className="text-muted whitespace-nowrap text-xs">{q.eventDate ? formatDate(q.eventDate) : "—"}{q.persons ? ` · ${q.persons} os.` : ""}</Td>
                  <Td><StatusBadge label={INQUIRY_STATUS_LABEL[q.status]} tone={q.status === "novo" ? "info" : q.status === "odgovoreno" ? "success" : "neutral"} /></Td>
                  <Td className="text-muted whitespace-nowrap text-xs">{formatDate(q.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

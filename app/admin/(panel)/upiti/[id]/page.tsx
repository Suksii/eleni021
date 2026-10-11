import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminHeader, Card, StatusBadge } from "@/features/admin/components/AdminPage";
import AdminForm from "@/features/admin/components/AdminForm";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { Field, FormSection, NativeSelect } from "@/features/admin/components/fields";
import { adminInquiry } from "@/features/admin/api/lists";
import { deleteInquiry, updateInquiry } from "@/features/admin/actions/orders";
import { INQUIRY_STATUSES } from "@/db/schema";
import { formatDate } from "@/lib/utils/formatDate";
import { INQUIRY_STATUS_LABEL, INQUIRY_TYPE_LABEL } from "@/lib/utils/statusLabels";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await adminInquiry(Number(id));
  if (!row) notFound();
  const { inquiry: q, packageName } = row;

  return (
    <>
      <Link href="/admin/upiti" className="text-muted hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"><ArrowLeft size={14} aria-hidden="true" /> Svi upiti</Link>
      <AdminHeader title={q.name} lead={`${INQUIRY_TYPE_LABEL[q.type]} · ${formatDate(q.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`} actions={<StatusBadge label={INQUIRY_STATUS_LABEL[q.status]} tone={q.status === "novo" ? "info" : "neutral"} />} />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <Card className="p-5 md:p-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-muted text-xs uppercase">Telefon</dt><dd className="mt-0.5 font-semibold">{q.phone ? <a href={`tel:${q.phone.replace(/\s/g, "")}`} className="hover:underline">{q.phone}</a> : "—"}</dd></div>
            <div><dt className="text-muted text-xs uppercase">Email</dt><dd className="mt-0.5 font-semibold">{q.email ? <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a> : "—"}</dd></div>
            {q.eventDate && <div><dt className="text-muted text-xs uppercase">Datum događaja</dt><dd className="mt-0.5 font-semibold">{formatDate(q.eventDate)}</dd></div>}
            {q.persons ? <div><dt className="text-muted text-xs uppercase">Broj osoba</dt><dd className="mt-0.5 font-semibold">{q.persons}</dd></div> : null}
            {packageName && <div className="sm:col-span-2"><dt className="text-muted text-xs uppercase">Paket</dt><dd className="mt-0.5 font-semibold">{packageName}</dd></div>}
            <div className="sm:col-span-2"><dt className="text-muted text-xs uppercase">Poruka</dt><dd className="bg-surface-2 mt-1 rounded-xl px-4 py-3 whitespace-pre-line">{q.message || "—"}</dd></div>
          </dl>
        </Card>
        <div className="space-y-4">
          <AdminForm action={updateInquiry.bind(null, q.id)} submitLabel="Sačuvaj status">
            <FormSection title="Obrada">
              <Field label="Status" htmlFor="status">
                <NativeSelect id="status" name="status" defaultValue={q.status}>
                  {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{INQUIRY_STATUS_LABEL[s]}</option>)}
                </NativeSelect>
              </Field>
            </FormSection>
          </AdminForm>
          <div className="text-right"><DeleteButton action={deleteInquiry.bind(null, q.id)} label="Obriši upit" /></div>
        </div>
      </div>
    </>
  );
}

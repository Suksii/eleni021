import Link from "next/link";
import { Plus, Star } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { adminTestimonials } from "@/features/admin/api/lists";
import { deleteTestimonial } from "@/features/admin/actions/testimonials";

export default async function TestimonialsAdminPage() {
  const rows = await adminTestimonials();
  return (
    <>
      <AdminHeader title="Utisci kupaca" actions={<Button href="/admin/utisci/novi" size="sm"><Plus size={16} aria-hidden="true" /> Novi utisak</Button>} />
      <Card>
        {rows.length === 0 ? <Empty>Nema utisaka.</Empty> : (
          <Table>
            <thead><tr><Th>Autor</Th><Th>Tekst</Th><Th>Ocena</Th><Th>Status</Th><Th className="text-right">Akcije</Th></tr></thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-surface-2/60">
                  <Td><Link href={`/admin/utisci/${t.id}`} className="block font-semibold hover:underline">{t.author}</Link><span className="text-muted text-xs">{t.occasion}</span></Td>
                  <Td className="text-muted max-w-md"><span className="line-clamp-2">{t.text}</span></Td>
                  <Td><span className="text-accent inline-flex items-center gap-1 text-sm font-semibold"><Star size={14} fill="currentColor" aria-hidden="true" /> {t.rating}</span></Td>
                  <Td><StatusBadge label={t.active ? "Aktivan" : "Sakriven"} tone={t.active ? "success" : "neutral"} /></Td>
                  <Td className="text-right"><DeleteButton action={deleteTestimonial.bind(null, t.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { adminPackages } from "@/features/admin/api/lists";
import { deletePackage } from "@/features/admin/actions/catering";
import { formatPrice } from "@/lib/utils/formatPrice";

export default async function CateringAdminPage() {
  const rows = await adminPackages();
  return (
    <>
      <AdminHeader title="Ketering paketi" actions={<Button href="/admin/ketering/novi" size="sm"><Plus size={16} aria-hidden="true" /> Novi paket</Button>} />
      <Card>
        {rows.length === 0 ? <Empty>Nema paketa.</Empty> : (
          <Table>
            <thead><tr><Th>Paket</Th><Th>Po osobi</Th><Th>Min. osoba</Th><Th>Status</Th><Th className="text-right">Akcije</Th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-surface-2/60">
                  <Td>
                    <Link href={`/admin/ketering/${p.id}`} className="flex items-center gap-3">
                      <span className="bg-surface-2 relative size-11 shrink-0 overflow-hidden rounded-lg">{p.image && <Image src={p.image} alt="" fill sizes="44px" className="object-cover" unoptimized={p.image.startsWith("/uploads/")} />}</span>
                      <span className="font-semibold">{p.name}</span>
                      {p.featured && <StatusBadge label="Izdvojen" tone="warning" />}
                    </Link>
                  </Td>
                  <Td className="tabular-nums">{formatPrice(p.pricePerPerson)}</Td>
                  <Td className="tabular-nums">{p.minPersons}</Td>
                  <Td><StatusBadge label={p.active ? "Aktivan" : "Sakriven"} tone={p.active ? "success" : "neutral"} /></Td>
                  <Td className="text-right"><DeleteButton action={deletePackage.bind(null, p.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

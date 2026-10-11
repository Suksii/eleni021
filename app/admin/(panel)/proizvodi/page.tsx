import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import ProductRowActions from "@/features/admin/components/ProductRowActions";
import { adminProducts } from "@/features/admin/api/lists";
import { formatPrice } from "@/lib/utils/formatPrice";

export default async function ProductsAdminPage() {
  const rows = await adminProducts();
  return (
    <>
      <AdminHeader title="Proizvodi" lead={`${rows.length} ukupno`} actions={<Button href="/admin/proizvodi/novi" size="sm"><Plus size={16} aria-hidden="true" /> Novi proizvod</Button>} />
      <Card>
        {rows.length === 0 ? <Empty>Nema proizvoda. Dodajte prvi.</Empty> : (
          <Table>
            <thead><tr><Th>Proizvod</Th><Th>Kategorija</Th><Th>Cena</Th><Th>Status</Th><Th className="text-right">Akcije</Th></tr></thead>
            <tbody>
              {rows.map(({ product: p, categoryName }) => (
                <tr key={p.id} className="hover:bg-surface-2/60">
                  <Td>
                    <Link href={`/admin/proizvodi/${p.id}`} className="flex items-center gap-3">
                      <span className="bg-surface-2 relative size-11 shrink-0 overflow-hidden rounded-lg">
                        {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" unoptimized={p.images[0].startsWith("/uploads/")} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{p.name}</span>
                        <span className="text-muted block text-xs">/{p.slug}</span>
                      </span>
                    </Link>
                  </Td>
                  <Td className="text-muted">{categoryName ?? "—"}</Td>
                  <Td className="whitespace-nowrap tabular-nums">{formatPrice(p.price)} <span className="text-muted text-xs">/ {p.unit}</span></Td>
                  <Td><StatusBadge label={p.active ? "Aktivan" : "Sakriven"} tone={p.active ? "success" : "neutral"} /></Td>
                  <Td><ProductRowActions id={p.id} active={p.active} featured={p.featured} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

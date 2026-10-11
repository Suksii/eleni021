import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import { AdminHeader, Card, Empty, StatusBadge } from "@/features/admin/components/AdminPage";
import { Table, Td, Th } from "@/features/admin/components/Table";
import DeleteButton from "@/features/admin/components/DeleteButton";
import { adminCategories } from "@/features/admin/api/lists";
import { deleteCategory } from "@/features/admin/actions/categories";

export default async function CategoriesAdminPage() {
  const rows = await adminCategories();
  return (
    <>
      <AdminHeader title="Kategorije" lead="Grupe proizvoda na sajtu" actions={<Button href="/admin/kategorije/novi" size="sm"><Plus size={16} aria-hidden="true" /> Nova kategorija</Button>} />
      <Card>
        {rows.length === 0 ? <Empty>Nema kategorija.</Empty> : (
          <Table>
            <thead><tr><Th>Kategorija</Th><Th>Redosled</Th><Th>Status</Th><Th className="text-right">Akcije</Th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2/60">
                  <Td>
                    <Link href={`/admin/kategorije/${c.id}`} className="flex items-center gap-3">
                      <span className="bg-surface-2 relative size-11 shrink-0 overflow-hidden rounded-lg">{c.image && <Image src={c.image} alt="" fill sizes="44px" className="object-cover" unoptimized={c.image.startsWith("/uploads/")} />}</span>
                      <span><span className="block font-semibold">{c.name}</span><span className="text-muted block text-xs">/kategorija/{c.slug}</span></span>
                    </Link>
                  </Td>
                  <Td className="tabular-nums">{c.sortOrder}</Td>
                  <Td><StatusBadge label={c.active ? "Aktivna" : "Sakrivena"} tone={c.active ? "success" : "neutral"} /></Td>
                  <Td className="text-right"><DeleteButton action={deleteCategory.bind(null, c.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

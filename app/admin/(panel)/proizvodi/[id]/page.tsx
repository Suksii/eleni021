import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminHeader } from "@/features/admin/components/AdminPage";
import ProductForm from "@/features/admin/components/forms/ProductForm";
import { adminCategories, adminProduct } from "@/features/admin/api/lists";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([adminProduct(Number(id)), adminCategories()]);
  if (!product) notFound();
  return (
    <>
      <AdminHeader title={product.name} lead={`ID ${product.id}`} actions={<a href={`/proizvod/${product.slug}`} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1.5 text-sm font-medium"><ExternalLink size={15} aria-hidden="true" /> Pogledaj na sajtu</a>} />
      <ProductForm product={product} categories={categories} />
    </>
  );
}

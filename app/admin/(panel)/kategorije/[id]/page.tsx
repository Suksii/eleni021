import { notFound } from "next/navigation";
import { AdminHeader } from "@/features/admin/components/AdminPage";
import CategoryForm from "@/features/admin/components/forms/CategoryForm";
import { adminCategory } from "@/features/admin/api/lists";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await adminCategory(Number(id));
  if (!category) notFound();
  return (
    <>
      <AdminHeader title={category.name} />
      <CategoryForm category={category} />
    </>
  );
}

import { AdminHeader } from "@/features/admin/components/AdminPage";
import ProductForm from "@/features/admin/components/forms/ProductForm";
import { adminCategories } from "@/features/admin/api/lists";

export default async function NewProductPage() {
  const categories = await adminCategories();
  return (
    <>
      <AdminHeader title="Novi proizvod" />
      <ProductForm product={null} categories={categories} />
    </>
  );
}

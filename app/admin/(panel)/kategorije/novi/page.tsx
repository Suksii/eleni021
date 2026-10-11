import { AdminHeader } from "@/features/admin/components/AdminPage";
import CategoryForm from "@/features/admin/components/forms/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <AdminHeader title="Nova kategorija" />
      <CategoryForm category={null} />
    </>
  );
}

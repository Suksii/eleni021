import { notFound } from "next/navigation";
import { AdminHeader } from "@/features/admin/components/AdminPage";
import PackageForm from "@/features/admin/components/forms/PackageForm";
import { adminPackage } from "@/features/admin/api/lists";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await adminPackage(Number(id));
  if (!pkg) notFound();
  return (
    <>
      <AdminHeader title={pkg.name} />
      <PackageForm pkg={pkg} />
    </>
  );
}

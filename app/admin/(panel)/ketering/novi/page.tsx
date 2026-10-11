import { AdminHeader } from "@/features/admin/components/AdminPage";
import PackageForm from "@/features/admin/components/forms/PackageForm";

export default function NewPackagePage() {
  return (
    <>
      <AdminHeader title="Novi paket" />
      <PackageForm pkg={null} />
    </>
  );
}

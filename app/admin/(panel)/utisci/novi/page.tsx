import { AdminHeader } from "@/features/admin/components/AdminPage";
import TestimonialForm from "@/features/admin/components/forms/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <AdminHeader title="Novi utisak" />
      <TestimonialForm item={null} />
    </>
  );
}

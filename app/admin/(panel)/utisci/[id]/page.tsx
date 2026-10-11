import { notFound } from "next/navigation";
import { AdminHeader } from "@/features/admin/components/AdminPage";
import TestimonialForm from "@/features/admin/components/forms/TestimonialForm";
import { adminTestimonial } from "@/features/admin/api/lists";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await adminTestimonial(Number(id));
  if (!item) notFound();
  return (
    <>
      <AdminHeader title={item.author} />
      <TestimonialForm item={item} />
    </>
  );
}

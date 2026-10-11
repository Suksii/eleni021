import Input from "@/features/shared/components/ui/Input";
import { AdminHeader, Empty } from "@/features/admin/components/AdminPage";
import AdminForm from "@/features/admin/components/AdminForm";
import ImagePicker from "@/features/admin/components/ImagePicker";
import GalleryManager from "@/features/admin/components/GalleryManager";
import { FormSection } from "@/features/admin/components/fields";
import { adminGallery } from "@/features/admin/api/lists";
import { addGalleryImages } from "@/features/admin/actions/gallery";

export default async function GalleryAdminPage() {
  const images = await adminGallery();
  const nextOrder = (images.at(-1)?.sortOrder ?? 0) + 1;
  return (
    <>
      <AdminHeader title="Galerija" lead={`${images.length} slika`} />
      <AdminForm action={addGalleryImages} submitLabel="Dodaj u galeriju" className="mb-8">
        <FormSection title="Dodaj slike">
          <ImagePicker name="images" label="Slike" multiple hint="Možete dodati više slika odjednom." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="caption" name="caption" label="Opis (za sve dodate)" />
            <Input id="sortOrder" name="sortOrder" label="Redosled od" type="number" defaultValue={nextOrder} />
          </div>
        </FormSection>
      </AdminForm>
      {images.length === 0 ? <Empty>Galerija je prazna.</Empty> : <GalleryManager images={images} />}
    </>
  );
}

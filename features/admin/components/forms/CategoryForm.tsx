import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import AdminForm from "@/features/admin/components/AdminForm";
import ImagePicker from "@/features/admin/components/ImagePicker";
import { FormSection, Toggle } from "@/features/admin/components/fields";
import { saveCategory } from "@/features/admin/actions/categories";
import type { Category } from "@/db/schema";

export default function CategoryForm({ category: c }: { category: Category | null }) {
  return (
    <AdminForm
      action={saveCategory.bind(null, c?.id ?? null)}
      submitLabel={c ? "Sačuvaj izmene" : "Kreiraj kategoriju"}
      aside={
        <FormSection title="Objava">
          <Toggle name="active" label="Aktivna" defaultChecked={c?.active ?? true} />
          <Input id="sortOrder" name="sortOrder" label="Redosled" type="number" defaultValue={c?.sortOrder ?? 0} />
        </FormSection>
      }
    >
      <FormSection title="Osnovno">
        <Input id="name" name="name" label="Naziv" required defaultValue={c?.name ?? ""} />
        <Input id="slug" name="slug" label="Slug (URL)" defaultValue={c?.slug ?? ""} hint="Prazno = automatski iz naziva" />
        <Textarea id="description" name="description" label="Opis" rows={3} defaultValue={c?.description ?? ""} />
      </FormSection>
      <FormSection title="Slika">
        <ImagePicker name="image" label="Naslovna slika kategorije" defaultValue={c?.image ?? ""} />
      </FormSection>
    </AdminForm>
  );
}

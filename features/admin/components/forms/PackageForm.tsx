import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import AdminForm from "@/features/admin/components/AdminForm";
import ImagePicker from "@/features/admin/components/ImagePicker";
import { FormSection, Toggle } from "@/features/admin/components/fields";
import { savePackage } from "@/features/admin/actions/catering";
import type { CateringPackage } from "@/db/schema";

export default function PackageForm({ pkg: p }: { pkg: CateringPackage | null }) {
  return (
    <AdminForm
      action={savePackage.bind(null, p?.id ?? null)}
      submitLabel={p ? "Sačuvaj izmene" : "Kreiraj paket"}
      aside={
        <>
          <FormSection title="Objava">
            <Toggle name="active" label="Aktivan" defaultChecked={p?.active ?? true} />
            <Toggle name="featured" label="Izdvojen" hint="Na naslovnoj i označen kao najpopularniji" defaultChecked={p?.featured ?? false} />
            <Input id="sortOrder" name="sortOrder" label="Redosled" type="number" defaultValue={p?.sortOrder ?? 0} />
          </FormSection>
          <FormSection title="Cena">
            <Input id="pricePerPerson" name="pricePerPerson" label="Cena po osobi (din.)" type="number" step="0.01" min={0} required defaultValue={p?.pricePerPerson ?? ""} />
            <Input id="minPersons" name="minPersons" label="Minimalno osoba" type="number" min={1} defaultValue={p?.minPersons ?? 10} />
          </FormSection>
        </>
      }
    >
      <FormSection title="Osnovno">
        <Input id="name" name="name" label="Naziv paketa" required defaultValue={p?.name ?? ""} />
        <Input id="slug" name="slug" label="Slug" defaultValue={p?.slug ?? ""} hint="Prazno = automatski" />
        <Textarea id="description" name="description" label="Opis" rows={4} defaultValue={p?.description ?? ""} />
        <Textarea id="items" name="items" label="Šta paket sadrži" rows={6} defaultValue={p?.items.join("\n") ?? ""} placeholder={"Jedna stavka po redu:\n4 vrste sitnih kolača\nmini cheesecake"} />
      </FormSection>
      <FormSection title="Slika">
        <ImagePicker name="image" label="Slika paketa" defaultValue={p?.image ?? ""} />
      </FormSection>
    </AdminForm>
  );
}

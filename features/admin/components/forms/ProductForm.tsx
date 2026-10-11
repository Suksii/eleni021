import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import AdminForm from "@/features/admin/components/AdminForm";
import ImagePicker from "@/features/admin/components/ImagePicker";
import { Field, FormSection, NativeSelect, Toggle } from "@/features/admin/components/fields";
import { saveProduct } from "@/features/admin/actions/products";
import type { Category, Product } from "@/db/schema";
import { UNIT_OPTIONS } from "@/lib/utils/unitLabel";

export default function ProductForm({ product, categories }: { product: Product | null; categories: Category[] }) {
  const p = product;
  return (
    <AdminForm
      action={saveProduct.bind(null, p?.id ?? null)}
      submitLabel={p ? "Sačuvaj izmene" : "Kreiraj proizvod"}
      aside={
        <>
          <FormSection title="Objava">
            <Toggle name="active" label="Aktivan" hint="Vidljiv na sajtu" defaultChecked={p?.active ?? true} />
            <Toggle name="featured" label="Izdvojen" hint="Prikazuje se na naslovnoj" defaultChecked={p?.featured ?? false} />
            <Input id="sortOrder" name="sortOrder" label="Redosled" type="number" defaultValue={p?.sortOrder ?? 0} hint="Manji broj = pre" />
          </FormSection>
          <FormSection title="Cena">
            <Input id="price" name="price" label="Cena (din.)" type="number" step="0.01" min={0} required defaultValue={p?.price ?? ""} />
            <Field label="Jedinica" htmlFor="unit">
              <NativeSelect id="unit" name="unit" defaultValue={p?.unit ?? "kom"}>
                {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </NativeSelect>
            </Field>
            <Input id="minQuantity" name="minQuantity" label="Minimalna količina" type="number" min={1} defaultValue={p?.minQuantity ?? 1} />
            <Input id="leadTimeDays" name="leadTimeDays" label="Rok izrade (dana)" type="number" min={0} defaultValue={p?.leadTimeDays ?? 2} />
          </FormSection>
        </>
      }
    >
      <FormSection title="Osnovno">
        <Input id="name" name="name" label="Naziv" required defaultValue={p?.name ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="slug" name="slug" label="Slug (URL)" defaultValue={p?.slug ?? ""} hint="Prazno = automatski iz naziva" />
          <Field label="Kategorija" htmlFor="categoryId">
            <NativeSelect id="categoryId" name="categoryId" defaultValue={p?.categoryId ?? ""}>
              <option value="">— bez kategorije —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </NativeSelect>
          </Field>
        </div>
        <Input id="shortDescription" name="shortDescription" label="Kratak opis" maxLength={300} defaultValue={p?.shortDescription ?? ""} hint="Jedna rečenica na kartici proizvoda" />
        <Textarea id="description" name="description" label="Opis" rows={8} defaultValue={p?.description ?? ""} />
      </FormSection>
      <FormSection title="Slike">
        <ImagePicker name="images" label="Slike proizvoda" multiple defaultValue={p?.images ?? []} hint="Prva slika je glavna. Prevucite redosled strelicama." />
      </FormSection>
      <FormSection title="Detalji">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="servings" name="servings" label="Porcije" placeholder="npr. 10–12 osoba" defaultValue={p?.servings ?? ""} />
          <Input id="allergens" name="allergens" label="Alergeni" placeholder="gluten, jaja, mleko" defaultValue={p?.allergens ?? ""} />
        </div>
      </FormSection>
    </AdminForm>
  );
}

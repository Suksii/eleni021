import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import AdminForm from "@/features/admin/components/AdminForm";
import { Field, FormSection, NativeSelect, Toggle } from "@/features/admin/components/fields";
import { saveTestimonial } from "@/features/admin/actions/testimonials";
import type { Testimonial } from "@/db/schema";

export default function TestimonialForm({ item: t }: { item: Testimonial | null }) {
  return (
    <AdminForm
      action={saveTestimonial.bind(null, t?.id ?? null)}
      submitLabel={t ? "Sačuvaj izmene" : "Dodaj utisak"}
      aside={
        <FormSection title="Objava">
          <Toggle name="active" label="Aktivan" defaultChecked={t?.active ?? true} />
          <Input id="sortOrder" name="sortOrder" label="Redosled" type="number" defaultValue={t?.sortOrder ?? 0} />
          <Field label="Ocena" htmlFor="rating">
            <NativeSelect id="rating" name="rating" defaultValue={t?.rating ?? 5}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
            </NativeSelect>
          </Field>
        </FormSection>
      }
    >
      <FormSection title="Utisak">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="author" name="author" label="Ime" required defaultValue={t?.author ?? ""} />
          <Input id="occasion" name="occasion" label="Povod" placeholder="Svadba, rođendan…" defaultValue={t?.occasion ?? ""} />
        </div>
        <Textarea id="text" name="text" label="Tekst" rows={5} required defaultValue={t?.text ?? ""} />
      </FormSection>
    </AdminForm>
  );
}

import Input from "@/features/shared/components/ui/Input";
import Textarea from "@/features/shared/components/ui/Textarea";
import { AdminHeader } from "@/features/admin/components/AdminPage";
import AdminForm from "@/features/admin/components/AdminForm";
import ImagePicker from "@/features/admin/components/ImagePicker";
import { FormSection } from "@/features/admin/components/fields";
import { adminSettingsMap } from "@/features/admin/api/lists";
import { saveSettings } from "@/features/admin/actions/settings";
import { SETTING_GROUPS } from "@/features/site/settingsFields";

export default async function SettingsAdminPage() {
  const s = await adminSettingsMap();
  return (
    <>
      <AdminHeader title="Podešavanja sajta" lead="Tekstovi, slike i kontakt podaci koji se prikazuju na sajtu." />
      <AdminForm action={saveSettings} submitLabel="Sačuvaj podešavanja">
        {SETTING_GROUPS.map((g) => (
          <FormSection key={g.title} title={g.title}>
            {g.fields.map((f) => {
              const value = s[f.key] ?? "";
              if (f.type === "textarea") return <Textarea key={f.key} id={f.key} name={f.key} label={f.label} rows={4} defaultValue={value} />;
              if (f.type === "image") return <ImagePicker key={f.key} name={f.key} label={f.label} defaultValue={value} hint={f.hint} />;
              return <Input key={f.key} id={f.key} name={f.key} label={f.label} type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "0.01" : undefined} defaultValue={value} hint={f.hint} />;
            })}
          </FormSection>
        ))}
      </AdminForm>
    </>
  );
}

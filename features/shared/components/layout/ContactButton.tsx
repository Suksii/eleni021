import { Suspense } from "react";
import ContactFab from "@/features/shared/components/layout/ContactFab";
import { getSettings } from "@/features/site/api/getSettings";

// Server omotač: brojevi iz CMS-a. `ContactFab` čita `usePathname`, zato Suspense.
export default async function ContactButton() {
  const s = await getSettings();
  return (
    <Suspense fallback={null}>
      <ContactFab phone={s.phone ?? ""} viber={s.viber ?? ""} whatsapp={s.whatsapp ?? ""} />
    </Suspense>
  );
}

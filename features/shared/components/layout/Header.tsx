import HeaderBar from "@/features/shared/components/layout/HeaderBar";
import { getSettings } from "@/features/site/api/getSettings";
import { getCategories } from "@/features/categories/api/getCategories";

// Bez Suspense-a oko celog headera: samo `ActiveMark` unutra čita
// `usePathname`, pa se korpa, meni i skrol-stil hidriraju odmah, ne tek na klik.
export default async function Header() {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <HeaderBar
      siteName={s.siteName || "Eleni"}
      logo={s.logo ?? ""}
      categories={categories.map(({ id, name, slug }) => ({ id, name, slug }))}
      phone={s.phone ?? ""}
      instagram={s.instagram ?? ""}
    />
  );
}

// Statične vrednosti koje ne idu u CMS — sve ostalo (naziv, kontakt, tekstovi)
// dolazi iz tabele `settings` kroz `getSettings()`.
export const siteConfig = {
  locale: "sr-Latn-RS",
  currency: "RSD",
  currencySuffix: "din.",
  htmlLang: "sr-Latn-RS",
  ogLocale: "sr_RS",
} as const;

export const NAV_LINKS = [
  { label: "Proizvodi", href: "/proizvodi" },
  { label: "Ketering", href: "/ketering" },
  { label: "Galerija", href: "/galerija" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

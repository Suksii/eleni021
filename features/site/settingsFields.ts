export type SettingFieldType = "text" | "textarea" | "image" | "number";

export interface SettingField {
  key: string;
  label: string;
  type: SettingFieldType;
  hint?: string;
}

export interface SettingGroup {
  title: string;
  fields: SettingField[];
}

// Jedini izvor istine za CMS podešavanja — ključevi u tabeli `settings`.
export const SETTING_GROUPS: SettingGroup[] = [
  {
    title: "Osnovno",
    fields: [
      { key: "siteName", label: "Naziv sajta", type: "text" },
      {
        key: "logo",
        label: "Logo (tamni, za svetlu podlogu)",
        type: "image",
        hint: "PNG sa providnom pozadinom. Prazno = tekstualni logo.",
      },
      { key: "logoLight", label: "Logo (svetli, za footer)", type: "image" },
      {
        key: "tagline",
        label: "Slogan",
        type: "text",
        hint: "Ispod hero slike i u naslovu taba.",
      },
      { key: "footerText", label: "Tekst u footeru", type: "textarea" },
      {
        key: "orderNotice",
        label: "Napomena uz naručivanje",
        type: "textarea",
        hint: "Prikazuje se na naslovnoj, proizvodu i narudžbi.",
      },
      {
        key: "announceText",
        label: "Obaveštenje na vrhu sajta",
        type: "text",
        hint: "Prazno = traka se ne prikazuje. Npr. rok za praznične narudžbe.",
      },
      {
        key: "announceLink",
        label: "Link obaveštenja",
        type: "text",
        hint: "Npr. /ketering ili puni URL.",
      },
    ],
  },
  {
    title: "Naslovna — hero",
    fields: [
      { key: "heroEyebrow", label: "Mali naslov iznad", type: "text" },
      {
        key: "heroTitle",
        label: "Glavni naslov",
        type: "text",
        hint: "Reč između zvezdica (*ovako*) ide u kurziv malinom.",
      },
      { key: "heroSubtitle", label: "Podnaslov", type: "textarea" },
      { key: "heroImage", label: "Glavna slika", type: "image" },
      {
        key: "heroImageSecondary",
        label: "Mala slika (lebdeća)",
        type: "image",
      },
    ],
  },
  {
    title: "O nama",
    fields: [
      { key: "aboutTitle", label: "Naslov", type: "text" },
      {
        key: "aboutQuote",
        label: "Citat (traka na naslovnoj)",
        type: "textarea",
        hint: "Jedna rečenica vlasnika; ako je prazno, uzima se prvi pasus teksta.",
      },
      {
        key: "aboutText",
        label: "Tekst",
        type: "textarea",
        hint: "Prazan red razdvaja pasuse.",
      },
      { key: "aboutImage", label: "Slika", type: "image" },
      { key: "aboutImageSecondary", label: "Druga slika", type: "image" },
    ],
  },
  {
    title: "Ketering",
    fields: [
      { key: "cateringTitle", label: "Naslov", type: "text" },
      { key: "cateringText", label: "Tekst", type: "textarea" },
      { key: "cateringImage", label: "Slika", type: "image" },
      {
        key: "cateringFaq",
        label: "Česta pitanja",
        type: "textarea",
        hint: "Jedno pitanje po redu, u obliku: Pitanje? | Odgovor",
      },
    ],
  },
  {
    title: "Kontakt",
    fields: [
      { key: "phone", label: "Telefon", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "address", label: "Adresa", type: "text" },
      { key: "workingHours", label: "Radno vreme", type: "text" },
      { key: "instagram", label: "Instagram URL", type: "text" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      {
        key: "viber",
        label: "Viber broj",
        type: "text",
        hint: "Broj na kome imate Viber, npr. 063 346 275. Prazno = Viber se ne nudi u dugmetu za kontakt.",
      },
      {
        key: "whatsapp",
        label: "WhatsApp broj",
        type: "text",
        hint: "Broj na kome imate WhatsApp. Prazno = WhatsApp se ne nudi.",
      },
    ],
  },
  {
    title: "Dostava",
    fields: [
      { key: "deliveryFee", label: "Cena dostave (din.)", type: "number" },
      {
        key: "freeDeliveryFrom",
        label: "Besplatna dostava od (din.)",
        type: "number",
      },
    ],
  },
];

export const SETTING_KEYS = SETTING_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key),
);

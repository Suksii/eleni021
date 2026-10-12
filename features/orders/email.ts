import type { Order } from "@/db/schema";
import { getSettings, type SiteSettings } from "@/features/site/api/getSettings";
import { absoluteLogoUrl, button, emailLayout, escapeHtml, lineItems, rows } from "@/lib/email/layout";
import { sendEmail, type EmailMessage } from "@/lib/email/send";
import { formatDate } from "@/lib/utils/formatDate";
import { formatPrice } from "@/lib/utils/formatPrice";
import { DELIVERY_LABEL } from "@/lib/utils/statusLabels";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";

export type OrderForEmail = Pick<
  Order,
  "code" | "customerName" | "phone" | "email" | "deliveryType" | "address" | "deliveryDate" | "note" | "items" | "total"
>;

function siteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function itemsHtml(o: OrderForEmail): string {
  return lineItems(
    o.items.map((it) => ({
      name: escapeHtml(it.name),
      detail: `${it.quantity} ${UNIT_LABEL[it.unit]} × ${escapeHtml(formatPrice(it.price))}`,
      amount: escapeHtml(formatPrice(it.price * it.quantity)),
    })),
    escapeHtml(formatPrice(o.total)),
  );
}

function itemsText(o: OrderForEmail): string {
  return [
    ...o.items.map((it) => `- ${it.name}: ${it.quantity} ${UNIT_LABEL[it.unit]} × ${formatPrice(it.price)} = ${formatPrice(it.price * it.quantity)}`),
    `Ukupno: ${formatPrice(o.total)}`,
  ].join("\n");
}

function deliveryRows(o: OrderForEmail): Array<[string, string]> {
  const out: Array<[string, string]> = [
    [DELIVERY_LABEL[o.deliveryType], escapeHtml(formatDate(o.deliveryDate))],
  ];
  if (o.address) out.push(["Adresa", escapeHtml(o.address)]);
  if (o.note) out.push(["Napomena", escapeHtml(o.note).replaceAll("\n", "<br>")]);
  return out;
}

/** Poruke za narudžbu: vlasniku (ako je podešen email) i kupcu (ako ga je ostavio). */
export function buildOrderEmails(o: OrderForEmail, s: SiteSettings): EmailMessage[] {
  const siteName = s.siteName || "Eleni";
  const base = siteUrl();
  const logoUrl = absoluteLogoUrl(s.logo, base);
  const ownerTo = s.email;
  const out: EmailMessage[] = [];

  if (ownerTo) {
    const subject = `Nova narudžba ${o.code} — ${o.customerName}`;
    const body =
      `<p style="margin:0 0 8px;">Stigla je nova narudžba preko sajta.</p>` +
      rows([
        ["Kupac", escapeHtml(o.customerName)],
        ["Telefon", `<a href="tel:${escapeHtml(o.phone.replace(/\s+/g, ""))}" style="color:inherit;">${escapeHtml(o.phone)}</a>`],
        ...(o.email ? [["Email", escapeHtml(o.email)] as [string, string]] : []),
        ...deliveryRows(o),
      ]) +
      itemsHtml(o) +
      button(`${base}/admin/narudzbe`, "Otvori u administraciji");
    const text = [
      `Nova narudžba ${o.code}`,
      ``,
      `Kupac: ${o.customerName}`,
      `Telefon: ${o.phone}`,
      o.email ? `Email: ${o.email}` : null,
      `${DELIVERY_LABEL[o.deliveryType]}: ${formatDate(o.deliveryDate)}`,
      o.address ? `Adresa: ${o.address}` : null,
      o.note ? `Napomena: ${o.note}` : null,
      ``,
      itemsText(o),
      ``,
      `${base}/admin/narudzbe`,
    ]
      .filter((l): l is string => l != null)
      .join("\n");

    out.push({
      to: ownerTo,
      subject,
      html: emailLayout({ siteName, siteUrl: base, logoUrl, eyebrow: "Nova narudžba", title: o.code, body }),
      text,
      replyTo: o.email || undefined,
    });
  }

  if (o.email) {
    const subject = `${siteName} — narudžba ${o.code} je primljena`;
    const contact = [s.phone && `Telefon: ${s.phone}`, s.email && `Email: ${s.email}`].filter(Boolean).join(" · ");
    const body =
      `<p style="margin:0 0 8px;">Hvala, ${escapeHtml(o.customerName)}! Primili smo vašu narudžbu i uskoro vas zovemo na ${escapeHtml(o.phone)} radi potvrde.</p>` +
      rows([["Broj narudžbe", `<strong>${escapeHtml(o.code)}</strong>`], ...deliveryRows(o)]) +
      itemsHtml(o) +
      (o.deliveryType === "preuzimanje" && s.address
        ? `<p style="margin:12px 0 0;">Preuzimanje: ${escapeHtml(s.address)}${s.workingHours ? ` (${escapeHtml(s.workingHours)})` : ""}.</p>`
        : "") +
      button(`${base}/narudzba/${encodeURIComponent(o.code)}`, "Pogledaj narudžbu");
    const text = [
      `Hvala, ${o.customerName}! Primili smo vašu narudžbu ${o.code} i uskoro vas zovemo na ${o.phone} radi potvrde.`,
      ``,
      `${DELIVERY_LABEL[o.deliveryType]}: ${formatDate(o.deliveryDate)}`,
      o.address ? `Adresa: ${o.address}` : null,
      o.deliveryType === "preuzimanje" && s.address ? `Preuzimanje: ${s.address}` : null,
      ``,
      itemsText(o),
      ``,
      `${base}/narudzba/${encodeURIComponent(o.code)}`,
      contact,
    ]
      .filter((l): l is string => l != null)
      .join("\n");

    out.push({
      to: o.email,
      subject,
      html: emailLayout({
        siteName,
        siteUrl: base,
        logoUrl,
        eyebrow: "Potvrda narudžbe",
        title: "Narudžba je primljena",
        body,
        footer: escapeHtml(contact),
      }),
      text,
      replyTo: ownerTo || undefined,
    });
  }

  return out;
}

/** Šalje obaveštenje vlasniku i potvrdu kupcu. Nikad ne baca. */
export async function sendOrderEmails(o: OrderForEmail): Promise<void> {
  const s = await getSettings();
  for (const msg of buildOrderEmails(o, s)) await sendEmail(msg);
}

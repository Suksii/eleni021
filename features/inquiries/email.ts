import type { Inquiry } from "@/db/schema";
import { getSettings, type SiteSettings } from "@/features/site/api/getSettings";
import { button, emailLayout, escapeHtml, rows } from "@/lib/email/layout";
import { sendEmail, type EmailMessage } from "@/lib/email/send";
import { formatDate } from "@/lib/utils/formatDate";
import { INQUIRY_TYPE_LABEL } from "@/lib/utils/statusLabels";

export type InquiryForEmail = Pick<Inquiry, "type" | "name" | "phone" | "email" | "eventDate" | "persons" | "message"> & {
  packageName?: string | null;
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Poruke za upit: vlasniku (ako je podešen email) i pošiljaocu (ako ga je ostavio). */
export function buildInquiryEmails(q: InquiryForEmail, s: SiteSettings): EmailMessage[] {
  const siteName = s.siteName || "Eleni";
  const base = siteUrl();
  const typeLabel = INQUIRY_TYPE_LABEL[q.type];
  const out: EmailMessage[] = [];

  const detailRows: Array<[string, string]> = [["Vrsta", escapeHtml(typeLabel)]];
  if (q.packageName) detailRows.push(["Paket", escapeHtml(q.packageName)]);
  if (q.eventDate) detailRows.push(["Datum", escapeHtml(formatDate(q.eventDate))]);
  if (q.persons) detailRows.push(["Broj osoba", String(q.persons)]);
  const detailText = [
    `Vrsta: ${typeLabel}`,
    q.packageName ? `Paket: ${q.packageName}` : "",
    q.eventDate ? `Datum: ${formatDate(q.eventDate)}` : "",
    q.persons ? `Broj osoba: ${q.persons}` : "",
  ].filter(Boolean);

  if (s.email) {
    const body =
      `<p style="margin:0 0 8px;">Stigao je novi upit preko sajta.</p>` +
      rows([
        ["Ime", escapeHtml(q.name)],
        ["Telefon", `<a href="tel:${escapeHtml(q.phone.replace(/\s+/g, ""))}" style="color:inherit;">${escapeHtml(q.phone)}</a>`],
        ...(q.email ? [["Email", escapeHtml(q.email)] as [string, string]] : []),
        ...detailRows,
      ]) +
      (q.message ? `<p style="margin:12px 0 0;white-space:pre-wrap;">${escapeHtml(q.message)}</p>` : "") +
      button(`${base}/admin/upiti`, "Otvori u administraciji");
    const text = [
      `Novi upit: ${typeLabel}`,
      ``,
      `Ime: ${q.name}`,
      `Telefon: ${q.phone}`,
      q.email ? `Email: ${q.email}` : null,
      ...detailText,
      ``,
      q.message,
      ``,
      `${base}/admin/upiti`,
    ]
      .filter((l): l is string => l != null)
      .join("\n");

    out.push({
      to: s.email,
      subject: `Novi upit (${typeLabel}) — ${q.name}`,
      html: emailLayout({ siteName, siteUrl: base, eyebrow: "Novi upit", title: typeLabel, body }),
      text,
      replyTo: q.email || undefined,
    });
  }

  if (q.email) {
    const contact = [s.phone && `Telefon: ${s.phone}`, s.email && `Email: ${s.email}`].filter(Boolean).join(" · ");
    const body =
      `<p style="margin:0 0 8px;">Hvala, ${escapeHtml(q.name)}! Primili smo vaš upit i javljamo se u najkraćem roku.</p>` +
      rows(detailRows) +
      (q.message ? `<p style="margin:12px 0 0;white-space:pre-wrap;color:#7a6b5d;">${escapeHtml(q.message)}</p>` : "");
    const text = [
      `Hvala, ${q.name}! Primili smo vaš upit i javljamo se u najkraćem roku.`,
      ``,
      ...detailText,
      ``,
      q.message,
      ``,
      contact,
    ]
      .filter((l): l is string => l != null)
      .join("\n");

    out.push({
      to: q.email,
      subject: `${siteName} — primili smo vaš upit`,
      html: emailLayout({ siteName, siteUrl: base, eyebrow: "Potvrda", title: "Upit je primljen", body, footer: escapeHtml(contact) }),
      text,
      replyTo: s.email || undefined,
    });
  }

  return out;
}

/** Šalje obaveštenje vlasniku i potvrdu pošiljaocu. Nikad ne baca. */
export async function sendInquiryEmails(q: InquiryForEmail): Promise<void> {
  const s = await getSettings();
  for (const msg of buildInquiryEmails(q, s)) await sendEmail(msg);
}

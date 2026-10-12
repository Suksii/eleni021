// Zajednički HTML omotač za sve emailove — inline stilovi (email klijenti ne
// podržavaju CSS fajlove), boje iz brenda (globals.css).

const COLORS = {
  background: "#f4ede3",
  surface: "#fbf7f0",
  foreground: "#2f2823",
  muted: "#7a6b5d",
  primary: "#8a6f4e",
  border: "#e4dacb",
};

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export interface EmailLayoutOptions {
  siteName: string;
  siteUrl: string;
  eyebrow: string;
  title: string;
  /** Već escapovan HTML sadržaj. */
  body: string;
  footer?: string;
}

export function emailLayout(o: EmailLayoutOptions): string {
  const c = COLORS;
  return `<!doctype html>
<html lang="sr-Latn-RS">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(o.title)}</title></head>
<body style="margin:0;padding:24px 12px;background:${c.background};font-family:Georgia,'Times New Roman',serif;color:${c.foreground};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr><td style="padding:0 8px 16px;">
      <a href="${escapeHtml(o.siteUrl)}" style="font-size:22px;font-weight:600;color:${c.primary};text-decoration:none;letter-spacing:0.02em;">${escapeHtml(o.siteName)}</a>
    </td></tr>
    <tr><td style="background:${c.surface};border-radius:20px;padding:28px 28px 24px;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${c.muted};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(o.eyebrow)}</p>
      <h1 style="margin:0 0 18px;font-size:24px;font-weight:600;line-height:1.25;">${escapeHtml(o.title)}</h1>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;">${o.body}</div>
    </td></tr>
    <tr><td style="padding:16px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${c.muted};">
      ${o.footer ?? ""}
    </td></tr>
  </table>
</body>
</html>`;
}

/** Tabela „oznaka → vrednost“ (oba već escapovana). */
export function rows(items: Array<[label: string, value: string]>): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-top:1px solid ${COLORS.border};margin:12px 0;">
${items
  .map(
    ([label, value]) => `  <tr>
    <td style="padding:8px 12px 8px 0;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${COLORS.border};vertical-align:top;">${value}</td>
  </tr>`,
  )
  .join("\n")}
</table>`;
}

export function button(href: string, label: string): string {
  return `<p style="margin:20px 0 4px;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${COLORS.primary};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;">${escapeHtml(label)}</a></p>`;
}

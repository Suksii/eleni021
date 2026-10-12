// Slanje emaila preko Resend HTTP API-ja (bez SDK-a — jedan POST).
// Bez RESEND_API_KEY ništa se ne šalje (lokalni razvoj), samo se loguje.
// Dok domen nije verifikovan u Resend-u, `onboarding@resend.dev` sme da šalje
// samo na email vlasnika Resend naloga — slanje kupcima tada tiho ne uspe.

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

const DEFAULT_FROM = "Eleni <onboarding@resend.dev>";

export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email] preskočeno (nema RESEND_API_KEY): "${msg.subject}" → ${msg.to}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend ${res.status} za "${msg.subject}" → ${msg.to}:`, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[email] slanje nije uspelo za "${msg.subject}" → ${msg.to}:`, e);
    return false;
  }
}

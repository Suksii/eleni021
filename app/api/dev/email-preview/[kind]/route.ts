import { NextResponse } from "next/server";
import { buildInquiryEmails } from "@/features/inquiries/email";
import { buildOrderEmails } from "@/features/orders/email";
import { getSettings } from "@/features/site/api/getSettings";

// Samo u developmentu: pregled HTML-a emailova sa probnim podacima.
// GET /api/dev/email-preview/order-owner | order-customer | inquiry-owner | inquiry-customer
// Dodaj `?text=1` za tekstualnu verziju.
const KINDS = ["order-owner", "order-customer", "inquiry-owner", "inquiry-customer"] as const;

export async function GET(request: Request, ctx: { params: Promise<{ kind: string }> }) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { kind } = await ctx.params;
  if (!(KINDS as readonly string[]).includes(kind)) {
    return NextResponse.json({ error: `kind mora biti jedno od: ${KINDS.join(", ")}` }, { status: 400 });
  }
  const s = await getSettings();

  const messages = kind.startsWith("order")
    ? buildOrderEmails(
        {
          code: "EL-2610-4821",
          customerName: "Jelena Petrović",
          phone: "063 123 456",
          email: "jelena@example.com",
          deliveryType: "dostava",
          address: "Bulevar oslobođenja 12, Novi Sad",
          deliveryDate: "2026-10-24",
          note: "Natpis na torti: „Srećan rođendan, Mila!“\nBez oraha ako može.",
          items: [
            { productId: 1, name: "Torta sa malinama i belom čokoladom", slug: "x", image: "", unit: "kg", price: 3200, quantity: 2 },
            { productId: 2, name: "Komadni kolač borovnica", slug: "y", image: "", unit: "kom", price: 420, quantity: 6 },
          ],
          total: 9420,
        },
        s,
      )
    : buildInquiryEmails(
        {
          type: "ketering",
          name: "Marko Jovanović",
          phone: "064 555 777",
          email: "marko@example.com",
          eventDate: "2026-11-14",
          persons: 40,
          packageName: "Slatki sto — Premium",
          message: "Zanima me slatki sto za firmu, oko 40 osoba.\nIma li posnih opcija?",
        },
        s,
      );

  const msg = messages[kind.endsWith("owner") ? 0 : 1];
  if (!msg) return NextResponse.json({ error: "Nema poruke (nije podešen email u CMS-u?)" }, { status: 404 });

  const asText = new URL(request.url).searchParams.get("text");
  if (asText) {
    return new NextResponse(`Za: ${msg.to}\nNaslov: ${msg.subject}\n\n${msg.text}`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new NextResponse(msg.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

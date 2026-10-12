import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ViberIcon, WhatsAppIcon } from "@/features/shared/components/icons/Social";
import { telHref, viberHref, whatsappHref } from "@/lib/utils/phone";
import PageHero from "@/features/shared/components/page/PageHero";
import InquiryForm from "@/features/inquiries/components/InquiryForm";
import { getSettings } from "@/features/site/api/getSettings";
import type { InquiryType } from "@/db/schema";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Pozovite nas, pišite nam ili svratite u radionicu.",
};

async function ContactForm({ searchParams }: { searchParams: Promise<{ tema?: string }> }) {
  const { tema } = await searchParams;
  const type: InquiryType = tema === "torta" ? "torta_po_zelji" : "kontakt";
  return (
    <InquiryForm
      type={type}
      showEvent={type === "torta_po_zelji"}
      submitLabel="Pošalji poruku"
      messagePlaceholder={type === "torta_po_zelji" ? "Opišite tortu — povod, ukus, broj osoba, dizajn ili link ka inspiraciji…" : "Kako možemo da pomognemo?"}
    />
  );
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ tema?: string }> }) {
  const s = await getSettings();
  const rows = [
    { icon: MapPin, label: "Adresa", value: s.address },
    { icon: Phone, label: "Telefon", value: s.phone, href: s.phone ? telHref(s.phone) : undefined },
    { icon: ViberIcon, label: "Viber", value: s.viber, href: s.viber ? viberHref(s.viber) : undefined },
    { icon: WhatsAppIcon, label: "WhatsApp", value: s.whatsapp, href: s.whatsapp ? whatsappHref(s.whatsapp) : undefined },
    { icon: Mail, label: "Email", value: s.email, href: s.email ? `mailto:${s.email}` : undefined },
    { icon: Clock, label: "Radno vreme", value: s.workingHours },
  ].filter((r) => r.value);

  return (
    <>
      <PageHero label="Kontakt" title="Tu smo za vaš slatki deo" lead="Pišite nam za torte po želji, ketering ili bilo koje pitanje. Odgovaramo u roku od 24h." crumbs={[{ label: "Kontakt", href: "/kontakt" }]} />
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <dl className="border-line-2 border-t">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="border-line-2 flex items-start gap-4 border-b py-5">
              <Icon size={18} aria-hidden="true" className="text-primary mt-1 shrink-0" />
              <div>
                <dt className="font-display text-muted text-sm italic">{label}</dt>
                {href ? (
                  <dd className="font-display mt-0.5 text-xl font-medium"><a href={href} className="hover:text-primary">{value}</a></dd>
                ) : (
                  <dd className="font-display mt-0.5 text-xl font-medium">{value}</dd>
                )}
              </div>
            </div>
          ))}
        </dl>
        <div className="border-line-2 relative rounded-lg border p-6 md:p-8">
          <Suspense fallback={<InquiryForm type="kontakt" submitLabel="Pošalji poruku" />}>
            <ContactForm searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

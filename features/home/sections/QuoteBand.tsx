import Image from "next/image";
import Button from "@/features/shared/components/ui/Button";
import type { SiteSettings } from "@/features/site/api/getSettings";
import { textToParagraphs } from "@/lib/utils/textToParagraphs";

// Puna slika radionice sa jednim citatom — umesto "o nama" kartica i statistika.
export default function QuoteBand({ s }: { s: SiteSettings }) {
  const quote = s.aboutQuote || textToParagraphs(s.aboutText ?? "")[0] || "";
  if (!s.aboutImage && !quote) return null;
  return (
    <section className="relative isolate mt-6 overflow-hidden py-24 text-white md:py-36" aria-labelledby="citat">
      {s.aboutImage && (
        <Image src={s.aboutImage} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      )}
      <div className="bg-foreground/60 absolute inset-0 -z-10" />
      <div className="wrap max-w-4xl text-center">
        <p className="font-display text-lg italic text-white/70">{s.aboutTitle}</p>
        <blockquote id="citat" className="font-display mt-5 text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl md:leading-[1.1]">
          “{quote}”
        </blockquote>
        <p className="font-display mt-6 text-lg italic text-white/80">— {s.siteName || "Eleni"}</p>
        <Button href="/o-nama" variant="outline" className="mt-9 border-white/40 text-white hover:border-white hover:bg-white hover:text-foreground">
          Naša priča
        </Button>
      </div>
    </section>
  );
}

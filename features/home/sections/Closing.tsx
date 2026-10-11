import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/features/site/api/getSettings";

// Tipografski završetak: bez blur "blobova" i bedževa.
export default function Closing({ s }: { s: SiteSettings }) {
  return (
    <section className="wrap py-16 md:py-24">
      <div className="border-line-2 grid gap-8 border-t pt-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <h2 className="font-display text-4xl leading-[1.02] font-medium tracking-tight text-balance md:text-6xl">
          Imate ideju za tortu? <em className="text-primary font-normal italic">Pišite nam.</em>
        </h2>
        <div className="space-y-4 md:text-right">
          <Link href="/kontakt?tema=torta" className="group font-display inline-flex items-center gap-2 text-2xl underline decoration-foreground/30 underline-offset-[8px] hover:text-primary hover:decoration-primary">
            Pošalji upit
            <ArrowRight size={22} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
          {s.phone && (
            <p className="text-muted">
              ili pozovite{" "}
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-primary underline decoration-foreground/30 underline-offset-4">{s.phone}</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

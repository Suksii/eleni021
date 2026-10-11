import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import RichTitle from "@/features/shared/components/ui/RichTitle";
import type { SiteSettings } from "@/features/site/api/getSettings";

export default function Hero({ s }: { s: SiteSettings }) {
  const facts = [s.address, s.workingHours, s.orderNotice].filter(Boolean);
  return (
    <section className="wrap pt-6 md:pt-10">
      <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="animate-fade-up pb-2 lg:pb-10">
          {s.heroEyebrow && (
            <p className="font-display text-muted text-lg italic">{s.heroEyebrow}</p>
          )}
          <RichTitle
            text={s.heroTitle ?? ""}
            className="font-display mt-4 text-[3rem] leading-[0.98] font-medium tracking-[-0.02em] text-balance md:text-[4.4rem] xl:text-[5.4rem]"
          />
          <p className="text-muted mt-7 max-w-[46ch] text-lg leading-relaxed md:text-xl">
            {s.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button href="/proizvodi" size="lg">
              Pogledaj ponudu
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="/ketering" variant="link" className="text-base">
              Ketering i slatki sto
            </Button>
          </div>
        </div>

        <figure className="relative">
          <div className="arch bg-surface-2 relative aspect-[4/5] overflow-hidden">
            {s.heroImage && (
              <Image
                src={s.heroImage}
                alt="Torta iz naše radionice"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          {s.tagline && (
            <figcaption className="font-display text-muted mt-3 text-right text-sm italic">
              {s.tagline}
            </figcaption>
          )}
        </figure>
      </div>

      {facts.length > 0 && (
        <ul className="border-line-2 mt-10 grid gap-x-10 gap-y-3 border-y py-5 text-sm sm:grid-cols-3 md:mt-14">
          {facts.map((f, i) => (
            <li key={i} className="text-foreground/80 flex gap-3 leading-snug">
              <span className="font-display text-muted-2 shrink-0 italic">0{i + 1}</span>
              {f}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

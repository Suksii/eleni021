import Image from "next/image";
import Link from "next/link";
import Button from "@/features/shared/components/ui/Button";
import type { CateringPackage } from "@/db/schema";
import type { SiteSettings } from "@/features/site/api/getSettings";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function CateringTeaser({ s, packages }: { s: SiteSettings; packages: CateringPackage[] }) {
  return (
    <section className="bg-surface-2 py-16 md:py-24" aria-labelledby="ketering">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="bg-surface-3 relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-[4/5]">
          {s.cateringImage && (
            <Image src={s.cateringImage} alt="Slatki sto sa naše proslave" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          )}
        </div>
        <div>
          <p className="label-rule mb-4">Ketering</p>
          <h2 id="ketering" className="font-display text-3xl font-medium tracking-tight text-balance md:text-5xl">
            {s.cateringTitle}
          </h2>
          <p className="text-muted mt-5 max-w-[50ch] text-lg leading-relaxed">{s.cateringText}</p>

          {packages.length > 0 && (
            <ul className="border-line-2 mt-8 border-t">
              {packages.map((p) => (
                <li key={p.id} className="border-line-2 border-b">
                  <Link href={`/ketering#${p.slug}`} className="group flex items-baseline py-4">
                    <span className="font-display text-xl font-medium group-hover:text-primary">{p.name}</span>
                    <span aria-hidden="true" className="leaders" />
                    <span className="font-display shrink-0 text-lg tabular-nums">
                      {formatPrice(p.pricePerPerson)}
                      <span className="text-muted text-xs"> / osobi</span>
                    </span>
                  </Link>
                  <p className="text-muted -mt-2 pb-4 text-sm">{p.items.slice(0, 4).join(" · ")}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button href="/ketering" size="lg">Zatraži ponudu</Button>
            <span className="text-muted text-sm">Odgovor u roku od 24h</span>
          </div>
        </div>
      </div>
    </section>
  );
}

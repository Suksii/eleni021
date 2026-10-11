import Image from "next/image";
import { Check, Users } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import type { CateringPackage } from "@/db/schema";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function PackageCard({ pkg }: { pkg: CateringPackage }) {
  return (
    <article id={pkg.slug} className="border-line-2 flex scroll-mt-28 flex-col overflow-hidden rounded-lg border md:flex-row">
      <div className="bg-surface-2 relative aspect-[4/3] md:aspect-auto md:w-2/5">
        {pkg.image && <Image src={pkg.image} alt={pkg.name} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />}
        {pkg.featured && (
          <span className="bg-background/90 font-display absolute top-4 left-4 rounded-full px-3 py-1 text-sm italic backdrop-blur">najtraženije</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">{pkg.name}</h2>
          <div className="text-right">
            <p className="font-display text-2xl font-semibold">{formatPrice(pkg.pricePerPerson)}</p>
            <p className="text-muted text-xs">po osobi</p>
          </div>
        </div>
        <p className="text-muted mt-3 leading-relaxed">{pkg.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {pkg.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <Check size={16} aria-hidden="true" className="text-success mt-0.5 shrink-0" /> {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="text-muted flex items-center gap-1.5 text-sm"><Users size={15} aria-hidden="true" /> min. {pkg.minPersons} osoba</span>
          <Button href={`/ketering?paket=${pkg.id}#upit`} size="sm">Zatraži ponudu</Button>
        </div>
      </div>
    </article>
  );
}

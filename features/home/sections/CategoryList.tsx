import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/features/shared/components/ui/SectionHeader";
import type { Category } from "@/db/schema";
import { pluralSr } from "@/lib/utils/plural";

// Kategorije kao numerisana lista sa tankim linijama — kao sadržaj u meniju.
export default function CategoryList({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<number, number>;
}) {
  if (categories.length === 0) return null;
  return (
    <section className="wrap py-16 md:py-24" aria-labelledby="kategorije">
      <SectionHeader label="Šta pravimo" title="Ponuda po kategorijama" titleId="kategorije" />
      <ol className="border-line-2 border-t">
        {categories.map((c, i) => {
          const n = counts[c.id] ?? 0;
          return (
            <li key={c.id} className="border-line-2 border-b">
              <Link
                href={`/kategorija/${c.slug}`}
                className="group grid items-center gap-4 py-5 transition-colors sm:grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1.2fr_1.6fr_auto] md:py-6"
              >
                <span className="font-display text-muted-2 text-sm italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-4">
                  <span className="bg-surface-2 relative hidden size-14 shrink-0 overflow-hidden rounded-full md:block">
                    {c.image && (
                      <Image src={c.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </span>
                  <span className="font-display text-2xl font-medium tracking-tight group-hover:text-primary md:text-3xl">
                    {c.name}
                  </span>
                </span>
                <span className="text-muted hidden max-w-[44ch] text-sm leading-relaxed md:block">
                  {c.description}
                </span>
                <span className="text-muted flex items-center gap-3 text-sm sm:justify-end">
                  {n > 0 && `${n} ${pluralSr(n, ["proizvod", "proizvoda", "proizvoda"])}`}
                  <span className="border-foreground/20 group-hover:bg-foreground group-hover:text-background grid size-9 place-items-center rounded-full border transition-colors">
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

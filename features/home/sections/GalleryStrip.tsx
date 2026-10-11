import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/features/shared/components/ui/SectionHeader";
import ScrollCarousel from "@/features/shared/components/ui/ScrollCarousel";
import type { GalleryImage } from "@/db/schema";

const RATIOS = ["3/4", "4/3", "1/1", "3/4", "4/3", "1/1"];

// Filmska traka: slike različitih proporcija koje se skroluju vodoravno.
export default function GalleryStrip({ images, instagram }: { images: GalleryImage[]; instagram: string }) {
  if (images.length === 0) return null;
  return (
    <section className="py-16 md:py-24" aria-labelledby="galerija">
      <div className="wrap">
        <SectionHeader label="Iz radionice" title="Nedavno smo pravili" titleId="galerija" link={{ label: "Cela galerija", href: "/galerija" }}>
          {instagram && (
            <a href={instagram} target="_blank" rel="noreferrer" className="text-muted hover:text-primary text-sm underline decoration-foreground/30 underline-offset-[6px]">
              Instagram
            </a>
          )}
        </SectionHeader>
      </div>
      <div className="wrap">
        <ScrollCarousel gap={16} prevLabel="Prethodno" nextLabel="Sledeće">
          {images.map((g, i) => (
            <Link key={g.id} href="/galerija" className="bg-surface-2 relative h-72 shrink-0 snap-start overflow-hidden rounded-lg md:h-96" style={{ aspectRatio: RATIOS[i % RATIOS.length] }}>
              <Image src={g.image} alt={g.caption || ""} fill sizes="(min-width: 768px) 400px, 300px" className="object-cover" />
            </Link>
          ))}
        </ScrollCarousel>
      </div>
    </section>
  );
}

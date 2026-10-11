"use client";

import Image from "next/image";
import { useState } from "react";
import GalleryDots from "@/features/shared/components/ui/GalleryDots";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { cn } from "@/lib/utils/cn";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const main = images[active] ?? images[0];
  const swipe = useSwipe(
    () => setActive((i) => (i + 1) % count),
    () => setActive((i) => (i - 1 + count) % count),
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-surface-2 relative aspect-[4/5] overflow-hidden rounded-lg sm:aspect-square lg:aspect-[4/5]"
        {...(count > 1 ? swipe : {})}
      >
        {main && (
          <Image key={main} src={main} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="animate-fade-in object-cover" />
        )}
        <GalleryDots count={count} active={active} onSelect={setActive} className="absolute inset-x-0 bottom-3 justify-center sm:hidden" />
      </div>
      {count > 1 && (
        <ul className="scrollbar-hide hidden gap-2.5 overflow-x-auto sm:flex">
          {images.map((src, i) => (
            <li key={src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Slika ${i + 1}`}
                aria-current={i === active}
                className={cn("bg-surface-2 relative block size-20 overflow-hidden rounded-lg border-2 transition-colors", i === active ? "border-foreground" : "border-transparent hover:border-line-2")}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

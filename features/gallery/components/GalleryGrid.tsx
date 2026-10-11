"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";
import type { GalleryImage } from "@/db/schema";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i === null ? i : (i - 1 + images.length) % images.length,
      ),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useBodyScrollLock(open);
  useKeyboardNav(
    { Escape: close, ArrowLeft: prev, ArrowRight: next },
    { enabled: open },
  );

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
        {images.map((g, i) => (
          <li key={g.id} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="bg-surface-2 group relative block w-full overflow-hidden rounded-2xl"
              aria-label={g.caption || `Otvori sliku ${i + 1}`}
            >
              <Image
                src={g.image}
                alt={g.caption || ""}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{
                  aspectRatio:
                    i % 3 === 0 ? "4 / 5" : i % 3 === 1 ? "1 / 1" : "3 / 4",
                }}
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pregled slike"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Zatvori"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Prethodna"
              className="absolute left-3 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Sledeća"
              className="absolute right-3 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            {/* Fiksna visina okvira: slika se uklapa (object-contain) u već
                zauzet prostor, pa se ništa ne pomera kad se učita ili promeni
                proporcija pri listanju. `svh` — stabilno na telefonu. */}
            <motion.div
              key={current.id}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex h-[84svh] w-full max-w-5xl flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <Image
                  src={current.image}
                  alt={current.caption || ""}
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 h-5 text-center text-sm text-white/80">
                {current.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

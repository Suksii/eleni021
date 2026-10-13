"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/db/schema";
import { useScrollCarousel } from "@/lib/hooks/useScrollCarousel";
import { cn } from "@/lib/utils/cn";

const CHIP = "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors";

// Aktivna "pilula" klizi između kategorija (layoutId) umesto da skače.
// Na telefonu je traka horizontalni skroler: izabrana kategorija se pri
// učitavanju dovede u sredinu (izbor je nova ruta, pa bi se inače traka
// vratila na početak i aktivna bi ostala van ekrana). Ivice blede kad ima još.
export default function CategoryChips({ categories, activeSlug }: { categories: Pick<Category, "id" | "name" | "slug">[]; activeSlug?: string }) {
  const items = [{ id: 0, name: "Sve", slug: "" }, ...categories];
  const { scrollRef, canPrev, canNext } = useScrollCarousel();

  useEffect(() => {
    const el = scrollRef.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !active || el.scrollWidth <= el.clientWidth) return;
    // Ručno (ne scrollIntoView) da se stranica ne pomera vertikalno.
    const target = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
    el.scrollLeft = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
  }, [activeSlug, scrollRef]);

  // Točkić miša preko trake → horizontalni skrol (desktop sa uskim prozorom).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollRef]);

  const fade = (side: "left" | "right", show: boolean) => (
    <div
      aria-hidden="true"
      className={cn(
        "from-background pointer-events-none absolute inset-y-0 z-10 w-10 transition-opacity duration-200 md:hidden",
        side === "left" ? "-left-4 bg-linear-to-r to-transparent sm:-left-6" : "-right-4 bg-linear-to-l to-transparent sm:-right-6",
        show ? "opacity-100" : "opacity-0",
      )}
    />
  );

  return (
    <div className="relative">
      {fade("left", canPrev)}
      <nav
        ref={scrollRef}
        aria-label="Kategorije"
        className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:px-0"
      >
        {items.map((c) => {
          const active = (activeSlug ?? "") === c.slug;
          return (
            <Link
              key={c.id}
              href={c.slug ? `/kategorija/${c.slug}` : "/proizvodi"}
              aria-current={active ? "page" : undefined}
              className={cn(CHIP, active ? "text-background" : "text-foreground/80 hover:text-foreground")}
            >
              {active && (
                <motion.span
                  layoutId="category-chip"
                  aria-hidden="true"
                  className="bg-foreground absolute inset-0 -z-10 rounded-full"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }}
                />
              )}
              {!active && <span aria-hidden="true" className="border-line-2 absolute inset-0 -z-10 rounded-full border" />}
              {c.name}
            </Link>
          );
        })}
      </nav>
      {fade("right", canNext)}
    </div>
  );
}

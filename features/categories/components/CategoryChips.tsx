"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils/cn";

const CHIP = "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors";

// Aktivna "pilula" klizi između kategorija (layoutId) umesto da skače.
export default function CategoryChips({ categories, activeSlug }: { categories: Pick<Category, "id" | "name" | "slug">[]; activeSlug?: string }) {
  const items = [{ id: 0, name: "Sve", slug: "" }, ...categories];
  return (
    <nav aria-label="Kategorije" className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:px-0">
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
  );
}

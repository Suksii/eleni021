"use client";

import { cn } from "@/lib/utils/cn";

export default function GalleryDots({ count, active, onSelect, className }: { count: number; active: number; onSelect: (i: number) => void; className?: string }) {
  if (count <= 1) return null;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Slika ${i + 1}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className={cn("h-2 rounded-full transition-all duration-200", i === active ? "bg-foreground w-5" : "bg-foreground/35 hover:bg-foreground/60 w-2")}
        />
      ))}
    </div>
  );
}

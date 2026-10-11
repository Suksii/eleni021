import type { Category } from "@/db/schema";

// Traka sa kategorijama koja lagano klizi — poštuje `prefers-reduced-motion`.
export default function Marquee({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  const items = [...categories, ...categories];
  return (
    <div aria-hidden="true" className="border-line-2 mt-10 overflow-hidden border-b py-4 md:mt-14">
      <div className="animate-marquee flex w-max motion-reduce:animate-none">
        {items.map((c, i) => (
          <span key={i} className="font-display flex items-center text-xl font-medium tracking-tight whitespace-nowrap md:text-2xl">
            <span className="px-6">{c.name}</span>
            <span className="text-primary text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function StatusFilter({ base, current, options }: { base: string; current?: string; options: { value: string; label: string }[] }) {
  const CHIP = "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Link href={base} className={cn(CHIP, !current ? "bg-foreground border-foreground text-white" : "border-line-2 hover:border-foreground")}>Sve</Link>
      {options.map((o) => (
        <Link key={o.value} href={`${base}?status=${o.value}`} className={cn(CHIP, current === o.value ? "bg-foreground border-foreground text-white" : "border-line-2 hover:border-foreground")}>{o.label}</Link>
      ))}
    </div>
  );
}

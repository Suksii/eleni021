import Breadcrumbs, { type Crumb } from "@/features/shared/components/ui/Breadcrumbs";
import RichTitle from "@/features/shared/components/ui/RichTitle";
import { cn } from "@/lib/utils/cn";

// Editorijalni uvod strane: naslov levo, uvodni tekst desno, tanka linija ispod.
export default function PageHero({
  label,
  title,
  lead,
  crumbs,
  className,
  children,
}: {
  label?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("wrap pt-4 pb-10 md:pt-8 md:pb-12", className)}>
      {crumbs && <Breadcrumbs items={crumbs} className="mb-8" />}
      <div className="border-line-2 grid gap-6 border-b pb-8 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-12">
        <div>
          {label && <p className="font-display text-muted mb-3 text-base italic">{label}</p>}
          <RichTitle text={title} className="font-display text-[2.6rem] leading-[1.02] font-medium tracking-tight text-balance md:text-6xl" />
        </div>
        {lead && <p className="text-muted max-w-[46ch] text-lg leading-relaxed md:pb-1">{lead}</p>}
      </div>
      {children}
    </div>
  );
}

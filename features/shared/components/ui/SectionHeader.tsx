import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  label?: string;
  title?: string;
  titleId?: string;
  lead?: string;
  link?: { label: string; href: string };
  children?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
}

// Editorijalni naslov: kurzivna etiketa sa linijom, pa veliki serif naslov.
export default function SectionHeader({
  label,
  title,
  titleId,
  lead,
  link,
  children,
  className,
  size = "md",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 md:mb-10", className)}>
      {label && <p className="label-rule mb-4">{label}</p>}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="min-w-0 max-w-3xl">
          {title && (
            <h2
              id={titleId}
              className={cn(
                "font-display font-medium tracking-tight text-balance",
                size === "lg" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
              )}
            >
              {title}
            </h2>
          )}
          {lead && <p className="text-muted mt-3 max-w-[56ch] leading-relaxed">{lead}</p>}
        </div>
        {(link || children) && (
          <div className="flex shrink-0 items-center gap-5">
            {link && (
              <Link
                href={link.href}
                className="group decoration-foreground/30 hover:decoration-primary hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-[6px]"
              >
                {link.label}
                <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

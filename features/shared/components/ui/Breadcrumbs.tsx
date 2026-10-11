import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Putanja" className={cn("min-w-0", className)}>
      <ol className="text-muted flex flex-wrap items-center gap-1.5 text-xs">
        <li>
          <Link href="/" className="hover:text-tertiary transition-colors">
            Početna
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              <ChevronRight
                size={13}
                aria-hidden="true"
                className="text-muted-2 shrink-0"
              />
              {last ? (
                <span
                  aria-current="page"
                  className="text-foreground font-medium"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-tertiary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

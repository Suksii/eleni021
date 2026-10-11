import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CollapseProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

// Otvaranje bez merenja visine: grid red ide 0fr → 1fr, pa se animira i kad
// se sadržaj promeni (npr. lista opcija dostave stigne sa API-ja).
export default function Collapse({
  open,
  children,
  className,
  innerClassName,
}: CollapseProps) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out",
        className,
      )}
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className={cn("overflow-hidden", innerClassName)}>{children}</div>
    </div>
  );
}

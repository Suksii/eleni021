import { formatPrice } from "@/lib/utils/formatPrice";
import { UNIT_LABEL } from "@/lib/utils/unitLabel";
import type { ProductUnit } from "@/db/schema";
import { cn } from "@/lib/utils/cn";

export default function Price({
  amount,
  unit,
  prefix,
  className,
  unitClassName,
}: {
  amount: number;
  unit?: ProductUnit | string;
  prefix?: string;
  className?: string;
  unitClassName?: string;
}) {
  return (
    <span className={cn("font-display font-semibold tabular-nums", className)}>
      {prefix && <span className="text-muted mr-1 font-sans text-[0.8em] font-normal">{prefix}</span>}
      {formatPrice(amount)}
      {unit && (
        <span className={cn("text-muted font-sans text-[0.72em] font-normal", unitClassName)}>
          {" "}/ {UNIT_LABEL[unit as ProductUnit] ?? unit}
        </span>
      )}
    </span>
  );
}

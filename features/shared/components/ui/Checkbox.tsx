import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  count?: number;
  error?: string;
  truncate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, count, error, truncate, id, className, ...props },
  ref,
) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="group flex cursor-pointer items-start gap-2.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="border-line-2 group-hover:border-tertiary peer-checked:border-tertiary peer-checked:bg-tertiary peer-focus-visible:ring-tertiary/40 mt-px grid size-4.5 shrink-0 place-items-center rounded border text-white transition-colors peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1"
        >
          <Check
            size={12}
            strokeWidth={3}
            className="opacity-0 transition-opacity"
          />
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 text-sm leading-snug",
            truncate && "truncate",
          )}
        >
          {label}
        </span>
        {count !== undefined && (
          <span className="text-muted-2 mt-px shrink-0 text-xs tabular-nums">
            {count}
          </span>
        )}
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-tertiary text-xs">
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  trailing?: ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}

export const FIELD_CLS =
  "border-line-2 focus:border-tertiary h-13 w-full rounded-xl border-[1.5px] bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-2";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, trailing, error, hint, className, required, ...props },
  ref,
) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.82rem] font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-tertiary ml-0.5">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            FIELD_CLS,
            trailing && "pr-12",
            error && "border-tertiary",
          )}
          {...props}
        />
        {trailing && (
          <div className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-tertiary text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-muted text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;

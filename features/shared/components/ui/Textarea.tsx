import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FIELD_CLS } from "@/features/shared/components/ui/Input";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, id, error, className, required, rows = 5, ...props },
    ref,
  ) {
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

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            FIELD_CLS,
            "h-auto resize-y py-3.5 leading-relaxed",
            error && "border-tertiary",
          )}
          {...props}
        />

        {error && (
          <p id={`${id}-error`} role="alert" className="text-tertiary text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default Textarea;

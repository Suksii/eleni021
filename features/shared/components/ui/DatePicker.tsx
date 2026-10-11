"use client";

import { useCallback, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import Calendar from "@/features/shared/components/ui/Calendar";
import { FIELD_CLS } from "@/features/shared/components/ui/Input";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";
import { cn } from "@/lib/utils/cn";

interface DatePickerProps {
  id: string;
  /** Ime hidden polja — vrednost "YYYY-MM-DD" ide u <form>. */
  name: string;
  label: string;
  defaultValue?: string;
  /** Najraniji dozvoljeni datum, "YYYY-MM-DD". */
  min?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function toDate(value?: string): Date | undefined {
  const m = value && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return undefined;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

const toValue = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDisplay = (d: Date) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}.`;

// Kalendar za buduće datume (preuzimanje, dostava, događaj) — po uzoru na
// tehnoplus DatePicker, ali nekontrolisan ka formi: hidden input nosi vrednost.
export default function DatePicker({
  id,
  name,
  label,
  defaultValue = "",
  min,
  required,
  error,
  hint,
  placeholder = "Izaberite datum",
  className,
}: DatePickerProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const minDate = toDate(min);
  const selected = toDate(value);
  const [month, setMonth] = useState<Date | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(rootRef, close, open);
  useKeyboardNav({ Escape: close }, { enabled: open });

  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.82rem] font-semibold">
        {label}
        {required && <span aria-hidden="true" className="text-primary ml-0.5">*</span>}
      </label>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        onClick={() => {
          // Otvori na izabranom mesecu, ili na najranijem dozvoljenom.
          if (!open) setMonth(selected ?? minDate ?? new Date());
          setOpen((o) => !o);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(FIELD_CLS, "flex items-center justify-between text-left", !selected && "text-muted-2", error && "border-primary")}
      >
        <span>{selected ? toDisplay(selected) : placeholder}</span>
        <CalendarIcon size={16} aria-hidden="true" className="text-muted shrink-0" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="border-foreground/10 bg-background/95 shadow-soft absolute top-full left-0 z-50 mt-2 w-[20rem] max-w-[calc(100vw-2rem)] rounded-2xl border p-3 backdrop-blur-xl"
        >
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              setValue(toValue(date));
              setOpen(false);
            }}
            startMonth={minDate ?? new Date()}
            disabled={minDate ? { before: minDate } : undefined}
          />
        </div>
      )}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-primary text-xs">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-muted text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

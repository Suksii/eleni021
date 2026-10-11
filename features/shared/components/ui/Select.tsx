"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  prefix?: ReactNode;
  placeholder?: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "pill" | "box" | "bare" | "field";
  align?: "start" | "end";
  disabled?: boolean;
  searchable?: boolean;
  searchableFrom?: number;
}

const SIZE: Record<NonNullable<SelectProps["size"]>, string> = {
  sm: "h-9 text-[0.82rem]",
  md: "h-10 text-sm",
  lg: "h-13 text-sm",
};

const VARIANT: Record<NonNullable<SelectProps["variant"]>, string> = {
  pill: "border-line-2 rounded-full border pr-3 pl-4",
  box: "border-line-2 rounded-lg border pr-3 pl-3.5",
  bare: "px-0",
  // Isti okvir kao `Input` — da select i tekstualno polje u formi stoje u redu.
  field: "border-line-2 rounded-xl border-[1.5px] pr-3 pl-4",
};

export default function Select({
  options,
  value,
  onChange,
  prefix,
  placeholder = "Odaberi",
  label,
  className,
  size = "md",
  variant = "pill",
  align = "start",
  disabled = false,
  searchable = false,
  searchableFrom = 8,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(rootRef, close, open);
  useBodyScrollLock(open);

  const selected = options.find((o) => o.value === value);
  const withSearch = searchable && options.length >= searchableFrom;

  const q = query.trim().toLowerCase();
  const visible =
    withSearch && q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[focused];
    el?.scrollIntoView({ block: "nearest" });
  }, [focused, open]);

  useEffect(() => {
    if (open && withSearch) inputRef.current?.focus();
  }, [open, withSearch]);

  const openList = () => {
    setQuery("");
    setFocused(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  };

  const pick = (v: string) => {
    onChange(v);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openList();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocused((i) => Math.min(i + 1, visible.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocused((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setFocused(0);
        break;
      case "End":
        e.preventDefault();
        setFocused(visible.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      case "Enter":
        e.preventDefault();
        if (visible[focused]) pick(visible[focused].value);
        break;
      // U pretrazi je razmak deo kucanja, inače bira fokusiranu stavku.
      case " ":
        if (withSearch) break;
        e.preventDefault();
        if (visible[focused]) pick(visible[focused].value);
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        aria-activedescendant={
          open && visible[focused] ? `${listId}-${focused}` : undefined
        }
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center gap-2 bg-transparent transition-colors outline-none",
          SIZE[size],
          VARIANT[variant],
          disabled
            ? "cursor-not-allowed opacity-50"
            : cn(
                "cursor-pointer",
                variant !== "bare" &&
                  (open ? "border-tertiary" : "hover:border-tertiary"),
              ),
        )}
      >
        {prefix && <span className="text-muted">{prefix}</span>}
        <span
          className={cn(
            "truncate font-medium",
            !selected && "text-muted-2 font-normal",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={cn(
            "text-muted ml-auto flex-none transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "border-foreground/10 shadow-soft bg-background/95 absolute top-full z-50 mt-2 w-max min-w-full origin-top overflow-hidden rounded-2xl border p-1.5 backdrop-blur-xl transition-[opacity,transform] duration-150",
          "max-w-[min(20rem,calc(100vw-2rem))]",
          align === "end" ? "right-0" : "left-0",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {withSearch && (
          <div className="border-line-2 relative border-b">
            <Search
              size={14}
              aria-hidden="true"
              className="text-muted-2 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setFocused(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Pretraži…"
              aria-label="Pretraži opcije"
              className="placeholder:text-muted-2 w-full bg-transparent py-2.5 pr-3 pl-9 text-sm outline-none"
            />
          </div>
        )}

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="max-h-72 scrollbar-thin overflow-y-auto py-1.5"
        >
          {visible.length === 0 ? (
            <li className="text-muted-2 px-4 py-2.5 text-sm">Nema rezultata</li>
          ) : (
            visible.map((option, i) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => pick(option.value)}
                  onMouseEnter={() => setFocused(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                    isSelected && "font-semibold",
                    i === focused && "bg-surface-2",
                  )}
                >
                  <span className="min-w-0 flex-1">{option.label}</span>
                  {isSelected && (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className="text-tertiary flex-none"
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QuantityInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const BOX = { sm: "h-9", md: "h-12" };
const BTN = { sm: "w-8", md: "w-11" };

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
}: QuantityInputProps) {
  return (
    <div
      className={cn(
        "border-line-2 bg-surface inline-flex items-center rounded-full border-[1.5px]",
        BOX[size],
        className,
      )}
    >
      <button
        type="button"
        aria-label="Smanji količinu"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn("hover:text-primary grid h-full place-items-center rounded-l-full transition-colors disabled:opacity-40", BTN[size])}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Povećaj količinu"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn("hover:text-primary grid h-full place-items-center rounded-r-full transition-colors disabled:opacity-40", BTN[size])}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NavButtonVariant = "outline" | "overlay";

interface NavButtonProps {
  direction: "prev" | "next";
  onClick?: () => void;
  disabled?: boolean;
  variant?: NavButtonVariant;
  "aria-label"?: string;
  className?: string;
}

export default function NavButton({
  direction,
  onClick,
  disabled,
  variant = "outline",
  "aria-label": ariaLabel,
  className,
}: NavButtonProps) {
  const isPrev = direction === "prev";
  const Arrow = isPrev ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (isPrev ? "Prethodno" : "Sledeće")}
      className={cn(
        "group relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full outline-none",
        "transition-[background-color,border-color,transform] duration-200",
        "hover:border-tertiary hover:bg-tertiary active:scale-95",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:border-foreground focus-visible:shadow-[0_0_0_4px_rgba(235,83,38,0.12)]",
        variant === "outline"
          ? "border-line-2 border"
          : "border-border bg-background/95 border shadow-[0_6px_20px_-6px_rgba(14,14,12,0.25)] backdrop-blur-sm",
        className,
      )}
    >
      <span
        className={cn(
          "col-start-1 row-start-1 transition-transform duration-300 ease-out",
          isPrev
            ? "group-hover:translate-x-[-200%]"
            : "group-hover:translate-x-[200%]",
        )}
      >
        <Arrow size={17} strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 text-white transition-transform duration-300 ease-out group-hover:translate-x-0",
          isPrev ? "translate-x-[200%]" : "translate-x-[-200%]",
        )}
      >
        <Arrow size={17} strokeWidth={2} />
      </span>
    </button>
  );
}

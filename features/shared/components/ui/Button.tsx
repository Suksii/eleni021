import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "accent" | "dark" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-primary",
  accent: "bg-primary text-white hover:bg-primary-hover",
  dark: "bg-foreground text-background hover:opacity-85",
  outline: "border-foreground/25 hover:border-foreground border",
  ghost: "hover:bg-surface-2",
  // Tekstualni link sa podvlakom — za sekundarne akcije, bez "pilule".
  link: "h-auto rounded-none px-0 underline decoration-foreground/30 underline-offset-[6px] hover:decoration-primary hover:text-primary",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-10 gap-2 px-4 text-[0.82rem]",
  md: "h-11.5 gap-2.5 px-5.5 text-sm",
  lg: "h-13 gap-2.5 px-7 text-[0.95rem]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  loading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    href,
    loading = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const cls = cn(
    "inline-flex cursor-pointer items-center justify-center rounded-full font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANT[variant],
    SIZE[size],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    const Anchor = Link as ElementType;
    return (
      <Anchor href={href} className={cls}>
        {children}
      </Anchor>
    );
  }

  return (
    <button
      ref={ref}
      className={cls}
      aria-busy={loading || undefined}
      {...props}
      disabled={props.disabled || loading}
    >
      {loading && (
        <Loader2 size={16} aria-hidden="true" className="animate-spin" />
      )}
      {children}
    </button>
  );
});

export default Button;
export type { ButtonVariant, ButtonSize };

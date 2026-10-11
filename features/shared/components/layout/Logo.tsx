import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  name: string;
  /** Putanja do wordmarka (PNG sa providnom pozadinom); prazno = tekstualni logo. */
  image?: string;
  imageLight?: string;
  className?: string;
  light?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const HEIGHT = { sm: "h-9", md: "h-12", lg: "h-16" };

export default function Logo({
  name,
  image,
  imageLight,
  className,
  light = false,
  size = "md",
  onClick,
}: LogoProps) {
  const src = light ? imageLight || image : image;
  return (
    <Link
      href="/"
      aria-label={`${name} — početna`}
      onClick={onClick}
      className={cn("inline-flex items-center", className)}
    >
      {src ? (
        // Wordmark ima proporcije ~2.5:1; visina je fiksna, širina prati.
        <Image
          src={src}
          alt={name}
          width={500}
          height={200}
          priority
          className={cn("w-auto", HEIGHT[size])}
        />
      ) : (
        <span
          className={cn(
            "font-display text-[1.55rem] font-semibold tracking-tight",
            light ? "text-white" : "text-foreground",
          )}
        >
          {name}
        </span>
      )}
    </Link>
  );
}

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function FormAlert({
  tone = "error",
  children,
  className,
}: {
  tone?: "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "success" ? CheckCircle2 : TriangleAlert;

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        tone === "success"
          ? "border-secondary/35 bg-secondary/8 text-secondary"
          : "border-tertiary/35 bg-tertiary/8 text-tertiary",
        className,
      )}
    >
      <Icon size={17} aria-hidden="true" className="mt-px shrink-0" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

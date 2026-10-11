import { cn } from "@/lib/utils/cn";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("text-muted border-border border-b px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase first:pl-5 last:pr-5", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-border border-b px-4 py-3 align-middle first:pl-5 last:pr-5", className)}>{children}</td>;
}

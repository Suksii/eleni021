import { cn } from "@/lib/utils/cn";

export function AdminHeader({ title, lead, actions, className }: { title: string; lead?: string; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
        {lead && <p className="text-muted mt-1 text-sm">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-surface shadow-card rounded-2xl", className)}>{children}</div>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-muted px-6 py-12 text-center text-sm">{children}</p>;
}

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "info" | "success" | "warning" | "danger" }) {
  const cls = {
    neutral: "bg-surface-2 text-muted",
    info: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-primary-soft text-danger",
  }[tone];
  return <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", cls)}>{label}</span>;
}

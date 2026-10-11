import { FIELD_CLS } from "@/features/shared/components/ui/Input";
import { cn } from "@/lib/utils/cn";

export function Field({ label, htmlFor, hint, error, className, children }: { label: string; htmlFor?: string; hint?: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[0.82rem] font-semibold">{label}</label>
      {children}
      {error ? <p role="alert" className="text-danger text-xs">{error}</p> : hint ? <p className="text-muted text-xs">{hint}</p> : null}
    </div>
  );
}

export function NativeSelect({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(FIELD_CLS, "bg-surface appearance-none", className)} {...props} />;
}

export function Toggle({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} className="accent-primary mt-0.5 size-4.5" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="text-muted block text-xs">{hint}</span>}
      </span>
    </label>
  );
}

export function FormSection({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("bg-surface shadow-card rounded-2xl p-5 md:p-6", className)}>
      {title && <h2 className="font-display mb-4 text-lg font-semibold">{title}</h2>}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

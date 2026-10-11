"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormAlert from "@/features/shared/components/ui/FormAlert";
import SubmitButton from "@/features/admin/components/SubmitButton";
import type { ActionState } from "@/features/admin/lib/form";
import { cn } from "@/lib/utils/cn";

interface AdminFormProps {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  aside?: React.ReactNode;
  className?: string;
}

// Polja su nekontrolisana (defaultValue) i dolaze kao children sa servera;
// ovde je samo stanje akcije, greške i toast.
export default function AdminForm({ action, children, submitLabel = "Sačuvaj", aside, className }: AdminFormProps) {
  const [state, formAction] = useActionState(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      toast.success("Sačuvano.");
      router.refresh();
    }
  }, [state, router]);

  const fieldErrors = Object.entries(state.fieldErrors ?? {});

  return (
    <form action={formAction} className={cn("space-y-5", className)}>
      {state.error && (
        <FormAlert>
          {state.error}
          {fieldErrors.length > 0 && (
            <ul className="mt-1 list-disc pl-4">
              {fieldErrors.map(([k, v]) => <li key={k}><span className="font-mono text-xs">{k}</span>: {v}</li>)}
            </ul>
          )}
        </FormAlert>
      )}
      <div className={cn("grid gap-5", aside && "lg:grid-cols-[1fr_20rem] lg:items-start")}>
        <div className="space-y-5">{children}</div>
        {aside && <div className="space-y-5 lg:sticky lg:top-6">{aside}</div>}
      </div>
      <div className="bg-surface/90 border-border sticky bottom-0 -mx-4 flex justify-end gap-3 border-t px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

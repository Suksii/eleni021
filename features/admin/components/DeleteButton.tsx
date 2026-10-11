"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

// Brisanje sa potvrdom u dva klika (bez window.confirm — blokira browser).
export default function DeleteButton({
  action,
  label = "Obriši",
  confirmLabel = "Potvrdi brisanje",
  className,
}: {
  action: () => Promise<{ error?: string } | void>;
  label?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const [armed, setArmed] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          setTimeout(() => setArmed(false), 3000);
          return;
        }
        start(async () => {
          const res = await action();
          if (res?.error) toast.error(res.error);
          else {
            toast.success("Obrisano.");
            router.refresh();
          }
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
        armed ? "bg-danger text-white" : "text-danger hover:bg-primary-soft",
        className,
      )}
    >
      <Trash2 size={14} aria-hidden="true" /> {armed ? confirmLabel : label}
    </button>
  );
}

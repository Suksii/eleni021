"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";

export type DrawerSide = "left" | "right" | "top";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  label: string;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

// Panel je plutajući — odmaknut od ivica i zaobljen, kao navigacija.
// Bez backdrop-blur-a: blur preko cele strane tokom animacije na telefonu seče frejmove.
const PANEL: Record<DrawerSide, string> = {
  left: "inset-y-2 left-2 w-[min(400px,calc(100vw-1rem))] sm:inset-y-4 sm:left-4",
  right:
    "inset-y-2 right-[calc(0.5rem+var(--scrollbar-comp,0px))] w-[min(440px,calc(100vw-1rem))] sm:inset-y-4 sm:right-[calc(1rem+var(--scrollbar-comp,0px))]",
  top: "inset-x-2 top-2 max-h-[86dvh] sm:inset-x-4 sm:top-4",
};

const OFFSET: Record<DrawerSide, Record<string, string | number>> = {
  left: { x: "-100%" },
  right: { x: "100%" },
  top: { y: "-100%" },
};

export default function Drawer({
  open,
  onClose,
  side = "right",
  label,
  title,
  footer,
  className,
  children,
}: DrawerProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(open);
  useKeyboardNav({ Escape: onClose }, { enabled: open });

  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-autofocus]");
    (first ?? el).focus({ preventScroll: true });
  }, [open]);

  const hidden = reduced ? { opacity: 0 } : OFFSET[side];
  const shown = reduced ? { opacity: 1 } : { x: 0, y: 0 };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={onClose}
            className="bg-foreground/40 fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? undefined : label}
            tabIndex={-1}
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className={cn(
              "bg-background border-foreground/10 shadow-custom fixed z-50 flex flex-col overflow-hidden rounded-3xl border outline-none",
              PANEL[side],
              className,
            )}
          >
            <div className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-5 py-4">
              <p className="font-display truncate text-base font-bold tracking-tight">
                {title ?? label}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Zatvori"
                className="border-foreground/15 bg-surface/70 hover:border-primary hover:text-primary -mr-1 grid size-10 shrink-0 place-items-center rounded-full border transition-colors"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto overscroll-contain">
              {children}
            </div>

            {footer && (
              <div className="border-border bg-background shrink-0 border-t">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

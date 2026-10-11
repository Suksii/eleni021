"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Pojavi se tek posle oko jedne i po visine ekrana (preuzeto iz lubenicashop-new).
const SHOW_AFTER_SCREENS = 1.5;

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

export default function BackToTop() {
  const visible = useSyncExternalStore(
    subscribe,
    () => window.scrollY > window.innerHeight * SHOW_AFTER_SCREENS,
    () => false,
  );

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Nazad na vrh"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "border-foreground/15 bg-background/90 hover:bg-foreground hover:text-background shadow-soft fixed right-[calc(1rem+var(--scrollbar-comp,0px))] bottom-4 z-30 grid size-11 place-items-center rounded-full border backdrop-blur transition-[opacity,transform,background-color,color] duration-300 sm:right-[calc(1.5rem+var(--scrollbar-comp,0px))] sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}

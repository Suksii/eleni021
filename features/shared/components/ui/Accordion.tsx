"use client";

import { Plus } from "lucide-react";
import Collapse from "@/features/shared/components/ui/Collapse";
import { useToggle } from "@/lib/hooks/useToggle";
import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  question: string;
  answer: string;
}

function AccordionRow({ question, answer }: AccordionItem) {
  const { open, toggle } = useToggle();
  return (
    <div className="border-line-2 border-b">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-5 py-5 text-left"
      >
        <span className="font-display text-lg font-medium md:text-xl">{question}</span>
        <span
          className={cn(
            "border-foreground/20 grid size-8 shrink-0 place-items-center rounded-full border transition-[background-color,color,transform] duration-300",
            open ? "bg-foreground text-background rotate-45" : "group-hover:bg-foreground group-hover:text-background",
          )}
        >
          <Plus size={15} aria-hidden="true" />
        </span>
      </button>
      <Collapse open={open}>
        <p className="text-muted max-w-[62ch] pb-5 leading-relaxed">{answer}</p>
      </Collapse>
    </div>
  );
}

// Preuzeto iz tehnoplus-new; tekst je običan (bez HTML-a), stil editorijalni.
export default function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={cn("border-line-2 border-t", className)}>
      {items.map((item) => <AccordionRow key={item.question} {...item} />)}
    </div>
  );
}

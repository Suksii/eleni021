"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

const RESET_MS = 1500;

// Preuzeto iz tehnoplus `CopyCode`: kopira tekst u clipboard uz kratku potvrdu.
export default function CopyButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      toast.error("Kopiranje nije uspelo.");
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setCopied(true);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
    toast.success(`Kopirano: ${text}`);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label ?? "Kopiraj"} ${text}`}
      className={cn("hover:text-primary inline-flex items-center gap-1.5 font-mono font-semibold transition-colors", className)}
    >
      {text}
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" className="opacity-60" />}
    </button>
  );
}

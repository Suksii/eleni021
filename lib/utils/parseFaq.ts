import type { AccordionItem } from "@/features/shared/components/ui/Accordion";

// CMS format: jedan red = "Pitanje? | Odgovor". Redovi bez " | " se preskaču.
export function parseFaq(text: string | undefined): AccordionItem[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.split("|"))
    .filter((parts) => parts.length >= 2)
    .map(([q, ...a]) => ({ question: q.trim(), answer: a.join("|").trim() }))
    .filter((i) => i.question && i.answer);
}

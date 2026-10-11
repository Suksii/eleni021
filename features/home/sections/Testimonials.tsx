import type { Testimonial } from "@/db/schema";

// Jedan veliki citat u prvom planu, ostali u jednom redu — ne tri jednake kartice.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const [first, ...rest] = items;
  return (
    <section className="wrap py-16 md:py-24" aria-labelledby="utisci">
      <p className="label-rule mb-8">Kažu naši kupci</p>
      <blockquote className="mx-auto max-w-4xl text-center">
        <p id="utisci" className="font-display text-2xl leading-snug font-medium tracking-tight text-balance md:text-4xl md:leading-tight">
          “{first.text}”
        </p>
        <footer className="mt-6 text-sm">
          <span className="font-semibold">{first.author}</span>
          {first.occasion && <span className="text-muted"> · {first.occasion}</span>}
        </footer>
      </blockquote>
      {rest.length > 0 && (
        <ul className="border-line-2 mt-12 grid gap-8 border-t pt-8 md:grid-cols-2">
          {rest.slice(0, 2).map((t) => (
            <li key={t.id}>
              <p className="text-foreground/85 leading-relaxed">“{t.text}”</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">{t.author}</span>
                {t.occasion && <span className="text-muted"> · {t.occasion}</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

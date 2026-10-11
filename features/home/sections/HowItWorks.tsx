import type { SiteSettings } from "@/features/site/api/getSettings";

const STEPS = [
  { title: "Izaberete", text: "Iz vitrine ili nam opišete šta zamišljate — ukus, veličinu, povod." },
  { title: "Naručite unapred", text: "Torte najmanje dva dana ranije, svečane i svadbene i do dve nedelje." },
  { title: "Preuzmete ili dostavimo", text: "U radionici, ili vam donesemo na adresu u dogovoreno vreme." },
];

export default function HowItWorks({ s }: { s: SiteSettings }) {
  return (
    <section className="wrap py-16 md:py-24" aria-labelledby="kako">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <p className="label-rule mb-4">Kako naručiti</p>
          <h2 id="kako" className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Tri koraka do torte
          </h2>
          {s.phone && (
            <p className="text-muted mt-4 text-sm leading-relaxed">
              Za sve nedoumice tu je i telefon:{" "}
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:text-primary">
                {s.phone}
              </a>
            </p>
          )}
        </div>
        <ol className="border-line-2 border-t">
          {STEPS.map((st, i) => (
            <li key={st.title} className="border-line-2 grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b py-6 md:grid-cols-[5rem_1fr] md:py-7">
              <span className="font-display text-primary text-3xl font-medium italic md:text-4xl">0{i + 1}</span>
              <div>
                <p className="font-display text-xl font-medium md:text-2xl">{st.title}</p>
                <p className="text-muted mt-1.5 max-w-[52ch] leading-relaxed">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

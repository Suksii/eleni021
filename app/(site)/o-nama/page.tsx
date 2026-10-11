import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/features/shared/components/page/PageHero";
import Testimonials from "@/features/home/sections/Testimonials";
import Closing from "@/features/home/sections/Closing";
import { getSettings } from "@/features/site/api/getSettings";
import { getTestimonials } from "@/features/testimonials/api/getTestimonials";
import { textToParagraphs } from "@/lib/utils/textToParagraphs";

export const metadata: Metadata = {
  title: "O nama",
  description: "Porodična slastičarnica u kojoj svaki recept ima svoju priču.",
};

const PRINCIPLES = [
  { title: "Pravi sastojci", text: "Maslac, sveže voće i čokolada koju biramo sami. Bez skraćenica i gotovih smesa." },
  { title: "Ručna izrada", text: "Svaka torta prođe kroz naše ruke, od biskvita do poslednjeg detalja na vrhu." },
  { title: "Po vašoj meri", text: "Ukus, veličina i izgled se dogovaraju s vama, ne biraju se iz kataloga." },
  { title: "Na vreme", text: "Preuzimanje ili dostava u dogovoreni sat, da se vi bavite gostima." },
];

export default async function AboutPage() {
  const [s, testimonials] = await Promise.all([getSettings(), getTestimonials()]);
  const paragraphs = textToParagraphs(s.aboutText ?? "");

  return (
    <>
      <PageHero label="O nama" title={s.aboutTitle || "Naša priča"} lead={paragraphs[0]} crumbs={[{ label: "O nama", href: "/o-nama" }]} />
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="space-y-6">
            <div className="bg-surface-2 relative aspect-[4/5] overflow-hidden rounded-lg">
              {s.aboutImage && <Image src={s.aboutImage} alt="Naša kuhinja" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />}
            </div>
            {s.aboutImageSecondary && (
              <div className="bg-surface-2 relative ml-auto aspect-[4/3] w-2/3 overflow-hidden rounded-lg">
                <Image src={s.aboutImageSecondary} alt="" fill sizes="30vw" className="object-cover" />
              </div>
            )}
          </div>
          <div className="lg:pt-4">
            <div className="text-foreground/85 space-y-5 text-lg leading-relaxed">
              {paragraphs.slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <dl className="border-line-2 mt-10 border-t">
              {PRINCIPLES.map((pr, i) => (
                <div key={pr.title} className="border-line-2 grid grid-cols-[3rem_1fr] gap-4 border-b py-5">
                  <dt className="font-display text-primary text-xl italic">0{i + 1}</dt>
                  <dd>
                    <p className="font-display text-xl font-medium">{pr.title}</p>
                    <p className="text-muted mt-1 leading-relaxed">{pr.text}</p>
                  </dd>
                </div>
              ))}
            </dl>
            {s.workingHours && (
              <p className="text-muted mt-8 text-sm">
                <span className="text-foreground font-semibold">Radno vreme:</span> {s.workingHours}
                {s.address && <> · {s.address}</>}
              </p>
            )}
          </div>
        </div>
      </div>
      <Testimonials items={testimonials} />
      <Closing s={s} />
    </>
  );
}

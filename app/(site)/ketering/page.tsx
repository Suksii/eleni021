import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import PageHero from "@/features/shared/components/page/PageHero";
import PackageCard from "@/features/catering/components/PackageCard";
import InquiryForm from "@/features/inquiries/components/InquiryForm";
import Accordion from "@/features/shared/components/ui/Accordion";
import { parseFaq } from "@/lib/utils/parseFaq";
import { getPackages } from "@/features/catering/api/getPackages";
import { getSettings } from "@/features/site/api/getSettings";

export const metadata: Metadata = {
  title: "Ketering i slatki sto",
  description:
    "Slatki stolovi, poslovni doručci i dečji rođendani — paketi po broju gostiju, sa dostavom i postavkom.",
};

const STEPS = [
  {
    n: "01",
    title: "Pošaljite upit",
    text: "Datum, broj gostiju i šta vam je važno.",
  },
  {
    n: "02",
    title: "Ponuda za 24h",
    text: "Predložimo paket i cenu, po potrebi degustaciju.",
  },
  {
    n: "03",
    title: "Mi radimo ostalo",
    text: "Dostava, postavka i dekoracija na dan događaja.",
  },
];

async function PackagePicker({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const { paket } = await searchParams;
  const packages = await getPackages();
  const defaultPackageId = Number(paket) || undefined;
  return (
    <InquiryForm
      type="ketering"
      showEvent
      packages={packages.map(({ id, name }) => ({ id, name }))}
      defaultPackageId={defaultPackageId}
      submitLabel="Zatraži ponudu"
      messagePlaceholder="Opišite događaj — prostor, satnica, posebne želje, alergije…"
    />
  );
}

export default async function CateringPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const [packages, s] = await Promise.all([getPackages(), getSettings()]);
  const faq = parseFaq(s.cateringFaq);

  return (
    <>
      <PageHero
        label="Ketering"
        title={s.cateringTitle || "Ketering za svaku priliku"}
        lead={s.cateringText}
        crumbs={[{ label: "Ketering", href: "/ketering" }]}
      />

      <div className="wrap">
        <ol className="border-line-2 md:divide-line-2 grid border-t md:grid-cols-3 md:divide-x">
          {STEPS.map((st) => (
            <li
              key={st.n}
              className="border-line-2 flex gap-4 border-b py-5 md:border-b-0 md:px-6 md:first:pl-0"
            >
              <span className="font-display text-primary text-3xl italic">
                {st.n}
              </span>
              <div>
                <p className="font-display text-xl font-medium">{st.title}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">
                  {st.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 space-y-6">
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>

        {faq.length > 0 && (
          <section
            className="mt-20 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16"
            aria-labelledby="faq"
          >
            <div>
              <p className="label-rule mb-4">Česta pitanja</p>
              <h2
                id="faq"
                className="font-display text-3xl font-medium tracking-tight md:text-4xl"
              >
                Pre nego što pitate
              </h2>
            </div>
            <Accordion items={faq} />
          </section>
        )}

        <section
          id="upit"
          className="mt-20 grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
          aria-labelledby="upit-naslov"
        >
          <div>
            <p className="label-rule mb-4">Upit</p>
            <h2
              id="upit-naslov"
              className="font-display text-3xl font-medium tracking-tight md:text-4xl"
            >
              Recite nam o vašem događaju
            </h2>
            <p className="text-muted mt-4 leading-relaxed">
              Popunite formu ili nas pozovite. Ponudu prilagođavamo broju
              gostiju, prostoru i budžetu.
            </p>
            {s.cateringImage && (
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-lg lg:block">
                <Image
                  src={s.cateringImage}
                  alt=""
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="border-line-2 relative rounded-lg border p-6 md:p-8">
            <Suspense
              fallback={
                <InquiryForm
                  type="ketering"
                  showEvent
                  submitLabel="Zatraži ponudu"
                />
              }
            >
              <PackagePicker searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </div>
    </>
  );
}

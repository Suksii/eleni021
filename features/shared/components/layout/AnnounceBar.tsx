import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSettings } from "@/features/site/api/getSettings";

// Obaveštenje ispod plutajućeg headera (npr. praznični rok za narudžbe) —
// tekst i link iz CMS podešavanja; prazno = ne prikazuje se.
export default async function AnnounceBar() {
  const s = await getSettings();
  const text = s.announceText?.trim();
  if (!text) return null;
  const href = s.announceLink?.trim();
  const inner = (
    <>
      <span className="text-primary">✦</span>
      <span>{text}</span>
      {href && <ArrowRight size={14} aria-hidden="true" />}
    </>
  );
  const cls = "wrap flex items-center justify-center gap-2 py-2 text-center text-sm";
  return (
    <div className="border-line-2 bg-surface-2/60 border-b">
      {href ? (
        href.startsWith("/") ? (
          <Link href={href} className={`${cls} hover:text-primary`}>{inner}</Link>
        ) : (
          <a href={href} rel="noopener" className={`${cls} hover:text-primary`}>{inner}</a>
        )
      ) : (
        <p className={cls}>{inner}</p>
      )}
    </div>
  );
}

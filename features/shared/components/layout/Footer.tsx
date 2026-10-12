import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/features/shared/components/icons/Social";
import TrackLink from "@/features/shared/components/ui/TrackLink";
import { telHref } from "@/lib/utils/phone";
import Logo from "@/features/shared/components/layout/Logo";
import CurrentYear from "@/features/shared/components/layout/CurrentYear";
import { getSettings } from "@/features/site/api/getSettings";
import { getCategories } from "@/features/categories/api/getCategories";
import { NAV_LINKS } from "@/config/site.config";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display mb-4 text-base italic text-white/55">
        {title}
      </h2>
      {children}
    </div>
  );
}

const LINK = "text-white/80 transition-colors hover:text-white";

export default async function Footer() {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);
  const siteName = s.siteName || "Eleni";

  return (
    <footer className="bg-foreground mt-24 text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo name={siteName} image={s.logo} imageLight={s.logoLight} light size="lg" />
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-white/70">
            {s.footerText}
          </p>
          <div className="mt-5 flex gap-2">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <InstagramIcon size={18} />
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <FacebookIcon size={18} />
              </a>
            )}
          </div>
        </div>

        <Column title="Ponuda">
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/kategorija/${c.slug}`} className={LINK}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Sajt">
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>{l.label}</Link>
              </li>
            ))}
            <li><Link href="/korpa" className={LINK}>Korpa</Link></li>
          </ul>
        </Column>

        <Column title="Kontakt">
          <ul className="space-y-3 text-sm text-white/80">
            {s.address && (
              <li className="flex gap-2.5"><MapPin size={17} aria-hidden="true" className="text-accent mt-0.5 shrink-0" />{s.address}</li>
            )}
            {s.phone && (
              <li className="flex gap-2.5"><Phone size={17} aria-hidden="true" className="text-accent mt-0.5 shrink-0" /><TrackLink channel="poziv" where="footer" href={telHref(s.phone)} className={LINK}>{s.phone}</TrackLink></li>
            )}
            {s.email && (
              <li className="flex gap-2.5"><Mail size={17} aria-hidden="true" className="text-accent mt-0.5 shrink-0" /><TrackLink channel="email" where="footer" href={`mailto:${s.email}`} className={LINK}>{s.email}</TrackLink></li>
            )}
            {s.workingHours && (
              <li className="flex gap-2.5"><Clock size={17} aria-hidden="true" className="text-accent mt-0.5 shrink-0" />{s.workingHours}</li>
            )}
          </ul>
        </Column>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/50">
          <p>© <CurrentYear /> {siteName}. Sva prava zadržana.</p>
          <Link href="/admin" className="transition-colors hover:text-white/80">Administracija</Link>
        </div>
      </div>
    </footer>
  );
}

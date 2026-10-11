"use client";

import Link from "next/link";
import { Suspense, useCallback, useState, useSyncExternalStore } from "react";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import Logo from "@/features/shared/components/layout/Logo";
import ActiveMark from "@/features/shared/components/layout/ActiveMark";
import PathnameWatcher from "@/features/shared/components/layout/PathnameWatcher";
import CartButton from "@/features/cart/components/CartButton";
import Drawer from "@/features/shared/components/ui/Drawer";
import { InstagramIcon } from "@/features/shared/components/icons/Social";
import { NAV_LINKS } from "@/config/site.config";
import { cn } from "@/lib/utils/cn";

export interface NavCategory {
  id: number;
  name: string;
  slug: string;
}

export interface HeaderBarProps {
  siteName: string;
  logo?: string;
  categories: NavCategory[];
  phone: string;
  instagram: string;
}

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

const NAV_LINK_CLS =
  "group relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors text-foreground/75 hover:text-foreground hover:bg-surface-2/80 has-[[data-active]]:bg-primary-soft has-[[data-active]]:text-primary";

// Plutajuća "pilula" navigacija (kao Podix): odmaknuta od ivica, zaobljena,
// staklasta; na skrol postaje gušća. Mobilni meni je plutajući Drawer s desne
// strane (isti oblik kao korpa) — header ostaje na mestu, link zatvori drawer
// i navigira kao običan Link (kao MenuDrawer u lubenicashop-new). Aktivno
// stanje linkova daje `ActiveMark` (jedini deo koji čita `usePathname`, zato
// u sopstvenom Suspense-u).
export default function HeaderBar({
  siteName,
  logo,
  categories,
  phone,
  instagram,
}: HeaderBarProps) {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";

  return (
    <>
      <Suspense fallback={null}>
        <PathnameWatcher onChange={close} />
      </Suspense>

      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 pr-[calc(0.75rem+var(--scrollbar-comp,0px))] sm:px-5 sm:pt-4 sm:pr-[calc(1.25rem+var(--scrollbar-comp,0px))]">
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border pr-2.5 pl-4 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-6",
            // Na telefonu slabiji blur: jak backdrop-blur na fiksiranom headeru
            // preko sadržaja koji skroluje seče frejmove.
            scrolled
              ? "border-foreground/10 bg-background/95 shadow-soft sm:bg-background/90 backdrop-blur-sm sm:backdrop-blur-xl"
              : "shadow-soft border-white/60 bg-white/70 backdrop-blur-sm sm:bg-white/55 sm:backdrop-blur-md",
          )}
        >
          <Logo name={siteName} image={logo} />

          {/* Desktop nav */}
          <nav
            aria-label="Glavna navigacija"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const hrefs =
                link.href === "/proizvodi"
                  ? ["/proizvodi", "/kategorija", "/proizvod"]
                  : [link.href];
              const mark = (
                <Suspense fallback={null}>
                  <ActiveMark hrefs={hrefs} />
                </Suspense>
              );

              if (link.href !== "/proizvodi" || categories.length === 0) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={NAV_LINK_CLS}
                  >
                    {mark}
                    {link.label}
                  </Link>
                );
              }

              // Dropdown sa kategorijama — isti stakleni, zaobljeni oblik kao pilula.
              return (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    aria-haspopup="true"
                    className={NAV_LINK_CLS}
                  >
                    {mark}
                    {link.label}
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180"
                    />
                  </Link>
                  <div className="pointer-events-none absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 [transform:translate(-50%,6px)] pt-3 opacity-0 transition-[opacity,transform] duration-200 group-focus-within:pointer-events-auto group-focus-within:[transform:translate(-50%,0)] group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:[transform:translate(-50%,0)] group-hover:opacity-100">
                    <div className="border-foreground/10 bg-background/95 shadow-soft rounded-3xl border p-2 backdrop-blur-xl">
                      <Link
                        href="/proizvodi"
                        className="hover:bg-surface-2 flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        Svi proizvodi{" "}
                        <ArrowRight
                          size={15}
                          aria-hidden="true"
                          className="text-primary"
                        />
                      </Link>
                      <ul className="border-foreground/10 mt-1 border-t pt-1">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/kategorija/${c.slug}`}
                              className="hover:bg-surface-2 has-[[data-active]]:text-primary block rounded-2xl px-4 py-2 text-sm transition-colors has-[[data-active]]:font-semibold"
                            >
                              <Suspense fallback={null}>
                                <ActiveMark
                                  hrefs={[`/kategorija/${c.slug}`]}
                                  exact
                                />
                              </Suspense>
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {telHref && (
              <a
                href={telHref}
                className="text-foreground/80 hover:text-primary hidden items-center gap-2 pr-2 text-sm font-semibold transition-colors xl:flex"
              >
                <Phone size={15} aria-hidden="true" />
                {phone}
              </a>
            )}
            <Link
              href="/ketering"
              className="group bg-primary shadow-glow hidden items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 lg:inline-flex"
            >
              Zatraži ponudu
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <CartButton />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Otvori meni"
              aria-expanded={open}
              className="border-foreground/15 bg-surface/70 grid size-11 place-items-center rounded-full border lg:hidden"
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <span className="bg-foreground h-0.5 w-full rounded-full" />
                <span className="bg-foreground h-0.5 w-full rounded-full" />
                <span className="bg-foreground h-0.5 w-3.5 rounded-full" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobilni meni — plutajući drawer, isti oblik kao korpa. */}
      <Drawer
        open={open}
        onClose={close}
        side="right"
        label="Meni"
        title="Meni"
        className="lg:hidden"
      >
        <nav aria-label="Mobilna navigacija" className="px-5 pt-2 pb-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="border-foreground/10 font-display has-[[data-active]]:text-primary flex items-center justify-between border-b py-4 text-xl font-semibold tracking-tight"
            >
              <Suspense fallback={null}>
                <ActiveMark hrefs={[link.href]} />
              </Suspense>
              {link.label}
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="text-primary"
              />
            </Link>
          ))}

          {categories.length > 0 && (
            <div className="mt-5">
              <p className="eyebrow mb-2">Kategorije</p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/kategorija/${c.slug}`}
                      onClick={close}
                      className="border-foreground/15 bg-surface/70 hover:border-primary has-[[data-active]]:border-primary has-[[data-active]]:bg-primary-soft has-[[data-active]]:text-primary relative block rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
                    >
                      <Suspense fallback={null}>
                        <ActiveMark hrefs={[`/kategorija/${c.slug}`]} exact />
                      </Suspense>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            {telHref && (
              <a
                href={telHref}
                className="text-primary inline-flex items-center gap-2 text-base font-semibold"
              >
                <Phone size={18} aria-hidden="true" /> {phone}
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="text-primary inline-flex items-center gap-2 text-base font-semibold"
              >
                <InstagramIcon size={18} /> Instagram
              </a>
            )}
            <Link
              href="/ketering"
              onClick={close}
              className="bg-primary shadow-glow inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white"
            >
              Zatraži ponudu <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </Drawer>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";
import { MessageCircle, Phone, X } from "lucide-react";
import { ViberIcon, WhatsAppIcon } from "@/features/shared/components/icons/Social";
import { telHref, viberHref, whatsappHref } from "@/lib/utils/phone";
import { cn } from "@/lib/utils/cn";

interface ContactFabProps {
  phone: string;
  viber: string;
  whatsapp: string;
}

const WA_TEXT = "Zdravo! Zanima me narudžba.";

// Lebdeće dugme za kontakt (dole desno): jedno dugme koje otvara tri okrugle
// ikonice (WhatsApp / Viber / poziv) bez teksta — naziv je u aria-label/title. Kanali bez broja u CMS-u se ne prikazuju. Skriveno na
// narudžbi (da ne odvlači od forme). Drawer-i su z-50 i prekrivaju ga.
export default function ContactFab({ phone, viber, whatsapp }: ContactFabProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const items = [
    whatsapp && { key: "whatsapp", label: "WhatsApp", href: whatsappHref(whatsapp, WA_TEXT), Icon: WhatsAppIcon, cls: "bg-[#25d366] text-white" },
    viber && { key: "viber", label: "Viber", href: viberHref(viber), Icon: ViberIcon, cls: "bg-[#7360f2] text-white" },
    phone && { key: "poziv", label: `Pozovi ${phone}`, href: telHref(phone), Icon: Phone, cls: "bg-primary text-white" },
  ].filter((i): i is Exclude<typeof i, "" | false> => Boolean(i));

  if (items.length === 0 || pathname.startsWith("/narudzba")) return null;

  const choose = (key: string) => {
    track("kontakt", { kanal: key, mesto: pathname });
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="fixed right-[calc(1rem+var(--scrollbar-comp,0px))] bottom-4 z-40 flex flex-col items-end gap-2 sm:right-[calc(1.5rem+var(--scrollbar-comp,0px))] sm:bottom-6"
    >
      <ul
        id="kontakt-meni"
        role="menu"
        aria-label="Kontakt"
        className={cn(
          "flex flex-col items-end gap-2 transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {items.map(({ key, label, href, Icon, cls }) => (
          <li key={key} role="none">
            <a
              role="menuitem"
              href={href}
              target={key === "whatsapp" ? "_blank" : undefined}
              rel={key === "whatsapp" ? "noreferrer" : undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => choose(key)}
              aria-label={label}
              title={label}
              className={cn(
                "shadow-soft grid size-12 place-items-center rounded-full transition-transform hover:scale-[1.06] motion-reduce:transition-none",
                cls,
              )}
            >
              <Icon size={22} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="kontakt-meni"
        aria-label={open ? "Zatvori kontakt" : "Pišite nam ili pozovite"}
        className="bg-foreground text-background hover:bg-primary shadow-soft grid size-14 place-items-center rounded-full transition-colors"
      >
        {open ? <X size={22} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
      </button>
    </div>
  );
}

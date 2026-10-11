"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cake, ExternalLink, Images, Inbox, LayoutDashboard, LogOut, MessageSquareQuote,
  Settings, ShoppingBag, Tags, UtensilsCrossed,
} from "lucide-react";
import { logout } from "@/features/admin/actions/auth";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/admin", label: "Pregled", icon: LayoutDashboard, exact: true },
  { href: "/admin/narudzbe", label: "Narudžbe", icon: ShoppingBag },
  { href: "/admin/upiti", label: "Upiti", icon: Inbox },
  { href: "/admin/proizvodi", label: "Proizvodi", icon: Cake },
  { href: "/admin/kategorije", label: "Kategorije", icon: Tags },
  { href: "/admin/ketering", label: "Ketering", icon: UtensilsCrossed },
  { href: "/admin/galerija", label: "Galerija", icon: Images },
  { href: "/admin/utisci", label: "Utisci", icon: MessageSquareQuote },
  { href: "/admin/podesavanja", label: "Podešavanja", icon: Settings },
];

export default function AdminNav({ badges, userName }: { badges: { orders: number; inquiries: number }; userName: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Administracija" className="flex h-full flex-col">
      <ul className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:p-3">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          const badge = href === "/admin/narudzbe" ? badges.orders : href === "/admin/upiti" ? badges.inquiries : 0;
          return (
            <li key={href} className="shrink-0">
              <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors", active ? "bg-primary text-white" : "hover:bg-surface-2")}>
                <Icon size={17} aria-hidden="true" />
                {label}
                {badge > 0 && <span className={cn("ml-auto rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold", active ? "bg-white/25" : "bg-primary text-white")}>{badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-border mt-auto hidden border-t p-3 lg:block">
        <p className="text-muted truncate px-3 text-xs">{userName}</p>
        <a href="/" target="_blank" rel="noreferrer" className="hover:bg-surface-2 mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm"><ExternalLink size={16} aria-hidden="true" /> Otvori sajt</a>
        <form action={logout}>
          <button type="submit" className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm"><LogOut size={16} aria-hidden="true" /> Odjava</button>
        </form>
      </div>
    </nav>
  );
}

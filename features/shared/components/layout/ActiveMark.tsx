"use client";

import { usePathname } from "next/navigation";

// Jedini deo headera koji zavisi od `usePathname` (runtime podatak). Ide u
// sopstveni <Suspense>, pa ostatak headera (korpa, meni, skrol) ostaje van
// granice i hidrira se odmah. Roditelj boji tekst preko `has-[[data-active]]`.
export default function ActiveMark({
  hrefs,
  exact = false,
  className,
}: {
  hrefs: string[];
  exact?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const active = hrefs.some((h) =>
    exact ? pathname === h : pathname === h || pathname.startsWith(`${h}/`),
  );
  if (!active) return null;
  return <span data-active="" aria-hidden="true" className={className} />;
}

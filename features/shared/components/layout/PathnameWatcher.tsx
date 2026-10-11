"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Poziva `onChange` pri svakoj promeni rute — koristi se za zatvaranje
// drawera/menija. Sam koristi `usePathname`, pa ide iza <Suspense>.
export default function PathnameWatcher({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange();
  }, [pathname, onChange]);
  return null;
}

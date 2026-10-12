"use client";

import { useEffect } from "react";
import Link from "next/link";

// Granica greške za javni sajt — header i footer ostaju, umesto sadržaja
// poruka i dugme koje ponovo renderuje stranicu.
export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Greška</p>
      <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">Nešto je pošlo naopako</h1>
      <p className="text-muted mt-3 max-w-[44ch]">
        Stranica trenutno ne može da se učita. Pokušajte ponovo za koji trenutak, a za narudžbe nas uvek možete pozvati.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="bg-primary hover:bg-primary-hover inline-flex h-12 items-center rounded-full px-6 font-semibold text-white transition-colors"
        >
          Pokušaj ponovo
        </button>
        <Link
          href="/"
          className="border-border hover:bg-surface-2 inline-flex h-12 items-center rounded-full border px-6 font-semibold transition-colors"
        >
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function AdminError({
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
    <div className="bg-surface shadow-card rounded-3xl p-8 text-center">
      <p className="eyebrow">Greška</p>
      <h1 className="font-display mt-2 text-2xl font-semibold">Stranica nije mogla da se učita</h1>
      <p className="text-muted mt-2 text-sm">
        Najčešće je privremen problem sa bazom. Pokušajte ponovo; ako se ponavlja, javite programeru.
        {error.digest && <span className="block mt-1 font-mono text-xs">Oznaka: {error.digest}</span>}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="bg-primary hover:bg-primary-hover mt-6 inline-flex h-11 items-center rounded-full px-6 font-semibold text-white transition-colors"
      >
        Pokušaj ponovo
      </button>
    </div>
  );
}

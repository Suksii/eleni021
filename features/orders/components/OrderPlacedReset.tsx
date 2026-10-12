"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { useCart } from "@/features/cart/CartContext";

// Posle uspešne narudžbe prazni lokalnu korpu i beleži događaj (jednom po
// narudžbi — stranica se može osvežiti).
export default function OrderPlacedReset({ code, total }: { code: string; total: number }) {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    const key = `narudzba-tracked:${code}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* privatni režim i sl. — svejedno beležimo */
    }
    track("narudzba", { iznos: total });
  }, [clear, code, total]);
  return null;
}

"use client";

import { useEffect } from "react";
import { useCart } from "@/features/cart/CartContext";

// Posle uspešne narudžbe prazni lokalnu korpu.
export default function OrderPlacedReset() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}

"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// Godina se računa tek na klijentu — prerender dobija prazan snapshot, pa
// `new Date()` ne ulazi u statičku ljusku.
export default function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}

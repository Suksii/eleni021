"use client";

import { track } from "@vercel/analytics";
import { logEvent } from "@/features/site/actions/events";

export type ContactChannel = "poziv" | "viber" | "whatsapp" | "email" | "instagram";

// Klik na kontakt: Vercel Analytics (zbirno) + naša baza (lista sa vremenom,
// /admin/statistika). Nijedno ne sme da uspori ili spreči sam klik.
export function trackContact(channel: ContactChannel, where?: string) {
  const path = typeof window === "undefined" ? "" : window.location.pathname;
  const mesto = where ? `${path}#${where}` : path;
  try {
    track("kontakt", { kanal: channel, mesto });
  } catch {
    /* analytics nije učitan */
  }
  void logEvent({ name: "kontakt", channel, path: mesto });
}

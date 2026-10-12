"use server";

import { z } from "zod";
import { db } from "@/db";
import { EVENT_NAMES, events } from "@/db/schema";

const schema = z.object({
  name: z.enum(EVENT_NAMES),
  channel: z.enum(["poziv", "viber", "whatsapp", "email", "instagram"]),
  path: z.string().max(200).regex(/^\/[^\s]*$/).or(z.literal("")),
});

// Javna akcija (bez sesije) — beleži anoniman klik. Nikad ne baca ka klijentu:
// statistika ne sme da pokvari poziv ili otvaranje Vibera.
export async function logEvent(input: { name: string; channel: string; path: string }): Promise<void> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return;
  try {
    await db.insert(events).values(parsed.data);
  } catch (e) {
    console.error("logEvent:", e);
  }
}

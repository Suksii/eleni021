import { inArray, lt, or } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { loginAttempts } from "@/db/schema";

// Posle MAX_ATTEMPTS neuspešnih prijava u WINDOW_MS (za isti email ili istu IP
// adresu) prijava se blokira na BLOCK_MS. Brojač je u bazi jer je Vercel
// serverless — memorija procesa ne preživi između poziva.
export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60_000;
export const BLOCK_MS = 15 * 60_000;

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip") || "unknown";
}

export async function loginKeys(email: string): Promise<string[]> {
  return [`ip:${await clientIp()}`, `email:${email.toLowerCase()}`];
}

/** Koliko minuta je prijava još blokirana za bilo koji od ključeva, 0 ako nije. */
export async function blockedMinutes(keys: string[]): Promise<number> {
  const now = Date.now();
  const rows = await db
    .select({ blockedUntil: loginAttempts.blockedUntil })
    .from(loginAttempts)
    .where(inArray(loginAttempts.key, keys));
  const until = Math.max(0, ...rows.map((r) => r.blockedUntil?.getTime() ?? 0));
  return until > now ? Math.ceil((until - now) / 60_000) : 0;
}

/** Beleži neuspešan pokušaj; blokira kad se dostigne MAX_ATTEMPTS u prozoru. */
export async function recordFailure(keys: string[]): Promise<void> {
  const now = new Date();
  const windowStart = now.getTime() - WINDOW_MS;
  const existing = await db
    .select({ key: loginAttempts.key, attempts: loginAttempts.attempts, lastAttemptAt: loginAttempts.lastAttemptAt })
    .from(loginAttempts)
    .where(inArray(loginAttempts.key, keys));
  const byKey = new Map(existing.map((r) => [r.key, r]));

  for (const key of keys) {
    const prev = byKey.get(key);
    // Pokušaji stariji od prozora se zaboravljaju — brojanje kreće ispočetka.
    const attempts = prev && prev.lastAttemptAt.getTime() >= windowStart ? prev.attempts + 1 : 1;
    const blockedUntil = attempts >= MAX_ATTEMPTS ? new Date(now.getTime() + BLOCK_MS) : null;
    await db
      .insert(loginAttempts)
      .values({ key, attempts, lastAttemptAt: now, blockedUntil })
      .onConflictDoUpdate({ target: loginAttempts.key, set: { attempts, lastAttemptAt: now, blockedUntil } });
  }
}

/** Uspešna prijava briše brojače; usput čisti i zastarele redove. */
export async function clearFailures(keys: string[]): Promise<void> {
  const stale = new Date(Date.now() - Math.max(WINDOW_MS, BLOCK_MS));
  await db
    .delete(loginAttempts)
    .where(or(inArray(loginAttempts.key, keys), lt(loginAttempts.lastAttemptAt, stale)));
}
